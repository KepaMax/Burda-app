import {ImageBackground} from 'react-native';
import {useState} from 'react';
import LockIcon from '@icons/lock-forgot-password.svg';
import '@locales/index';
import {useTranslation} from 'react-i18next';
import Background from '@images/background.png';
import {openInbox} from 'react-native-email-link';
import {API_URL} from '@env';
import {
  StyledTouchableOpacity,
  StyledTextInput,
  StyledText,
  StyledView,
} from '@common/StyledComponents';
import storage from '@utils/MMKVStore';
import {fetchData} from '@utils/fetchData';
import Input from '../components/Input';

const ForgotPassword = () => {
  const userType = storage.getString('userType');
  const [stage, setStage] = useState(1);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const {t} = useTranslation();

  const handleInputChange = (name, value) => {
    setEmail(value);
  };

  const resetPassword = async () => {
    if (email) {
      const result = await fetchData({
        url: `${API_URL}/${userType}/reset/`,
        headers: {
          'Accept-Language': storage.getString('selectedLanguage'),
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: {email: email},
        setLoading,
      });

      result?.success ? setStage(2) : alert(result.error);
    } else {
      alert(t('attributes.warning'), t('attributes.enterEmail'));
    }
  };

  return (
    <ImageBackground source={Background} style={{flex: 1}}>
      {stage === 1 ? (
        <StyledView className="flex-1 p-4 bg-white">
          <StyledView className="w-full items-center mt-14 mb-[24px]">
            <StyledView className="rounded-full  w-[80px] h-[80px] items-center justify-center mb-6">
              <LockIcon />
            </StyledView>
            <StyledText className="font-poppi-bold text-[#204F50] text-[22px] mt-10">
              {t('attributes.signinForgotPassword')}
            </StyledText>
          </StyledView>
          <StyledText className="text-base text-center text-[#585858] font-poppi-medium mb-3">
            {t('attributes.forgotPasswordDescr')}
          </StyledText>

          <Input
            inputName="email"
            inputValue={email}
            handleInputChange={handleInputChange}
            placeholder={t('attributes.forgotPasswordEmail')}
            error={error}
          />

          <StyledTouchableOpacity
            className="rounded-[18px] p-[10px] bg-[#76F5A4] mt-2"
            onPress={() => {
              resetPassword();
            }}>
            <StyledText className="font-poppi-semibold text-base text-[#204F50] text-center">
              {t('attributes.forgotPasswordConfirmButton')}
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      ) : (
        <StyledView className="flex-1 p-4 bg-white">
          <StyledView className="w-full items-center mt-10 mb-[24px]">
            <StyledView className="rounded-full  w-[80px] h-[80px] items-center justify-center mb-6">
              <LockIcon />
            </StyledView>
            <StyledText className="font-poppi-bold text-[#204F50] text-[22px] mt-10">
              {t('attributes.checkEmailTitle')}
            </StyledText>
          </StyledView>
          <StyledText className="text-base text-center text-[#585858] font-poppi-medium">
            {t('attributes.checkEmailDesc')}
          </StyledText>

          <StyledTouchableOpacity
            className="rounded-[18px] p-[10px] bg-[#76F5A4] mt-8"
            onPress={() => {
              openInbox();
            }}>
            <StyledText className="font-poppi-semibold text-base text-[#204F50] text-center">
              {t('attributes.openEmail')}
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      )}
    </ImageBackground>
  );
};

export default ForgotPassword;
