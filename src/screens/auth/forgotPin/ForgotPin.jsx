import Styled from '@common/StyledComponents';
import Images from '@images/images.js';
import CustomComponents from '@common/CustomComponents';
import {useState, useEffect, useRef} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
import {useMMKVBoolean} from 'react-native-mmkv';
import {fetchData} from '@utils/fetchData';
import {API_URL} from '@env';
import {Alert} from 'react-native';

const ForgotPin = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const fromProfile = route.params?.fromProfile || false;
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: New PIN
  const [formData, setFormData] = useState({});
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isConfirmingPin, setIsConfirmingPin] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useMMKVBoolean('loading');
  const [errors, setErrors] = useState({});
  const inputRefs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (step === 2 && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (step === 2 && countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, step]);

  const handleInputChange = (name, value) => {
    setFormData(prevState => ({...prevState, [name]: value}));
  };

  // Step 1: Request OTP
  const handleRequestOtp = async () => {
    if (!formData.phone_number || formData.phone_number.length < 13) {
      setErrors({phone_number: t('phoneNumberRequired')});
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const result = await fetchData({
        url: `${API_URL}/forgot-pin/`,
        method: 'POST',
        body: {
          phone_number: formData.phone_number,
        },
      });

      if (result?.success) {
        setStep(2);
        setCountdown(30);
        setCanResend(false);
      } else {
        setErrors({general: t('somethingWentWrong')});
      }
    } catch (error) {
      console.error('Forgot PIN error:', error);
      setErrors({general: t('somethingWentWrong')});
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Resend OTP
  const handleResendOtp = async () => {
    if (!canResend || !formData.phone_number) return;

    setLoading(true);
    setCanResend(false);
    setCountdown(30);
    setErrors({});

    try {
      const result = await fetchData({
        url: `${API_URL}/forgot-pin/`,
        method: 'POST',
        body: {
          phone_number: formData.phone_number,
        },
      });

      if (result?.success) {
        setOtp(['', '', '', '', '', '']);
        setFocusedIndex(0);
        inputRefs.current[0]?.focus();
      } else {
        setCanResend(true);
        setCountdown(0);
        setErrors({general: t('somethingWentWrong')});
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      setCanResend(true);
      setCountdown(0);
      setErrors({general: t('somethingWentWrong')});
    } finally {
      setLoading(false);
    }
  };

  // Step 2: OTP handling
  const handleOtpChange = (text, index) => {
    const numericText = text.replace(/[^0-9]/g, '');

    if (numericText.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = numericText;
      setOtp(newOtp);
      setErrors({});

      if (numericText && index < 5) {
        inputRefs.current[index + 1]?.focus();
        setFocusedIndex(index + 1);
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    }
  };

  // Step 2: Verify OTP and go to PIN step
  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setErrors({otp: t('fieldRequired')});
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      // OTP doğrulaması için geçici olarak sadece step'i değiştir
      // Gerçek doğrulama reset-pin'de yapılacak
      setStep(3);
      setPin('');
      setConfirmPin('');
      setIsConfirmingPin(false);
    } catch (error) {
      console.error('Verify OTP error:', error);
      setErrors({otp: t('somethingWentWrong')});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const otpString = otp.join('');
    if (otpString.length === 6 && step === 2) {
      handleVerifyOtp();
    }
  }, [otp]);

  // Step 3: PIN handling
  const handleNumberPress = (number) => {
    if (isConfirmingPin) {
      if (confirmPin.length < 4) {
        setConfirmPin(prev => prev + number);
        setErrors({});
      }
    } else {
      if (pin.length < 4) {
        setPin(prev => prev + number);
        setErrors({});
      }
    }
  };

  const handleDelete = () => {
    if (isConfirmingPin) {
      setConfirmPin(prev => prev.slice(0, -1));
      setErrors({});
    } else {
      setPin(prev => prev.slice(0, -1));
      setErrors({});
    }
  };

  // Step 3: Reset PIN
  const handleResetPin = async () => {
    if (pin.length !== 4 || confirmPin.length !== 4) {
      return;
    }

    if (pin !== confirmPin) {
      setErrors({pin: t('pinMismatch')});
      setPin('');
      setConfirmPin('');
      setIsConfirmingPin(false);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const result = await fetchData({
        url: `${API_URL}/reset-pin/`,
        method: 'POST',
        body: {
          phone_number: formData.phone_number,
          otp_code: otp.join(''),
          new_pin: pin,
        },
      });

      if (result?.success) {
        // PIN başarıyla reset edildi
        // Başarı mesajı göster
        Alert.alert(t('success'), t('pinUpdated'), [
          {
            text: t('confirm'),
            onPress: () => {
              // Eğer Profile sayfasından geldiyse ProfileScreen'e, değilse SignIn'e yönlendir
              if (fromProfile) {
                navigation.navigate('ProfileScreen');
              } else {
                navigation.navigate('SignIn');
              }
            },
          },
        ]);
      } else {
        setErrors({general: result?.data?.detail || t('somethingWentWrong')});
        setPin('');
        setConfirmPin('');
        setIsConfirmingPin(false);
      }
    } catch (error) {
      console.error('Reset PIN error:', error);
      setErrors({general: t('somethingWentWrong')});
      setPin('');
      setConfirmPin('');
      setIsConfirmingPin(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === 3 && !isConfirmingPin && pin.length === 4) {
      setIsConfirmingPin(true);
      setErrors({});
    } else if (step === 3 && isConfirmingPin && confirmPin.length === 4) {
      handleResetPin();
    }
  }, [pin, confirmPin, isConfirmingPin, step]);

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
        <Styled.View className="absolute -left-2 top-28 w-[90px] h-[90px] rounded-full bg-gray-300 opacity-30" />
        <Styled.Image
          source={Images.Sandwich}
          className="absolute left-4 top-28"
          style={{width: 90, height: 90, resizeMode: 'contain'}}
        />
        <Styled.View className="absolute -right-10 top-[221px] w-[90px] h-[90px] rounded-full bg-gray-300 opacity-30" />
        <Styled.Image
          source={Images.SaladBowl}
          className="absolute -right-3 top-40"
          style={{width: 90, height: 90, resizeMode: 'contain'}}
        />
        <Styled.View className="absolute -right-5 top-0 w-[100px] h-[100px] rounded-full bg-gray-300 opacity-20" />
        <Styled.View className="absolute top-56 left-10 w-[20px] h-[20px] rounded-full bg-[#66B600]" />
        <Styled.View className="absolute top-[306px] right-[35px] w-2.5 h-2.5 rounded-full bg-[#66B600]" />
      </>
    );
  };

  const renderOtpInputs = () => {
    return (
      <Styled.View className="w-full flex-row justify-center items-center gap-3 mb-6 mt-4">
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

  const renderPinDots = () => {
    return (
      <Styled.View className="items-center mb-12 mt-4">
        <Styled.View className="flex-row justify-center items-center gap-4 mb-4">
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
        {pin.length === 4 && (
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
        )}
      </Styled.View>
    );
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
        <Styled.View className="flex-row justify-center items-center gap-5">
          <Styled.View className="w-20 h-20 justify-center items-center" />
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
          <Styled.View className="w-20 h-20 justify-center items-center">
            <Styled.TouchableOpacity
              onPress={handleDelete}
              activeOpacity={0.6}
              className="w-16 h-16 justify-center items-center rounded-md">
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

  const renderStepContent = () => {
    if (step === 1) {
      // Step 1: Phone number
      return (
        <>
          <Styled.Text className="text-[#184639] text-[32px] font-poppins-semibold mb-4">
            {t('forgotPin')}
          </Styled.Text>
          <Styled.Text className="text-[#868782] text-base font-poppins-regular mb-4">
            {t('forgotPinDescription')}
          </Styled.Text>
          <CustomComponents.PhoneInput
            handleInputChange={handleInputChange}
            inputValue={formData?.phone_number}
            error={errors?.phone_number}
          />
          {errors?.general && (
            <Styled.Text className="text-red-500 text-center text-sm font-poppins-medium mt-2">
              {errors.general}
            </Styled.Text>
          )}
          <CustomComponents.Button
            borderRadius="rounded-[24px]"
            padding="p-2.5"
            bgColor="bg-[#66B600]"
            textSize="text-lg"
            title={t('continue')}
            buttonAction={handleRequestOtp}
          />
        </>
      );
    } else if (step === 2) {
      // Step 2: OTP
      return (
        <>
          <Styled.Text className="text-[#184639] text-[32px] font-poppins-semibold mb-4">
            {t('verifyOtp')}
          </Styled.Text>
          <Styled.Text className="text-[#66B600]  text-sm font-poppins-medium mb-4">
            {t('enterOtpCode')}
          </Styled.Text>
          {errors?.otp && (
            <Styled.Text className="text-red-500 text-center text-sm font-poppins-medium mb-4">
              {errors.otp}
            </Styled.Text>
          )}
          {renderOtpInputs()}
          <Styled.View className="flex-row items-center justify-center gap-1 mb-6">
            <Styled.Text className="text-gray-400 text-sm font-poppins-regular">
              {t('didntReceiveCode')}
            </Styled.Text>
            <Styled.TouchableOpacity
              onPress={handleResendOtp}
              disabled={!canResend}
              style={{opacity: canResend ? 1 : 0.5}}>
              <Styled.Text className="text-[#66B600] text-sm font-poppins-medium">
                {canResend ? t('resend') : `${countdown} ${t('seconds')}`}
              </Styled.Text>
            </Styled.TouchableOpacity>
          </Styled.View>
        </>
      );
    } else {
      // Step 3: New PIN
      return (
        <>
          <Styled.Text className="text-[#66B600] text-base text-center font-poppins-medium mb-4">
            {isConfirmingPin ? t('confirmPin') : t('setNewPin')}
          </Styled.Text>
          {renderPinDots()}
          {errors?.pin && (
            <Styled.Text className="text-red-500 text-center text-sm font-poppins-medium mb-4">
              {errors.pin}
            </Styled.Text>
          )}
          {errors?.general && (
            <Styled.Text className="text-red-500 text-center text-sm font-poppins-medium mb-4">
              {errors.general}
            </Styled.Text>
          )}
          {renderKeypad()}
        </>
      );
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{backgroundColor: '#FAFAFA', flex: 1}}
      contentContainerStyle={{flexGrow: 1}}>
      <Styled.View className="relative pt-10 pb-8">
        {renderDecorativeElements()}
        <Styled.View className="items-center mt-10 justify-center">
          {renderLogo()}
        </Styled.View>
      </Styled.View>

      <Styled.View className="px-5 flex-1 justify-between pb-8">
        <Styled.View className="mt-16">
          {renderStepContent()}
        </Styled.View>
      </Styled.View>
    </KeyboardAwareScrollView>
  );
};

export default ForgotPin;

