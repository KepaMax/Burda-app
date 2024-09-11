import {FlatList} from 'react-native';
import SettingsIcon from '@icons/settings-profile.svg';
import ArrowRightIcon from '@icons/arrow-right-profile.svg';
import DeleteIcon from '@icons/delete-profile.svg';
import DocsIcon from '@icons/docs-profile.svg';
import LockIcon from '@icons/lock-profile.svg';
import {useNavigation} from '@react-navigation/native';
import '@locales/index';
import {useTranslation} from 'react-i18next';
import {
  StyledView,
  StyledText,
  StyledTouchableOpacity,
} from '@common/StyledComponents';
import {useMMKVString} from 'react-native-mmkv';

const MenuItems = ({setDeleteAccountOpen, setLogoutModalOpen}) => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [selectedLanguage, setSelectedLanguage] =
    useMMKVString('selectedLanguage');

  const menuItems = [
    {
      logo: <DocsIcon />,
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
      logo: <LockIcon />,
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
      logo: <SettingsIcon />,
      title: t('attributes.Settings'),
      route: 'Settings',
    },
    {
      logo: <DeleteIcon />,
      title: t('attributes.profileDeleteTitle'),
      route: '',
    },
  ];

  const renderItem = ({item}) => (
    <StyledView
      className={` border-[1px] border-[#EDEFF3] my-[6px] bg-white rounded-[18px]`}>
      <StyledTouchableOpacity
        onPress={async () => {
          if (item.route && item.payload) {
            navigation.navigate(item.route, item.payload);
          } else if (item.route) {
            navigation.navigate(item.route);
          } else {
            setDeleteAccountOpen(true);
          }
        }}>
        <StyledView className="items-center flex-row justify-between w-full p-4">
          <StyledView className="flex-row items-center">
            {item.logo}
            <StyledText
              className={`text-[#292B2D] text-base font-poppi-medium ml-2`}>
              {item.title}
            </StyledText>
          </StyledView>
          {item.route !== '' && <ArrowRightIcon />}
        </StyledView>
      </StyledTouchableOpacity>
    </StyledView>
  );

  return (
    <StyledView className="mt-[30px] mb-[40px]">
      <FlatList
        contentContainerStyle={{paddingBottom: 20}}
        scrollEnabled={false}
        data={menuItems}
        renderItem={renderItem}
      />

      <StyledTouchableOpacity
        onPress={() => {
          setLogoutModalOpen(true);
        }}
        className="py-2 border-[1px] mt-2 border-[#204F50] justify-center items-center rounded-[18px]">
        <StyledText className={`text-[#204F50] text-base font-poppi-semibold`}>
          {t('attributes.logout')}
        </StyledText>
      </StyledTouchableOpacity>
    </StyledView>
  );
};

export default MenuItems;
