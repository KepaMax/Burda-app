import {
  StyledView,
  StyledText,
  StyledTouchableOpacity,
} from '@common/StyledComponents';
import {useNavigation} from '@react-navigation/native';
import '@locales/index';
import {useTranslation} from 'react-i18next';
import LanguageIcon from '@icons/language-settings.svg';
import ArrowRightProfileIcon from '@icons/arrow-right-profile.svg';
import PasswordIcon from '@icons/change-password-settings.svg';

const Settings = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();

  return (
    <StyledView className="p-4 bg-white flex-1 gap-4">
      <StyledTouchableOpacity
        onPress={() => {
          navigation.navigate('ChangeLanguage');
        }}>
        <StyledView className="items-center flex-row justify-between border-[1px] rounded-[18px] border-[#EDEFF3] w-full p-4">
          <StyledView className="flex-row items-center">
            <LanguageIcon />
            <StyledText
              className={`text-[#000000] text-base font-poppi-medium ml-2`}>
              {t('attributes.changeLanguage')}
            </StyledText>
          </StyledView>
          <ArrowRightProfileIcon />
        </StyledView>
      </StyledTouchableOpacity>

      <StyledTouchableOpacity
        onPress={() => {
          navigation.navigate('ChangePassword');
        }}>
        <StyledView className="items-center flex-row justify-between border-[1px] rounded-[18px] border-[#EDEFF3] w-full p-4">
          <StyledView className="flex-row items-center">
            <PasswordIcon />
            <StyledText
              className={`text-[#000000] text-base font-poppi-medium ml-2`}>
              {t('attributes.resetPasswordTitle')}
            </StyledText>
          </StyledView>

          <ArrowRightProfileIcon />
        </StyledView>
      </StyledTouchableOpacity>
      <StyledText className="absolute bottom-4 w-full text-lg text-[#292B2D] text-center font-serrat-medium">
        {t('attributes.appVersion')} 1.0
      </StyledText>
    </StyledView>
  );
};

export default Settings;
