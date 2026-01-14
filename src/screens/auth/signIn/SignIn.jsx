import Styled from '@common/StyledComponents';
import Images from '@images/images.js';
import CustomComponents from '@common/CustomComponents';
import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
import {useMMKVBoolean} from 'react-native-mmkv';
import {fetchData} from '@utils/fetchData';
import {API_URL} from '@env';

const SignIn = () => {
  const {t} = useTranslation();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useMMKVBoolean('loading');
  const [errors, setErrors] = useState({});
  const [userNotFoundCount, setUserNotFoundCount] = useState(0);
  const [useEmail, setUseEmail] = useState(false);
  const [requiresPhoneSetup, setRequiresPhoneSetup] = useState(false);
  const [userIdForSetup, setUserIdForSetup] = useState(null);
  const navigation = useNavigation();

  const handleInputChange = (name, value) => {
    setFormData(prevState => ({...prevState, [name]: value}));
  };

  const handleLogin = async () => {
    // Eğer requiresPhoneSetup modundaysa, setup-phone API'sini çağır
    if (requiresPhoneSetup) {
      // Telefon numarası doğrulama
      if (!formData.phone_number || formData.phone_number.length < 13) {
        setErrors({phone_number: t('phoneNumberRequired')});
        return;
      }

      // Email doğrulama
      if (!formData.email) {
        setErrors({email: t('fieldRequired')});
        return;
      }

      // Email format doğrulama
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setErrors({email: t('invalidEmail')});
        return;
      }
      
      setErrors({});
      setLoading(true);

      try {
        // Setup phone API call
        const result = await fetchData({
          url: `${API_URL}/setup-phone/`,
          method: 'POST',
          body: {
            phone_number: formData.phone_number,
            email: formData.email,
          },
        });

        console.log('Setup Phone result:', result);

        if (result?.success) {
          // Başarılı olursa OTP sayfasına yönlendir
          navigation.navigate('OtpLogin', {
            phone: formData.phone_number,
            userId: userIdForSetup,
          });
        } else {
          // API hatası
          setErrors({general: result?.data?.detail || t('somethingWentWrong')});
        }
      } catch (error) {
        console.error('Setup Phone error:', error);
        setErrors({general: t('somethingWentWrong')});
      } finally {
        setLoading(false);
      }
      return;
    }

    // Normal login flow
    // Input doğrulama
    if (useEmail) {
      if (!formData.email || !formData.email.includes('@')) {
        setErrors({email: t('invalidEmail')});
        return;
      }
    } else {
      if (!formData.phone_number || formData.phone_number.length < 13) {
        setErrors({phone_number: t('phoneNumberRequired')});
        return;
      }
    }
    
    setErrors({});
    setLoading(true);

    try {
      // Check user status API call
      const identifier = useEmail ? formData.email : formData.phone_number;
      const result = await fetchData({
        url: `${API_URL}/check-status/`,
        method: 'POST',
        body: {
          identifier: identifier,
        },
      });
      console.log('Check status result:', result);

      if (result?.success) {
        // Başarılı olduğunda sayacı sıfırla
        setUserNotFoundCount(0);
        
        const {user_exists, is_pin_set, user_id, first_name, requires_phone_setup} = result.data;

        // Eğer requires_phone_setup true ise phone ve email inputlarını göster
        if (requires_phone_setup) {
          setRequiresPhoneSetup(true);
          setUserIdForSetup(user_id);
          // Eğer email ile giriş yapıldıysa, email zaten formData'da
          // Eğer phone ile giriş yapıldıysa, phone zaten formData'da
          setLoading(false);
          return;
        }

        if (user_exists) {
          if (is_pin_set) {
            // Kullanıcı var ve PIN set edilmiş -> PinLogin sayfasına yönlendir
            navigation.navigate('PinLogin', {
              phone: useEmail ? formData.email : formData.phone_number,
              userId: user_id,
              firstName: first_name,
            });
          } else {
            // Kullanıcı var ama PIN set edilmemiş -> OTP sayfasına yönlendir
            navigation.navigate('OtpLogin', {
              phone: useEmail ? formData.email : formData.phone_number,
              userId: user_id,
            });
          }
        } else {
          // Kullanıcı yok -> Kayıt sayfasına yönlendir
          navigation.navigate('SignUp', {
            phone: useEmail ? formData.email : formData.phone_number,
          });
        }
      } else {
        // API hatası kontrolü
        const errorDetail = result?.data?.[0]?.detail || '';
        const isUserNotFound = errorDetail.toLowerCase().includes('user not found');
        
        if (isUserNotFound && !useEmail) {
          const newCount = userNotFoundCount + 1;
          setUserNotFoundCount(newCount);
          
          if (newCount >= 3) {
            // 3 denemede mesaj göster
            setErrors({phone_number: t('forgotPhoneNumber')});
          } else {
            setErrors({phone_number: t('invalidPhoneNumber')});
          }
        } else {
          setErrors(useEmail ? {email: t('invalidEmail')} : {phone_number: t('invalidPhoneNumber')});
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors(useEmail ? {email: t('invalidEmail')} : {phone_number: t('invalidPhoneNumber')});
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPhoneClick = () => {
    setUseEmail(true);
    setUserNotFoundCount(0);
    setErrors({});
    setFormData(prev => ({...prev, phone_number: ''}));
  };

  const renderLogo = () => {
    return (
      <Styled.View className="items-center mb-3">
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
    <KeyboardAwareScrollView 
      style={{backgroundColor: '#FAFAFA', flex: 1}}
      contentContainerStyle={{flexGrow: 1}}>
      
      {/* Header with Logo and Decorative Elements */}
      <Styled.View className="relative pt-10 pb-8">
        {renderDecorativeElements()}
        
        <Styled.View className="items-center mt-10 justify-center">
          {renderLogo()}
        </Styled.View>
      </Styled.View>

      <Styled.View className="px-5 flex-1 justify-between pb-8">
        {/* Üst kısım - Başlık ve Input */}
        <Styled.View className="mt-16">
          <Styled.Text className="text-[#184639] text-[32px] font-poppins-semibold mb-4">
            {t('signIn')}
          </Styled.Text>
          <Styled.Text className="text-[#66B600]  text-sm font-poppins-medium mb-4">
            {requiresPhoneSetup 
              ? useEmail ? t('enterEmail') : t('enterPhoneNumber') 
              : useEmail 
                ? t('enterYourEmail') 
                : t('enterYourPhoneNumber')}
          </Styled.Text>

          {requiresPhoneSetup ? (
            <>
              <CustomComponents.PhoneInput
                handleInputChange={handleInputChange}
                inputValue={formData?.phone_number}
                error={errors?.phone_number}
              />
              <CustomComponents.Input
                inputName="email"
                inputValue={formData?.email}
                handleInputChange={handleInputChange}
                placeholder={t('cooperativEmail')}
                error={errors?.email}
                keyboardType="email-address"
                margin="mt-4"
              />
              {errors?.general && (
                <Styled.Text className="text-red-500 text-center text-sm font-poppins-medium mt-2">
                  {errors.general}
                </Styled.Text>
              )}
            </>
          ) : useEmail ? (
            <CustomComponents.Input
              inputName="email"
              inputValue={formData?.email}
              handleInputChange={handleInputChange}
              placeholder={t('email')}
              error={errors?.email}
              keyboardType="email-address"
            />
          ) : (
            <>
              <CustomComponents.PhoneInput
                handleInputChange={handleInputChange}
                inputValue={formData?.phone_number}
                error={errors?.phone_number}
              />
              {errors?.phone_number === t('forgotPhoneNumber') && (
                <CustomComponents.Link
                  title={t('forgotPhoneNumber')}
                  textColor="text-[#FF8C03]"
                  textSize="text-sm"
                  fontWeight="font-poppins-medium"
                  margin="mt-2"
                  linkAction={handleForgotPhoneClick}
                />
              )}
            </>
          )}
        </Styled.View>

        {/* Alt kısım - Buton ve Link */}
        <Styled.View>
          <CustomComponents.Button
            borderRadius="rounded-[24px]"
            padding="p-2.5"
            bgColor="bg-[#66B600]"
            textSize="text-lg"
            title={t('continue')}
            buttonAction={handleLogin}
          />

          {!requiresPhoneSetup && (
            <CustomComponents.Link
              textAlign="text-center"
              title={t('noAccount')}
              margin="mb-4 mt-6"
              textColor="text-[#184639]"
              fontWeight="font-regular"
              linkAction={() => {
                navigation.navigate('SignUp');
              }}
            />
          )}
        </Styled.View>
      </Styled.View>
    </KeyboardAwareScrollView>
  );
};

export default SignIn;
