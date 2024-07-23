import '@locales/index';
import {useTranslation} from 'react-i18next';
import AzFlagIcon from '@icons/az-flag-language.svg';
import RuFlagIcon from '@icons/rus-flag-language.svg';
import EnFlagIcon from '@icons/en-flag-language.svg';
import ActiveIcon from '@icons/active-language.svg';
import {useMMKVString} from 'react-native-mmkv';
import {
  StyledView,
  StyledText,
  StyledTouchableOpacity,
} from '@common/StyledComponents';

const languages = [
  {
    title: 'Azərbaycan dili',
    value: 'az',
    icon: <AzFlagIcon />,
  },
  {
    title: 'Русский',
    value: 'ru',
    icon: <RuFlagIcon />,
  },
  {
    title: 'English',
    value: 'en',
    icon: <EnFlagIcon />,
  },
];

const Languages = () => {
  const {t, i18n} = useTranslation();
  const [selectedLanguage, setSelectedLanguage] =
    useMMKVString('selectedLanguage');

  return (
    <StyledView className="w-auto p-4 bg-white flex-1">
      <StyledText className="font-poppi-bold text-xl mb-4 text-[#204F50]">
        {t('attributes.chooseLanguage')}
      </StyledText>

      <StyledView className="gap-4">
        {languages.map(language => (
          <StyledTouchableOpacity
            onPress={() => {
              setSelectedLanguage(language.value);
              i18n.changeLanguage(language.value);
            }}>
            <StyledView className="items-center flex-row justify-between border-[1px] rounded-[18px] border-[#EDEFF3] w-full p-4 pr-6">
              <StyledView className="flex-row items-center">
                {language.icon}
                <StyledText
                  className={`text-[#204F50] text-base font-poppi-medium ml-2`}>
                  {language.title}
                </StyledText>
              </StyledView>
              {selectedLanguage === language.value && <ActiveIcon />}
            </StyledView>
          </StyledTouchableOpacity>
        ))}
      </StyledView>
    </StyledView>
  );
};

export default Languages;
