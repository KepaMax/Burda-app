import {ImageBackground, Alert} from 'react-native';
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
import {storage} from '../../../utils/MMKVStore';

const ForgotPassword = () => {
  const [stage, setStage] = useState(1);
  const [email, setEmail] = useState('');
  const {t} = useTranslation();
  const selectedLanguage = storage.getString('selectedLanguage');

  const resetPassword = async () => {
    if (email) {
      const postData = {
        email: email.toLowerCase(),
      };

      try {
        const response = await fetch(`${API_URL}/drivers/reset/`, {
          method: 'POST',
          headers: {
            'Accept-Language': selectedLanguage,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        });

        if (response.ok) {
          setStage(2);
        } else {
          Alert.alert(t('attributes.errorOccurred'));
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      Alert.alert(t('attributes.enterEmail'));
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
          <StyledText className="text-base text-center text-[#585858] font-poppi-medium">
            {t('attributes.forgotPasswordDescr')}
          </StyledText>
          <StyledTextInput
            onChangeText={value => setEmail(value)}
            className="bg-white p-[10px] text-black border-[1px] focus:bg-[#F3F7FF] border-[#EDEFF3] focus:border-[#7658F2] placeholder:text-base my-4 rounded-[18px]"
            placeholder={t('attributes.forgotPasswordEmail')}
            placeholderTextColor="#868782"
          />
          <StyledTouchableOpacity
            className="rounded-[18px] p-[10px] bg-[#76F5A4]"
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
