import BottomSheet from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import AzFlagIcon from '@icons/az-flag-language.svg';
import RuFlagIcon from '@icons/rus-flag-language.svg';
import EnFlagIcon from '@icons/en-flag-language.svg';
import ActiveIcon from '@icons/active-language.svg';
import {
  StyledText,
  StyledTouchableOpacity,
  StyledView,
  StyledImageBackground,
} from '@common/StyledComponents';
import {useTranslation} from 'react-i18next';
import LoginBg from '@images/loginBg.png';
import {useMMKVString} from 'react-native-mmkv';
import {useNavigation} from '@react-navigation/native';

const ChooseLanguageBottomSheet = () => {
  const {t, i18n} = useTranslation();
  const [selectedLanguage, setSelectedLanguage] =
    useMMKVString('selectedLanguage');
  const navigation = useNavigation();

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

  return (
    <StyledImageBackground className="flex-1 bg-[#7658F2]" source={LoginBg}>
      <StyledView className=" bg-black/20 absolute h-full w-screen z-50">
        <GestureHandlerRootView style={{flex: 1}}>
          <BottomSheet
            snapPoints={['45%']}
            handleIndicatorStyle={{backgroundColor: '#BEBFC0'}}
            backgroundStyle={{backgroundColor: '#fff'}}>
            <StyledView className="p-6 w-max h-full">
              <StyledText className="font-poppi-bold text-xl mb-5 text-[#204F50]">
                {t('attributes.chooseLanguage')}
              </StyledText>

              <StyledView className="gap-4">
                {languages.map(language => (
                  <StyledTouchableOpacity
                    onPress={() => {
                      setSelectedLanguage(language.value);
                      i18n.changeLanguage(language.value);
                      navigation.navigate('WelcomeBottomSheet');
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
          </BottomSheet>
        </GestureHandlerRootView>
      </StyledView>
    </StyledImageBackground>
  );
};

export default ChooseLanguageBottomSheet;
