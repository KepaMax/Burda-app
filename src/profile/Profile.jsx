import { ScrollView } from 'react-native';
import MenuItems from './components/MenuItems';
import EditProfileIcon from "../../assets/icons/edit-profile.svg"
import { StyledText, StyledTouchableOpacity, StyledView } from '../common/components/StyledComponents';
import { useState, useContext, useEffect } from 'react';
import AuthContext from '../common/TokenManager';
import WarningModal from '../common/components/WarningModal';
import { API_URL } from '@env';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
  const { getGuestMode } = useContext(AuthContext);
  const navigation = useNavigation();
  const { getStudentAccessTokenFromMemory, getSupervisorAccessTokenFromMemory } =
    useContext(AuthContext);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [guestMode, setGuestMode] = useState(null);
  const [data, setData] = useState(null);
  const [renderCompleted, setRenderCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const guestMode = async () => {
      const mode = await getGuestMode();
      setGuestMode(mode);
      setRenderCompleted(true);
    };

    guestMode();
  }, []);
  const [triggerParent, setTriggerParent] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supervisorToken = await getSupervisorAccessTokenFromMemory();
        const studentToken = await getStudentAccessTokenFromMemory();
        const supervisorLink = `${API_URL}supervisors/me/`;
        const studentLink = `${API_URL}students/me/`;
        const headers = {
          Authorization: `Bearer ${studentToken ? studentToken : supervisorToken
            }`,
        };
        const response = await fetch(
          studentToken ? studentLink : supervisorToken ? supervisorLink : null,
          { headers },
        );
        const jsonData = await response.json();
        setData(jsonData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [triggerParent]);


  return renderCompleted ? (
    <>
      <StyledView className='flex-1 bg-white px-4'>
        <ScrollView className="bg-white">
          <StyledView className="rounded-b-[35px] items-center justify-center   overflow-hidden h-[250px] w-auto">
            <StyledView hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <StyledView className="relative">
                <StyledTouchableOpacity onPress={() => {
                  navigation.navigate('EditProfile', {
                    triggerParent: triggerParent,
                    setTriggerParent: setTriggerParent,
                  });
                }}
                  className="absolute right-1 bottom-0 z-50 border-[1px] border-[#EDEFF3] bg-white rounded-full overflow-hidden">
                  <EditProfileIcon />
                </StyledTouchableOpacity>
                <FastImage
                  style={{ width: 120, height: 120, borderRadius: 100 }}
                  source={{
                    uri: data?.profile_picture
                      ? data?.profile_picture
                      : data?.user?.profile_picture,
                    priority: FastImage.priority.normal,
                  }}
                />
              </StyledView>
            </StyledView>
            <StyledText className="mt-5 text-black text-[22px] font-poppi-semibold">
              {data?.first_name ? data?.first_name : data?.user?.first_name}{' '}
              {data?.last_name ? data?.last_name : data?.user?.last_name}
            </StyledText>
          </StyledView>
          <MenuItems
            guestMode={guestMode}
            setDeleteAccountOpen={setDeleteAccountOpen}
          />
        </ScrollView>
      </StyledView>
      {deleteAccountOpen && <WarningModal title="Delete your account?" description="Deleting your account will entirely remove your profile and active subscription" setModalOpen={setDeleteAccountOpen} />}
    </>
  ) : null;
};

export default Profile;
