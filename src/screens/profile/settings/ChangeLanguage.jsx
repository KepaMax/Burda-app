import {useTranslation} from 'react-i18next';
import {useMMKVString} from 'react-native-mmkv';
import Styled from '@common/StyledComponents';
import Icons from '@icons/icons';
import {FlatList} from 'react-native';
import CustomComponents from '@common/CustomComponents';

const ChangeLanguage = () => {
  const {t, i18n} = useTranslation();
  const [selectedLanguage, setSelectedLanguage] =
    useMMKVString('selectedLanguage');

  const languages = [
    {
      title: 'Azərbaycan dili',
      value: 'az',
      icon: <Icons.AzFlag />,
    },
    {
      title: 'English',
      value: 'en',
      icon: <Icons.GbFlag />,
    },
  ];

  const LanguageItem = ({item}) => {
    return (
      <Styled.TouchableOpacity
        className="items-center flex-row justify-between shadow shadow-zinc-300 my-[8px] mx-5 px-6 py-7 bg-white rounded-[8px]"
        onPress={() => {
          setSelectedLanguage(item.value);
          // i18n.changeLanguage(item.value);
        }}>
        <Styled.View className="flex-row items-center">
          {item.icon}
          <Styled.Text
            className={`text-[#204F50] text-base font-poppins-medium ml-2`}>
            {item.title}
          </Styled.Text>
        </Styled.View>
        {selectedLanguage === item.value && <Icons.SelectedLanguage />}
      </Styled.TouchableOpacity>
    );
  };

  return (
    <>
      <CustomComponents.Header title={t('changeLanguage')} bgColor="bg-white" />

      <FlatList
        contentContainerStyle={{
          backgroundColor: '#F8F8F8',
          flex: 1,
          paddingTop: 10,
        }}
        data={languages}
        renderItem={({item}) => <LanguageItem item={item} />}
      />
    </>
  );
};

export default ChangeLanguage;
