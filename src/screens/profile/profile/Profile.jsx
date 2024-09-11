import MenuItems from './components/MenuItems';
import EditProfileIcon from '@icons/edit-profile.svg';
import {
  StyledText,
  StyledTouchableOpacity,
  StyledView,
  StyledScrollView,
  StyledImage,
} from '@common/StyledComponents';
import {useState, useEffect} from 'react';
import Modal from '@common/Modal';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import '@locales/index';
import {useTranslation} from 'react-i18next';
import {deleteAccount} from '@utils/authUtils';
import {API_URL} from '@env';
import storage from '@utils/MMKVStore';
import {logout} from '@utils/authUtils';
import {fetchData} from '@utils/fetchData';

const Profile = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
  const [logOutModalOpen, setLogoutModalOpen] = useState(false);
  const [data, setData] = useState(null);
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getProfileData = async () => {
      const userType = storage.getString('userType');
      const result = await fetchData({
        url: `${API_URL}/${userType}/profile/`,
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': storage.getString('selectedLanguage'),
          Authorization: `Bearer ${storage.getString('accessToken')}`,
        },
        setLoading,
      });

      setData(result.data);
    };

    getProfileData();
  }, [isFocused]);

  return (
    <>
      <StyledScrollView className="flex-1 bg-white px-4 pt-[20px]">
        <StyledView className="items-center justify-center">
          <StyledView className="relative">
            <StyledTouchableOpacity
              onPress={() => {
                navigation.navigate('EditProfile', {
                  profileData: data,
                });
              }}
              className="absolute right-1 bottom-0 z-50 border-[1px] border-[#EDEFF3] bg-white rounded-full overflow-hidden">
              <EditProfileIcon />
            </StyledTouchableOpacity>
            <StyledImage
              style={{width: 120, height: 120, borderRadius: 100}}
              source={{
                uri: data?.photo,
              }}
            />
          </StyledView>

          <StyledText className="mt-5 text-black text-[24px] font-poppi-semibold">
            {data?.name} {data?.surname}
          </StyledText>
        </StyledView>
        <MenuItems
          setLogoutModalOpen={setLogoutModalOpen}
          setDeleteAccountOpen={setDeleteAccountModalOpen}
        />
      </StyledScrollView>

      {deleteAccountModalOpen && (
        <Modal
          modalType="delete"
          title={t('attributes.profileDeleteTitle')}
          description={t('attributes.profileDeleteDescr')}
          yesButtonAction={deleteAccount}
          yesButtonTitle={t('attributes.mainCheckoutConfirm')}
          noButtonAction={null}
          noButtonTitle={t('attributes.submitNo')}
          setModalOpen={setDeleteAccountModalOpen}
        />
      )}
      {logOutModalOpen && (
        <Modal
          modalType="info"
          setModalOpen={setLogoutModalOpen}
          title={t('attributes.logout')}
          description={t('attributes.logoutDesc')}
          yesButtonAction={logout}
          yesButtonTitle={t('attributes.submitYes')}
          noButtonAction={null}
          noButtonTitle={t('attributes.submitNo')}
        />
      )}
    </>
  );
};

export default Profile;
