import Styled from '@common/StyledComponents';
import CustomComponents from '@common/CustomComponents';
import {useState, useEffect} from 'react';
import {Dimensions, Alert, Platform} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
import Icons from '@icons/icons.js';
import Images from '@images/images.js';
import {fetchData} from '@utils/fetchData';
import {API_URL} from '@env';
import storage from '@utils/MMKVStore';
import {useMMKVBoolean, useMMKVString} from 'react-native-mmkv';
import ReactNativeBiometrics from 'react-native-biometrics';

const PinLogin = () => {
  const {t} = useTranslation();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isConfirmingPin, setIsConfirmingPin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useMMKVBoolean('loading');
  const [accessToken] = useMMKVString('accessToken');
  const [, setIsPinVerified] = useMMKVBoolean('isPinVerified');
  const navigation = useNavigation();
  const route = useRoute();
  const screenWidth = Dimensions.get('screen').width;

  // Route params
  const userIdFromParams = route.params?.userId;
  const firstNameFromParams = route.params?.firstName || route.params?.userName || '';
  const phoneNumber = route.params?.phone;
  const setupPin = route.params?.setupPin || false;
  const enableBiometric = route.params?.enableBiometric || false;

  // State for user info (from params or storage)
  const [userId, setUserId] = useState(userIdFromParams);
  const [firstName, setFirstName] = useState(firstNameFromParams);

  // Eğer Navigation'dan geliyorsa (accessToken var ama PIN doğrulanmamış), kullanıcı bilgilerini storage'dan al
  useEffect(() => {
    if (!userIdFromParams && accessToken) {
      try {
        const userString = storage.getString('user');
        if (userString) {
          const user = JSON.parse(userString);
          setUserId(user.id || user.user_id);
          setFirstName(user.first_name || '');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, [accessToken, userIdFromParams]);

  // Sayfa açıldığında biyometrik kimlik doğrulama etkinse otomatik olarak parmak izi modalını aç
  useEffect(() => {
    // Sadece setup PIN değilse ve biyometrik kimlik doğrulama etkinse
    if (!setupPin && userId) {
      const isBiometricEnabled = storage.getBoolean('biometricEnabled');
      if (isBiometricEnabled) {
        // Kısa bir gecikme ile parmak izi modalını aç (sayfa yüklenmesi için)
        const timer = setTimeout(() => {
          handleBiometricAuth();
        }, 500);
        
        return () => clearTimeout(timer);
      }
    }
  }, [setupPin, userId]);

  // Biyometrik kimlik doğrulama fonksiyonu
  const handleBiometricAuth = async () => {
    // Setup PIN durumunda biyometrik kimlik doğrulama kullanma
    if (setupPin) {
      return;
    }

    if (!userId) {
      setError(t('somethingWentWrong'));
      return;
    }

    // Biyometrik kimlik doğrulama etkin mi kontrol et
    const isBiometricEnabled = storage.getBoolean('biometricEnabled');
    if (!isBiometricEnabled) {
      return;
    }

    try {
      if (!ReactNativeBiometrics) {
        Alert.alert(t('error'), t('biometricNotAvailable'));
        return;
      }

      const rnBiometrics = new ReactNativeBiometrics({
        allowDeviceCredentials: true,
      });

      if (!rnBiometrics || !rnBiometrics.isSensorAvailable) {
        Alert.alert(t('error'), t('biometricNotAvailable'));
        return;
      }

      // Biyometrik kimlik doğrulama mevcut mu kontrol et
      const resultObject = await rnBiometrics.isSensorAvailable();
      
      if (!resultObject || !resultObject.available) {
        Alert.alert(
          t('error'),
          t('biometricNotAvailable'),
        );
        return;
      }

      // Biyometrik kimlik doğrulama iste
      const promptResult = await rnBiometrics.simplePrompt({
        promptMessage: t('biometricPrompt'),
        cancelButtonText: t('cancel'),
      });
      
      console.log('Biometric prompt result:', promptResult);
      
      const {success} = promptResult || {};

      if (success) {
        // Biyometrik kimlik doğrulama başarılı, PIN ile login yap
        const savedPin = storage.getString('biometricPin');
        
        if (!savedPin) {
          setError(t('biometricPinNotSet'));
          setLoading(false);
          return;
        }

        // userId kontrolü
        if (!userId) {
          setError(t('somethingWentWrong'));
          setLoading(false);
          return;
        }

        // PIN ile login yap
        setLoading(true);
        setError('');

        try {
          const result = await fetchData({
            url: `${API_URL}/login/`,
            method: 'POST',
            body: {
              user_id: userId,
              pin_code: savedPin,
            },
          });

          console.log('Biometric login result:', result);

          if (result?.success) {
            // Token'ları kaydet
            const {access, refresh, user} = result.data;
            
            storage.set('accessToken', access);
            storage.set('refreshToken', refresh);
            storage.set('user', JSON.stringify(user));
            storage.set('isLoggedIn', true);
            storage.set('isPinVerified', true);
            setIsPinVerified(true); // Hook'u manuel olarak güncelle - Navigation.jsx otomatik olarak TabStack'e geçecek
          } else {
            setError(t('incorrectPin'));
          }
        } catch (loginError) {
          console.error('Biometric login error:', loginError);
          setError(t('somethingWentWrong'));
        } finally {
          setLoading(false);
        }
      } else {
        // Kullanıcı iptal etti veya başarısız oldu
        console.log('Biometric authentication cancelled or failed');
      }
    } catch (error) {
      console.error('Biometric error:', error);
      setLoading(false);
      if (error?.message?.includes('null') || error?.message?.includes('isSensorAvailable')) {
        Alert.alert(
          t('error'),
          t('biometricNotAvailable'),
        );
      } else {
        setError(t('biometricError'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNumberPress = (number) => {
    if (setupPin && isConfirmingPin) {
      // İkinci PIN girişi
      if (confirmPin.length < 4) {
        setConfirmPin(prev => prev + number);
        setError('');
      }
    } else {
      // İlk PIN girişi
      if (pin.length < 4) {
        setPin(prev => prev + number);
        setError('');
      }
    }
  };

  const handleDelete = () => {
    if (setupPin && isConfirmingPin) {
      // İkinci PIN'den sil
      setConfirmPin(prev => prev.slice(0, -1));
      setError('');
    } else {
      // İlk PIN'den sil
      setPin(prev => prev.slice(0, -1));
      setError('');
    }
  };

  const handlePinComplete = async () => {
    if (setupPin && !isConfirmingPin && pin.length === 4) {
      // İlk PIN tamamlandı, ikinci PIN'e geç
      setIsConfirmingPin(true);
      setError('');
      return;
    }

    if (setupPin && isConfirmingPin && confirmPin.length === 4) {
      // İkinci PIN tamamlandı, PIN'leri karşılaştır
      if (pin !== confirmPin) {
        setError(t('pinMismatch'));
        setPin('');
        setConfirmPin('');
        setIsConfirmingPin(false);
        return;
      }

      // PIN'ler eşleşiyor, API'ye gönder
      setLoading(true);
      setError('');

      try {
        if (!phoneNumber) {
          setError(t('phoneNumberRequired'));
          setPin('');
          setConfirmPin('');
          setIsConfirmingPin(false);
          setLoading(false);
          return;
        }

        const result = await fetchData({
          url: `${API_URL}/set-pin/`,
          method: 'POST',
          body: {
            phone_number: phoneNumber,
            pin_code: pin,
          },
        });

          console.log('Set PIN result:', result);

          if (result?.success) {
            // PIN başarıyla set edildi
            // set-pin API'si zaten token'ları döndürüyor, tekrar login API'sine çağrı yapmaya gerek yok
            const {access, refresh, user} = result.data;

            if (access && refresh && user) {
                // Token'ları kaydet
                
                storage.set('accessToken', access);
                storage.set('refreshToken', refresh);
                storage.set('user', JSON.stringify(user));
                storage.set('isLoggedIn', true);
                storage.set('isPinVerified', true);
                setIsPinVerified(true); // Hook'u manuel olarak güncelle - Navigation.jsx otomatik olarak TabStack'e geçecek

                // Parmak izi ile giriş isteyip istemediğini sor
                Alert.alert(
                  t('enableBiometric'),
                  t('enableBiometricMessage'),
                  [
                    {
                      text: t('no'),
                      style: 'cancel',
                      onPress: () => {
                        // Parmak izi istemedi, direkt ana sayfaya yönlendir
                        navigation.reset({
                          index: 0,
                          routes: [{name: 'TabStack'}],
                        });
                      },
                    },
                    {
                      text: t('yes'),
                      onPress: async () => {
                        // Parmak izi istedi, önce cihazın parmak izi modalını aç
                        try {
                          if (ReactNativeBiometrics) {
                            const rnBiometrics = new ReactNativeBiometrics({
                              allowDeviceCredentials: true,
                            });

                            // Önce sensor'ın mevcut olup olmadığını kontrol et
                            const resultObject = await rnBiometrics.isSensorAvailable();
                            
                            if (resultObject && resultObject.available) {
                              // Biyometrik kimlik doğrulama mevcut, kullanıcıdan parmak izi iste
                              const promptResult = await rnBiometrics.simplePrompt({
                                promptMessage: t('biometricPrompt'),
                                cancelButtonText: t('cancel'),
                              });
                              
                              console.log('Biometric prompt result:', promptResult);
                              
                              if (promptResult?.success) {
                                // Parmak izi doğrulandı, biyometrik kimlik doğrulamayı etkinleştir
                                storage.set('biometricEnabled', true);
                                storage.set('biometricPin', pin);
                                
                                // Ana sayfaya yönlendir
                                navigation.reset({
                                  index: 0,
                                  routes: [{name: 'TabStack'}],
                                });
                              } else {
                                // Kullanıcı parmak izi doğrulamasını iptal etti veya başarısız oldu
                                // Biyometrik kimlik doğrulamayı etkinleştirmeden ana sayfaya yönlendir
                                navigation.reset({
                                  index: 0,
                                  routes: [{name: 'TabStack'}],
                                });
                              }
                            } else {
                              // Biyometrik kimlik doğrulama mevcut değil
                              Alert.alert(
                                t('error'),
                                t('biometricNotAvailable'),
                                [
                                  {
                                    text: t('confirm'),
                                    onPress: () => {
                                      navigation.reset({
                                        index: 0,
                                        routes: [{name: 'TabStack'}],
                                      });
                                    },
                                  },
                                ],
                              );
                            }
                          } else {
                            // ReactNativeBiometrics mevcut değil
                            navigation.reset({
                              index: 0,
                              routes: [{name: 'TabStack'}],
                            });
                          }
                        } catch (error) {
                          console.error('Biometric setup error:', error);
                          // Hata durumunda da ana sayfaya yönlendir
                          navigation.reset({
                            index: 0,
                            routes: [{name: 'TabStack'}],
                          });
                        }
                      },
                    },
                  ],
                );
              } else {
              // set-pin API'sinden token'lar gelmedi, hata göster
                setError(t('somethingWentWrong'));
                setPin('');
                setConfirmPin('');
                setIsConfirmingPin(false);
            }
          } else {
            // Hata durumu
            setError(t('somethingWentWrong'));
            setPin('');
            setConfirmPin('');
            setIsConfirmingPin(false);
          }
      } catch (err) {
        console.error('PIN setup error:', err);
        setError(t('somethingWentWrong'));
        setPin('');
        setConfirmPin('');
        setIsConfirmingPin(false);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Normal PIN login (setupPin değil)
    if (!setupPin && pin.length === 4) {
      setLoading(true);
      setError('');

      try {
        if (!userId) {
          setError(t('somethingWentWrong'));
          setPin('');
          setLoading(false);
          return;
        }

        const result = await fetchData({
          url: `${API_URL}/login/`,
          method: 'POST',
          body: {
            user_id: userId,
            pin_code: pin,
          },
        });
        console.log('User ID:', userId);
        console.log('PIN:', pin);
        console.log('PIN Login result:', result);

        if (result?.success) {
          // Token'ları kaydet
          const {access, refresh, user} = result.data;
          
          storage.set('accessToken', access);
          storage.set('refreshToken', refresh);
          storage.set('user', JSON.stringify(user));
          storage.set('isLoggedIn', true);
          storage.set('isPinVerified', true);
          setIsPinVerified(true); // Hook'u manuel olarak güncelle - Navigation.jsx otomatik olarak TabStack'e geçecek
          
          // Eğer enableBiometric modundaysa, önce parmak izi modalını aç
          if (enableBiometric) {
            try {
              if (ReactNativeBiometrics) {
                const rnBiometrics = new ReactNativeBiometrics({
                  allowDeviceCredentials: true,
                });

                // Parmak izi modalını aç
                const promptResult = await rnBiometrics.simplePrompt({
                  promptMessage: t('biometricPrompt'),
                  cancelButtonText: t('cancel'),
                });
                
                if (promptResult?.success) {
                  // Parmak izi doğrulandı, biyometrik kimlik doğrulamayı etkinleştir
                  storage.set('biometricEnabled', true);
                  storage.set('biometricPin', pin);
                }
                // Settings sayfasına geri dön (başarılı olsun veya olmasın)
                navigation.goBack();
                return;
              } else {
                // ReactNativeBiometrics mevcut değil, sadece geri dön
                navigation.goBack();
                return;
              }
            } catch (error) {
              console.error('Biometric enable error:', error);
              // Hata durumunda da geri dön
              navigation.goBack();
              return;
            }
          }
          
          // Biyometrik kimlik doğrulama etkinse PIN'i güncelle
          const isBiometricEnabled = storage.getBoolean('biometricEnabled');
          if (isBiometricEnabled) {
            storage.set('biometricPin', pin);
          }

          // Navigation.jsx'te isPinVerified hook'u otomatik olarak güncellenecek ve TabStack gösterilecek
          // Bu yüzden burada navigation.reset yapmaya gerek yok
        } else {
          // Hatalı PIN
          setError(t('incorrectPin'));
          setPin('');
        }
      } catch (err) {
        console.error('PIN error:', err);
        setError(t('somethingWentWrong'));
        setPin('');
      } finally {
        setLoading(false);
      }
    }
  };

  // PIN değiştiğinde kontrol et
  useEffect(() => {
    if (setupPin && isConfirmingPin) {
      if (confirmPin.length === 4) {
        handlePinComplete();
      }
    } else if (pin.length === 4) {
      handlePinComplete();
    }
  }, [pin, confirmPin, isConfirmingPin]);

  const renderPinDots = () => {
    if (setupPin) {
      // PIN setup durumunda 2 sıra dots göster
      return (
        <Styled.View className="items-center mb-6 -mt-8">
          {/* İlk PIN dots */}
          <Styled.View className="items-center mb-4">
            <Styled.Text className="text-[#66B600] text-base text-center font-poppins-medium mb-2">
              {t('setNewPin')}
            </Styled.Text>
            <Styled.View className="flex-row justify-center items-center gap-4">
            {[0, 1, 2, 3].map((index) => (
              <Styled.View
                key={`first-${index}`}
                className={`w-3 h-3 rounded-full ${
                  index < pin.length
                    ? 'bg-[#184639]'
                    : 'border-2 border-[#184639] bg-transparent'
                }`}
              />
            ))}
            </Styled.View>
          </Styled.View>
          {/* İkinci PIN dots - sadece ilk PIN 4 rakam tamamlandığında göster */}
          {pin.length === 4 && (
            <Styled.View className="items-center">
              <Styled.Text className="text-[#66B600] text-base text-center font-poppins-medium mb-2">
                {t('confirmPin')}
              </Styled.Text>
            <Styled.View className="flex-row justify-center items-center gap-4">
              {[0, 1, 2, 3].map((index) => (
                <Styled.View
                  key={`second-${index}`}
                  className={`w-3 h-3 rounded-full ${
                    index < confirmPin.length
                      ? 'bg-[#184639]'
                      : 'border-2 border-[#184639] bg-transparent'
                  }`}
                />
              ))}
              </Styled.View>
            </Styled.View>
          )}
        </Styled.View>
      );
    } else {
      // Normal PIN login durumunda tek sıra dots göster
      return (
        <Styled.View className="flex-row justify-center items-center gap-4 mb-12 mt-4">
          {[0, 1, 2, 3].map((index) => (
            <Styled.View
              key={index}
              className={`w-3 h-3 rounded-full ${
                index < pin.length
                  ? 'bg-[#184639]'
                  : 'border-2 border-[#184639] bg-transparent'
              }`}
            />
          ))}
        </Styled.View>
      );
    }
  };

  const renderKeypad = () => {
    const numbers = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];

    return (
      <Styled.View className="px-8">
        {numbers.map((row, rowIndex) => (
          <Styled.View key={rowIndex} className="flex-row justify-center gap-5 mb-4">
            {row.map((number) => (
              <Styled.TouchableOpacity
                key={number}
                onPress={() => handleNumberPress(number.toString())}
                activeOpacity={0.6}
                className="w-20 h-20 justify-center items-center">
                <Styled.Text className="text-[#184639] text-4xl font-poppins-bold">
                  {number}
                </Styled.Text>
              </Styled.TouchableOpacity>
            ))}
          </Styled.View>
        ))}
        {/* Bottom row: button, 0, X - 0 aligned with 8 above */}
        <Styled.View className="flex-row justify-center items-center gap-5">
          {/* Left column - Button */}
          <Styled.View className="w-20 h-20 justify-center items-center">
            {!enableBiometric && !setupPin && (storage.getBoolean('biometricEnabled') || false) ? (
              <Styled.TouchableOpacity
                onPress={handleBiometricAuth}
                activeOpacity={0.6}
                disabled={loading}
                className="w-20 h-20 justify-center items-center">
                <Styled.Image
                  source={Images.FingerPrint}
                  style={{width: 40, height: 40, resizeMode: 'contain'}}
                />
              </Styled.TouchableOpacity>
            ) : (
              <Styled.View className="w-20 h-20 justify-center items-center">
                <Styled.Image
                  source={Images.FingerPrint}
                  style={{width: 40, height: 40, resizeMode: 'contain', opacity: enableBiometric ? 0 : 0.3}}
                />
              </Styled.View>
            )}
          </Styled.View>
          {/* Middle column - 0 button aligned with 8 */}
          <Styled.View className="w-20 h-20 justify-center items-center">
            <Styled.TouchableOpacity
              onPress={() => handleNumberPress('0')}
              activeOpacity={0.6}
              className="w-20 h-20 justify-center items-center">
              <Styled.Text className="text-[#184639] text-4xl font-poppins-bold">
                0
              </Styled.Text>
            </Styled.TouchableOpacity>
          </Styled.View>
          {/* Right column - Delete button */}
          <Styled.View className="w-20 h-20 justify-center items-center">
            <Styled.TouchableOpacity
              onPress={handleDelete}
              activeOpacity={0.6}
              className="w-16 h-16 justify-center items-center  rounded-md">
        <Styled.Image
          source={Images.BackIcon}
          className="w-[60px] h-[60px]"
        />
            </Styled.TouchableOpacity>
          </Styled.View>
        </Styled.View>
      </Styled.View>
    );
  };

  const renderLogo = () => {
    return (
      <Styled.View className="items-center mb-3">
        {/* Logo Icon - SVG kullanarak kolayca değiştirilebilir */}
        <Styled.Image
          source={Images.BurdaLogo}
          className="w-24 h-24"
          style={{width: 90, height: 90, resizeMode: 'contain'}}
        />
      </Styled.View>
    );
  };

  const renderDecorativeElements = () => {
    return (
      <>
        {/* Left side - Sandwich with decorative circle behind */}
        <Styled.View className="absolute -left-2 top-28 w-[90px] h-[90px] rounded-full bg-gray-300 opacity-30" />
        <Styled.Image
          source={Images.Sandwich}
          className="absolute left-4 top-28"
          style={{width: 90, height: 90, resizeMode: 'contain'}}
        />
        
        {/* Right side - Salad Bowl with decorative circle behind */}
        <Styled.View className="absolute -right-10 top-[221px] w-[90px] h-[90px] rounded-full bg-gray-300 opacity-30" />
        <Styled.Image
          source={Images.SaladBowl}
          className="absolute -right-3 top-40"
          style={{width: 90, height: 90, resizeMode: 'contain'}}
        />
        
        {/* Top right - Large decorative circle */}
        <Styled.View className="absolute -right-5 top-0 w-[100px] h-[100px] rounded-full bg-gray-300 opacity-20" />
        
        {/* Bottom left - Small green dot */}
        <Styled.View className="absolute top-56 left-10 w-[20px] h-[20px] rounded-full bg-[#66B600]" />
        
        {/* Bottom right - Small green dot */}
        <Styled.View className="absolute top-[306px] right-[35px] w-2.5 h-2.5 rounded-full bg-[#66B600]" />
      </>
    );
  };

  return (
    <KeyboardAwareScrollView style={{backgroundColor: '#FAFAFA'}}>
      <Styled.View className="relative  pt-10 pb-8">
        {renderDecorativeElements()}
        
        {/* Logo and Welcome Section */}
        <Styled.View className="items-center mt-10 justify-center">
          {renderLogo()}
          {!setupPin && firstName && (
            <Styled.Text className="text-[#66B600] text-base font-poppins-medium">
              {t('welcome')}, {firstName}!
            </Styled.Text>
          )}
        </Styled.View>
      </Styled.View>

      <Styled.View className="px-5 pt-4 pb-10">
        {renderPinDots()}

        {/* Error message */}
        {error ? (
          <Styled.Text className="text-red-500 text-center text-sm font-poppins-medium mb-4">
            {error}
          </Styled.Text>
        ) : null}

        {renderKeypad()}

        {!enableBiometric && (
          <Styled.View className="mt-8 items-center">
            <CustomComponents.Link
              title={t('forgotPin')}
              textColor="text-[#66B600]"
              fontWeight="font-regular"
              textSize="text-sm"
              linkAction={() => {
                navigation.navigate('ForgotPin');
              }}
            />
          </Styled.View>
        )}
      </Styled.View>
    </KeyboardAwareScrollView>
  );
};

export default PinLogin;

