import {Text, View, TouchableOpacity, Alert} from 'react-native';
import {styled} from 'nativewind';
import CourseCancel from '../../assets/icons/courseCancel.svg';
import '../../locales/index';
import {useTranslation} from 'react-i18next';
import {useContext} from 'react';
import AuthContext from '../../common/TokenManager';
import {API_URL} from '@env';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const CancelSubscriptionModal = ({
  setCancelSubscriptionModalOpen,
  courseId,
  studentId,
}) => {
  const {getSupervisorAccessTokenFromMemory} = useContext(AuthContext);
  const {t} = useTranslation();

  const cancelEnrollment = async () => {
    try {
      const supervisorToken = await getSupervisorAccessTokenFromMemory();
      const url = `${API_URL}course-classes/${courseId}/cancel-enrollment/`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supervisorToken}`,
        },
        body: JSON.stringify({
          student: studentId,
        }),
      });

      const result = await response.json();

      if (response.status === 200) {
        setCancelSubscriptionModalOpen(false);
        Alert.alert(result?.message);
      } else {
        setCancelSubscriptionModalOpen(false);
        Alert.alert(result?.errors[0]?.detail);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <StyledView className="items-center justify-center bg-black/20 absolute h-screen w-screen z-50">
      <StyledView className="bg-white p-5 mb-32 rounded-[8px] shadow shadow-zinc-400 border-t-2 border-[#0079E9] mx-5">
        <StyledView className="absolute -top-5 left-1/2 transform -translate-x-1/2">
          <CourseCancel />
        </StyledView>
        <StyledText className="text-center text-base font-serrat-bold text-[#414141] my-4">
          {t('attributes.cancelSubscription')}
        </StyledText>
        <StyledText className="text-center text-sm font-serrat text-[#414141]">
          {t('attributes.cancelSubscriptionConfirm')}
        </StyledText>
        <StyledView className="flex-row w-full justify-between mt-6 px-10">
          <StyledTouchableOpacity
            onPress={() => {
              setCancelSubscriptionModalOpen(false);
            }}
            className="py-2 w-1/2 rounded-md">
            <StyledText className="text-center text-lg font-serrat-medium text-zinc-500">
              {t('attributes.profileDeleteNo')}
            </StyledText>
          </StyledTouchableOpacity>
          <StyledTouchableOpacity
            onPress={() => {
              cancelEnrollment();
            }}
            className="py-2 bg-[#0079E9] w-1/2 rounded-md">
            <StyledText className="text-center text-lg text-white font-serrat-medium">
              {t('attributes.mainCheckoutConfirm')}
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledView>
    </StyledView>
  );
};

export default CancelSubscriptionModal;
