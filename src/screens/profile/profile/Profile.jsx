import MenuItems from './components/MenuItems';
import EditProfileIcon from '@icons/edit-profile.svg';
import {
  StyledText,
  StyledTouchableOpacity,
  StyledView,
  StyledScrollView,
} from '@common/StyledComponents';
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from 'react';
import Modal from '@common/Modal';
import FastImage from 'react-native-fast-image';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import '@locales/index';
import { useTranslation } from 'react-i18next';
import { deleteAccount } from '@utils/authUtils';
import { API_URL } from '@env';
import { useMMKVString } from 'react-native-mmkv';
import { Alert } from 'react-native';

const Profile = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
  const [logOutModalOpen, setLogoutModalOpen] = useState(false);
  const [data, setData] = useState(null);
  const { t } = useTranslation();
  const [accessToken, setAccessToken] = useMMKVString('accessToken');
  const userType = jwtDecode(accessToken).user_type;

  const handleAccountDelete = () => {
    const status = deleteAccount();
    if (status) {
      alert(t('attributes.userSuccessfullyDeleted'));
    } else {
      alert(t('attributes.errorOccurred'));
    }
  };

  useEffect(() => {
    const getProfileData = async () => {
      const response = await fetch(`${API_URL}/${userType === "nanny" ? "nannies" : "drivers"}/profile/`, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setData(data);
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
                  userType: userType,
                });
              }}
              className="absolute right-1 bottom-0 z-50 border-[1px] border-[#EDEFF3] bg-white rounded-full overflow-hidden">
              <EditProfileIcon />
            </StyledTouchableOpacity>
            <FastImage
              style={{ width: 120, height: 120, borderRadius: 100 }}
              source={{
                uri: data?.photo,
                priority: FastImage.priority.normal,
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
          yesButtonAction={handleAccountDelete}
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
          yesButtonAction={() => {
            setAccessToken('');
          }}
          yesButtonTitle={t('attributes.submitYes')}
          noButtonAction={null}
          noButtonTitle={t('attributes.submitNo')}
        />
      )}
    </>
  );
};

export default Profile;
