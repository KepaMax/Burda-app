import {Text, View, TouchableOpacity, Alert} from 'react-native';
import {styled} from 'nativewind';
import DeleteIcon from '../assets/icons/delete.svg';
import '../locales/index';
import {useTranslation} from 'react-i18next';
import {useContext} from 'react';
import AuthContext from '../common/TokenManager';
import {useNavigation} from '@react-navigation/native';
import {API_URL} from '@env';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const DeleteAccount = ({setDeleteAccountOpen}) => {
  const {getSupervisorAccessTokenFromMemory, logOut} = useContext(AuthContext);
  const {t} = useTranslation();
  const navigation = useNavigation();

  async function deleteAccount() {
    const url = `${API_URL}supervisors/me/`;
    const token = await getSupervisorAccessTokenFromMemory();

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        Alert.alert(
          t('attributes.success'),
          t('attributes.userSuccessfullyDeleted'),
        );
        logOut();
        navigation.navigate('MainstackTab', {
          screen: 'Home',
        });
      } else {
        Alert.alert(t('attributes.error'), t('attributes.errorOccurred'));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  return (
    <StyledView className="flex-1 items-center justify-center bg-black/20 absolute h-screen w-screen z-50">
      <StyledView
        className={`bg-white p-4 pt-12 rounded-sm shadow shadow-zinc-400 border-t-2 border-[#FF3115] mx-5`}>
        <StyledView className="absolute -top-5 left-1/2 transform -translate-x-1/2">
          <DeleteIcon />
        </StyledView>
        <StyledText className="text-center text-base font-serrat-bold text-zinc-500 my-4">
          {t('attributes.profileDeleteTitle')}
        </StyledText>
        <StyledText className="text-center text-sm font-serrat text-zinc-500">
          {t('attributes.profileDeleteDescr')}
        </StyledText>
        <StyledView className="flex-row w-full justify-between mt-10">
          <StyledTouchableOpacity
            onPress={() => {
              setDeleteAccountOpen(false);
            }}
            className="py-2 w-1/2 rounded-md">
            <StyledText className="text-center text-lg font-serrat-medium text-zinc-500">
              {t('attributes.profileDeleteNo')}
            </StyledText>
          </StyledTouchableOpacity>
          <StyledTouchableOpacity
            onPress={() => {
              deleteAccount();
            }}
            className="py-2 bg-[#FF3115] w-1/2 rounded-md">
            <StyledText className="text-center text-lg text-white font-serrat-medium">
              {t('attributes.profileDeleteYes')}
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledView>
    </StyledView>
  );
};

export default DeleteAccount;
