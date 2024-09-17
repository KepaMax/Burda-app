import {SectionList} from 'react-native';
import Icons from '@icons/icons.js';
import {useNavigation} from '@react-navigation/native';
import '@locales/index';
import {useTranslation} from 'react-i18next';
import Styled from '@common/StyledComponents';
import {useMMKVString} from 'react-native-mmkv';
import LogOutButton from './components/LogOutButton';
import {useState} from 'react';

const Profile = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [selectedLanguage, setSelectedLanguage] =
    useMMKVString('selectedLanguage');
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const sections = [
    {
      title: 'Profile',
      data: [
        {
          logo: <Icons.PersonalInformation />,
          title: t('attributes.personalInformation'),
          route: 'EditProfile',
        },
      ],
    },
    {
      title: 'Options',
      data: [
        {
          logo: <Icons.TermsConditions />,
          title: t('attributes.termsAndConditions'),
          route: 'WebViewScreen',
          payload:
            selectedLanguage === 'az' || selectedLanguage === 'ru'
              ? {
                  url: 'http://2school.app/open/az/terms_and_conditions/',
                  title: 'İstifadəçi qaydaları və şərtləri',
                }
              : {
                  url: 'http://2school.app/open/en/terms_and_conditions/',
                  title: 'Terms and conditions',
                },
        },
        {
          logo: <Icons.PrivacyPolicy />,
          title: t('attributes.privacyPolicy'),
          route: 'WebViewScreen',
          payload:
            selectedLanguage === 'az' || selectedLanguage === 'ru'
              ? {
                  url: 'https://2school.app/open/az/privacy_policy/',
                  title: 'Məxfilik siyasəti',
                }
              : {
                  url: 'https://2school.app/open/en/privacy_policy/',
                  title: 'Privacy policy',
                },
        },
        {
          logo: <Icons.Settings />,
          title: t('attributes.Settings'),
          route: 'Settings',
        },
        {
          logo: <Icons.DeleteAccount />,
          title: t('attributes.profileDeleteTitle'),
          route: '',
        },
      ],
    },
  ];

  const handleRoute = () => {
    if (item.route && item.payload) {
      navigation.navigate(item.route, item.payload);
    } else if (item.route) {
      navigation.navigate(item.route);
    } else {
      setDeleteAccountOpen(true);
    }
  };

  const ListItem = ({item}) => {
    return (
      <Styled.TouchableOpacity
        className={`flex-row items-center justify-between shadow shadow-zinc-300 my-[8px] mx-5 px-6 py-5 bg-[#F6F8FA] rounded-[8px]`}
        onPress={handleRoute}>
        <Styled.View className="flex-row items-center">
          <Styled.View className="bg-white h-[40px] w-[40px] items-center justify-center rounded-full">
            {item.logo}
          </Styled.View>

          <Styled.Text
            className={`text-[#292B2D] text-base font-poppi-medium ml-2`}>
            {item.title}
          </Styled.Text>
        </Styled.View>
        {item.route !== '' && <Icons.ChevronRightBlack />}
      </Styled.TouchableOpacity>
    );
  };

  return (
    <Styled.ScrollView className="bg-white h-full pb-[28px]">
      <SectionList
        contentContainerStyle={{paddingBottom: 54}}
        scrollEnabled={false}
        sections={sections}
        renderItem={({item}) => <ListItem item={item} />}
        renderSectionHeader={({section: {title}}) => (
          <Styled.View className="mx-5 pt-4 pb-3">
            <Styled.Text className="text-[#184639] text-[20px] font-semibold">
              {title}
            </Styled.Text>
          </Styled.View>
        )}
      />

      <LogOutButton setLogoutModalOpen={setLogoutModalOpen} />
    </Styled.ScrollView>
  );
};

export default Profile;
