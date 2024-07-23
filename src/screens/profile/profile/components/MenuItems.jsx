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

const MenuItems = ({setDeleteAccountOpen, setLogoutModalOpen}) => {
  const navigation = useNavigation();
  const {t} = useTranslation();

  const menuItems = [
    {
      logo: <DocsIcon />,
      title: t('attributes.termsAndConditions'),
      route: 'WebView',
      url: 'https://docs.google.com/gview?embedded=true&url=https://tredu-storage-bucket.s3.us-east-2.amazonaws.com/Tredu_Tos_Parents.docx.pdf',
    },
    {
      logo: <LockIcon />,
      title: t('attributes.privacyPolicy'),
      route: 'WebView',
      url: 'https://docs.google.com/gview?embedded=true&url=https://tredu-storage-bucket.s3.us-east-2.amazonaws.com/Privacy+policy.pdf',
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
          if (item.route) {
            navigation.navigate(item.route, {url: item.url, title: item.title});
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
