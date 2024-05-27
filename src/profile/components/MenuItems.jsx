import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import SettingsIcon from '../../../assets/icons/settings-profile.svg';
import ArrowRightIcon from "../../../assets/icons/arrow-right-profile.svg"
import DeleteIcon from "../../../assets/icons/delete-profile.svg"
import DocsIcon from "../../../assets/icons/docs-profile.svg"
import LockIcon from "../../../assets/icons/lock-profile.svg"
import { useNavigation } from '@react-navigation/native';
import '../../locales/index';
import { useTranslation } from 'react-i18next';
import { useContext, useState, useEffect } from 'react';
import AuthContext from '../../common/TokenManager';
import { StyledTouchableOpacity } from '../../common/components/StyledComponents';

const StyledView = styled(View);
const StyledText = styled(Text);

const MenuItems = ({ setDeleteAccountOpen, guestMode }) => {
  const { logOut, getSupervisorAccessTokenFromMemory } = useContext(AuthContext);
  const [token, setToken] = useState();
  const navigation = useNavigation();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supervisorToken = await getSupervisorAccessTokenFromMemory();
        setToken(supervisorToken);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const loggedInAction = () => {
    logOut();
    navigation.navigate('Welcome');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Welcome' }],
    });
  };

  const menuItems = [
    {
      logo: <DocsIcon />,
      title: t('attributes.termsAndConditions'),
      route: 'TermsAndConditions',
    },
    {
      logo: <LockIcon />,
      title: t('attributes.privacyPolicy'),
      route: 'Privacypolicy'
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

  const renderItem = ({ item }) =>
  (
    <StyledView
      className={` border-[1px] border-[#EDEFF3] my-[6px] bg-white rounded-[18px]`}>
      <StyledTouchableOpacity
        onPress={async () => {
          if (item.route) {
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
          {item.route !== '' &&
            <ArrowRightIcon />}
        </StyledView>
      </StyledTouchableOpacity>
    </StyledView>

  );

  return (
    <StyledView className="mt-[24px] mb-[40px]">

      <StyledText className=" my-2 text-base text-[#204F50] font-poppi-semibold">
        {t('attributes.options')}
      </StyledText>

      <FlatList
        contentContainerStyle={{ paddingBottom: 20 }}
        scrollEnabled={false}
        data={menuItems}
        renderItem={renderItem}
      />

      <StyledTouchableOpacity
        onPress={() => loggedInAction()}
        className='py-2 border-[1px] mt-2 border-[#204F50] justify-center items-center rounded-[18px]'>
        <StyledText
          className={`text-[#204F50] text-base font-poppi-semibold`}>
          {t('attributes.logout')}
        </StyledText>
      </StyledTouchableOpacity>
    </StyledView>
  );
};

export default MenuItems;
