import Styled from '@common/StyledComponents';
import Icons from '@icons/icons.js';
import {FlatList} from 'react-native';
import {useTranslation} from 'react-i18next';
import CustomComponents from '@common/CustomComponents';
import {useNavigation} from '@react-navigation/native';

const Settings = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  const settingItems = [
    {
      logo: <Icons.PersonalInformation />,
      title: t('changeLanguage'),
      route: 'ChangeLanguage',
    },
    {
      logo: <Icons.ResetPassword />,
      title: t('changePassword'),
      route: 'ChangePassword',
    },
  ];

  const SettingItem = ({item}) => {
    return (
      <Styled.TouchableOpacity
        className={`flex-row items-center justify-between shadow shadow-zinc-300 my-[8px] mx-5 px-6 py-5 bg-white rounded-[8px]`}
        onPress={() => navigation.navigate(item.route)}>
        <Styled.View className="flex-row items-center">
          <Styled.View className="bg-white h-[40px] w-[40px] items-center justify-center rounded-full">
            {item.logo}
          </Styled.View>

          <Styled.Text
            className={`text-[#292B2D] text-base font-poppins-medium ml-2`}>
            {item.title}
          </Styled.Text>
        </Styled.View>
        <Icons.ChevronRightBlack />
      </Styled.TouchableOpacity>
    );
  };

  return (
    <>
      <CustomComponents.Header title={t('settings')} bgColor="bg-white" />
      <Styled.ScrollView className="bg-[#F8F8F8] h-full">
        <FlatList
          contentContainerStyle={{paddingTop: 10}}
          scrollEnabled={false}
          data={settingItems}
          renderItem={({item}) => <SettingItem item={item} />}
        />
        <Styled.Text className="text-zinc-500 text-sm text-center">
          Version: 1.1
        </Styled.Text>
      </Styled.ScrollView>
    </>
  );
};

export default Settings;
