import {SectionList} from 'react-native';
import Icons from '@icons/icons.js';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Styled from '@common/StyledComponents';
import {useMMKVString} from 'react-native-mmkv';
import LogOutButton from './components/LogOutButton';
import {deleteAccount} from '@utils/authUtils';

const Profile = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [buttonType, setButtonType] = useMMKVString('buttonType');

  const sections = [
    {
      title: t('profile'),
      data: [
        {
          logo: <Icons.PersonalInformation />,
          title: t('personalInformation'),
          route: 'EditProfile',
        },
      ],
    },
    {
      title: t('options'),
      data: [
        {
          logo: <Icons.TermsConditions />,
          title: t('termsAndConditions'),
          route: 'WebViewScreen',
          payload: {
            url: 'https://burda-staticfiles-storage.s3.eu-north-1.amazonaws.com/BURDA+Terms+and+conditions.pdf',
            title: 'Qayda və şərtlər',
          },
        },
        {
          logo: <Icons.PrivacyPolicy />,
          title: t('privacyPolicy'),
          route: 'WebViewScreen',
          payload: {
            url: 'https://burda-staticfiles-storage.s3.eu-north-1.amazonaws.com/BURDA+Privacy+policy.pdf',
            title: 'Məxfilik siyasəti',
          },
        },
        {
          logo: <Icons.Help />,
          title: t('help'),
          route: 'Support',
        },
        {
          logo: <Icons.Payments />,
          title: t('myTransactions'),
          route: 'PaymentHistory',
        },
        {
          logo: <Icons.Settings />,
          title: t('settings'),
          route: 'Settings',
        },
        {
          logo: <Icons.DeleteAccount />,
          title: t('profileDeleteTitle'),
          route: 'DeleteAccount',
        },
      ],
    },
  ];

  const handleRoute = item => {
    if (item?.payload) {
      navigation.navigate(item.route, item.payload, item.title);
    } else if (item.route === 'DeleteAccount') {
      handleDeleteAccount();
    } else {
      navigation.navigate(item.route);
    }
  };

  const handleDeleteAccount = () => {
    setButtonType('#FF3115');
    alert(
      t('profileDeleteTitle'),
      t('profileDeleteDescription'),

      {
        textConfirm: t('delete'),
        textCancel: t('cancel'),
        onConfirm: () => deleteAccount(),
      },
    );
  };

  const ListItem = ({item}) => {
    return (
      <Styled.TouchableOpacity
        className={`flex-row items-center justify-between shadow shadow-zinc-300 my-[8px] mx-5 px-6 py-5 bg-[#F6F8FA] rounded-[8px]`}
        onPress={() => handleRoute(item)}>
        <Styled.View className="flex-row items-center">
          <Styled.View className="bg-white h-[40px] w-[40px] items-center justify-center rounded-full">
            {item.logo}
          </Styled.View>

          <Styled.Text
            className={`text-[#292B2D] text-base font-poppins-medium ml-2`}>
            {item.title}
          </Styled.Text>
        </Styled.View>
        {item.route !== '' && <Icons.ChevronRightBlack />}
      </Styled.TouchableOpacity>
    );
  };

  return (
    <Styled.ScrollView
      contentContainerStyle={{paddingBottom: 30}}
      className="bg-white h-full">
      <SectionList
        contentContainerStyle={{paddingBottom: 54}}
        scrollEnabled={false}
        sections={sections}
        renderItem={({item}) => <ListItem item={item} />}
        renderSectionHeader={({section: {title}}) => (
          <Styled.View className="mx-5 pt-4 pb-3">
            <Styled.Text className="text-[#184639] text-[20px] font-poppins-semibold">
              {title}
            </Styled.Text>
          </Styled.View>
        )}
      />

      <LogOutButton />
    </Styled.ScrollView>
  );
};

export default Profile;
