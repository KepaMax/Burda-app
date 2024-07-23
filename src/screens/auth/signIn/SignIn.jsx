import {ActivityIndicator} from 'react-native';
import {useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import '@locales/index';
import {useTranslation} from 'react-i18next';
import {
  StyledView,
  StyledText,
  StyledTouchableOpacity,
} from '@common/StyledComponents';
import Input from '../components/Input';
import PasswordInput from '../components/PasswordInput';
import {login} from '../../../utils/authUtils';

const SignIn = () => {
  const [errors, setErrors] = useState(null);
  const {t} = useTranslation();
  const [loading, setLoading] = useState();
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const loginType = useRoute().params.loginType;

  const handleInputChange = (name, value) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return !loading ? (
    <StyledView className="flex-1 bg-white p-4">
      <KeyboardAwareScrollView>
        <StyledView className="mb-3">
          <Input
            inputName="email"
            inputValue={formData.email}
            handleInputChange={handleInputChange}
            placeholder={t('attributes.registerParentEmail')}
            error={errors?.email}
          />

          <PasswordInput
            inputName="password"
            inputValue={formData.password}
            handleInputChange={handleInputChange}
            placeholder={t('attributes.registerParentPassword')}
            error={errors?.password}
          />

          <StyledView className="w-auto flex-row items-center justify-end">
            <StyledTouchableOpacity
              onPress={() => {
                navigation.navigate('ForgotPassword');
              }}>
              <StyledText className="font-poppi text-sm text-[#204F50]">
                {t('attributes.signinForgotPassword')}
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>

        <StyledTouchableOpacity
          onPress={() => {
            login(loginType, formData, setLoading);
          }}>
          <StyledView className=" p-[10px] bg-[#76F5A4] rounded-[18px]">
            <StyledText className="text-center text-[#204F50] text-base font-poppi-semibold">
              {t('attributes.registerSignin')}
            </StyledText>
          </StyledView>
        </StyledTouchableOpacity>
        <StyledView className="w-full mt-10 flex-row items-center justify-center">
          <StyledText className="font-poppi text-base text-[#91919F]">
            {t('attributes.registerSignup')}
          </StyledText>
          <StyledTouchableOpacity
            onPress={() => {
              navigation.navigate('SignUp', {registerType: loginType});
            }}>
            <StyledText className="font-poppi-semibold ml-2 text-base text-[#204F50]">
              {t('attributes.signUp')}
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </KeyboardAwareScrollView>
    </StyledView>
  ) : (
    <StyledView className="w-screen h-screen items-center justify-center pb-40">
      <ActivityIndicator size="large" color="#7658F2" />
    </StyledView>
  );
};

export default SignIn;
