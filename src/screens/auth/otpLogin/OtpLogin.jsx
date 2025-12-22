import Styled from '@common/StyledComponents';
import CustomComponents from '@common/CustomComponents';
import {useState, useEffect, useRef} from 'react';
import {Dimensions} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
import Images from '@images/images.js';
import {fetchData} from '@utils/fetchData';
import {API_URL} from '@env';
import {useMMKVBoolean} from 'react-native-mmkv';

const OtpLogin = () => {
  const {t} = useTranslation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [loading, setLoading] = useMMKVBoolean('loading');
  const inputRefs = useRef([]);
  const navigation = useNavigation();
  const route = useRoute();
  const screenWidth = Dimensions.get('screen').width;

  // Route params
  const phoneNumber = route.params?.phone;
  const userId = route.params?.userId;

  // 30 saniye geri sayım
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Resend OTP API call
  const handleResendOtp = async () => {
    if (!canResend || !phoneNumber) return;

    setLoading(true);
    setCanResend(false);
    setCountdown(30);

    try {
      const result = await fetchData({
        url: `${API_URL}/resend-otp/`,
        method: 'POST',
        body: {
          phone_number: phoneNumber,
        },
      });

      console.log('Resend OTP result:', result);

      if (result?.success) {
        console.log('OTP resent successfully');
      } else {
        // Hata durumunda tekrar aktif et
        setCanResend(true);
        setCountdown(0);
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      setCanResend(true);
      setCountdown(0);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (text, index) => {
    // Sadece rakam kabul et
    const numericText = text.replace(/[^0-9]/g, '');
    
    if (numericText.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = numericText;
      setOtp(newOtp);

      // Otomatik olarak bir sonraki input'a geç
      if (numericText && index < 5) {
        inputRefs.current[index + 1]?.focus();
        setFocusedIndex(index + 1);
      }
    }
  };

  const handleKeyPress = (e, index) => {
    // Geri tuşuna basıldığında önceki input'a geç
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    }
  };

  const handleOtpComplete = async () => {
    const otpString = otp.join('');
    if (otpString.length === 6 && phoneNumber) {
      setLoading(true);
      setOtpError('');

      try {
        // Verify OTP API call
        const result = await fetchData({
          url: `${API_URL}/verify-otp/`,
          method: 'POST',
          body: {
            phone_number: phoneNumber,
            otp_code: otpString,
          },
        });

        console.log('Verify OTP result:', result);

        if (result?.success) {
          // OTP doğrulandı, PIN setup sayfasına yönlendir
          // userId'yi route params'tan veya API response'undan al
          const finalUserId = userId || result.data?.user_id;
          
          // PIN setup sayfasına yönlendir (her zaman setupPin: true ile)
          navigation.navigate('PinLogin', {
            phone: phoneNumber,
            userId: finalUserId,
            setupPin: true,
          });
        } else {
          // Hatalı OTP
          setOtpError(t('incorrectOtp'));
          setOtp(['', '', '', '', '', '']);
          inputRefs.current[0]?.focus();
          setFocusedIndex(0);
        }
      } catch (error) {
        console.error('Verify OTP error:', error);
        setOtpError(t('somethingWentWrong'));
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        setFocusedIndex(0);
      } finally {
        setLoading(false);
      }
    }
  };

  // OTP değiştiğinde kontrol et
  useEffect(() => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      handleOtpComplete();
    }
  }, [otp]);

  const renderOtpInputs = () => {
    return (
      <Styled.View className="w-full flex-row justify-center items-center gap-3 mb-12 mt-10">
        {otp.map((digit, index) => (
          <Styled.TextInput
            key={index}
            ref={ref => (inputRefs.current[index] = ref)}
            value={digit}
            onChangeText={text => handleOtpChange(text, index)}
            onKeyPress={e => handleKeyPress(e, index)}
            onFocus={() => setFocusedIndex(index)}
            keyboardType="number-pad"
            maxLength={1}
            selectionColor="#66B600"
            className={`w-11 h-11 border-2 rounded-lg text-center text-xl font-poppins-bold ${
              focusedIndex === index
                ? 'border-[#66B600] bg-white'
                : digit
                ? 'border-[#184639] bg-white'
                : 'border-[#184639] bg-transparent'
            }`}
            style={{
              color: '#184639',
            }}
          />
        ))}
      </Styled.View>
    );
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
      <Styled.View className="relative pt-10 pb-8">
        {renderDecorativeElements()}
        
        {/* Logo and Welcome Section */}
        <Styled.View className="items-center mt-10 justify-center">
          {renderLogo()}

        </Styled.View>
      </Styled.View>

      <Styled.View className="px-5 pt-4 flex-1 justify-between pb-10">
        <Styled.View className="items-center m-3">
          <Styled.Text className="text-[#66B600] max-w-[220px] text-center text-sm font-poppins-medium">
            {t('enterOtpCode')}
          </Styled.Text>
          {renderOtpInputs()}
          
          {/* Error message */}
          {otpError ? (
            <Styled.Text className="text-red-500 text-center text-sm font-poppins-medium mt-2">
              {otpError}
            </Styled.Text>
          ) : null}
        </Styled.View>

        <Styled.View className="items-center ">
          <Styled.View className="flex-row items-center gap-1 mb-6">
            <Styled.Text className="text-gray-400 text-sm font-poppins-regular">
              {t('didntReceiveCode')}
            </Styled.Text>
            {canResend ? (
              <Styled.TouchableOpacity onPress={handleResendOtp}>
                <Styled.Text className="text-[#66B600] text-sm font-poppins-medium">
                  {t('resend')}
                </Styled.Text>
              </Styled.TouchableOpacity>
            ) : (
              <Styled.Text className="text-gray-400 text-sm font-poppins-medium">
                {countdown} {t('seconds')}
              </Styled.Text>
            )}
          </Styled.View>
          
          {/* Continue Button */}
          <CustomComponents.Button
            borderRadius="rounded-[24px]"
            padding="p-3"
            bgColor="bg-[#66B600]"
            textSize="text-lg"
            title={t('continue')}
            extraBtnStyling="w-full"
            buttonAction={() => {
              const otpString = otp.join('');
              if (otpString.length === 6) {
                console.log('Continue with OTP:', otpString);
                // navigation.navigate('NextScreen');
              }
            }}
          />
        </Styled.View>
      </Styled.View>
    </KeyboardAwareScrollView>
  );
};

export default OtpLogin;

