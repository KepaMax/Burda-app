import '@locales/index';
import {useTranslation} from 'react-i18next';
// import AzFlagIcon from '@icons/az-flag-language.svg';
// import RuFlagIcon from '@icons/rus-flag-language.svg';
// import EnFlagIcon from '@icons/en-flag-language.svg';
// import ActiveIcon from '@icons/active-language.svg';
import {useMMKVString} from 'react-native-mmkv';
import Styled from '@common/StyledComponents';

const languages = [
  {
    title: 'Azərbaycan dili',
    value: 'az',
    // icon: <Icons.AzFlagIcon />,
  },
  {
    title: 'Русский',
    value: 'ru',
    // icon: <Icons.RuFlagIcon />,
  },
  {
    title: 'English',
    value: 'en',
    // icon: <Icons.EnFlagIcon />,
  },
];

const Languages = () => {
  const {t, i18n} = useTranslation();
  const [selectedLanguage, setSelectedLanguage] =
    useMMKVString('selectedLanguage');

  return (
    <Styled.View className="w-auto p-4 bg-white flex-1">
      <Styled.Text className="font-poppi-bold text-xl mb-4 text-[#204F50]">
        {t('attributes.chooseLanguage')}
      </Styled.Text>

      <Styled.View className="gap-4">
        {languages.map(language => (
          <Styled.TouchableOpacity
            onPress={() => {
              setSelectedLanguage(language.value);
              i18n.changeLanguage(language.value);
            }}>
            <Styled.View className="items-center flex-row justify-between border-[1px] rounded-[18px] border-[#EDEFF3] w-full p-4 pr-6">
              <Styled.View className="flex-row items-center">
                {/* {language.icon} */}
                <Styled.Text
                  className={`text-[#204F50] text-base font-poppi-medium ml-2`}>
                  {language.title}
                </Styled.Text>
              </Styled.View>
              {selectedLanguage === language.value && <Icons.ActiveIcon />}
            </Styled.View>
          </Styled.TouchableOpacity>
        ))}
      </Styled.View>
    </Styled.View>
  );
};

export default Languages;
