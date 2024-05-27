import { ScrollView, View, RefreshControl } from 'react-native';
import { styled } from 'nativewind';
import { useEffect, useContext, useState } from 'react';
import AuthContext from '../common/TokenManager';
import { useNavigation } from '@react-navigation/native';
import AddChildHomeIcon from "../../assets/icons/add-child-home.svg"
import ArrowRightHomeIcon from "../../assets/icons/arrow-right-home.svg"
import MainPageHeader from './components/MainPageHeader';
import { StyledText, StyledTouchableOpacity } from '../common/components/StyledComponents';
import CreateRideRequest from './components/CreateRideRequest';
import StudentsAccordion from './components/StudentsAccordion';
import Rides from './components/Rides';
import RidesModal from './components/RidesModal';
import { useTranslation } from 'react-i18next';

const StyledView = styled(View);

const MainPage = ({ navigation }) => {
  const { addStudent, getGuestMode } = useContext(AuthContext);
  const navigationHook = useNavigation();
  const [ridesModalOpen, setRidesModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchData, setFetchData] = useState(true);
  const [guestMode, setGuestMode] = useState(null);
  const {t} = useTranslation();

  const onRefresh = () => {
    setFetchData(!fetchData);
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    addStudent ? navigationHook.navigate('AddStudentSignup') : null;
    const guestMode = async () => {
      const mode = await getGuestMode();
      setGuestMode(mode);
    };

    guestMode();
  }, []);

  const rides = [
    {
      fullname: "Aytac Samadova",
      address: "Uzeyir Hajibayov 57",
      completed: true
    },
    {
      fullname: "Aytac Samadova",
      address: "Uzeyir Hajibayov 57",
      completed: true
    },
    {
      fullname: "Aytac Samadova",
      address: "Uzeyir Hajibayov 57",
      completed: true
    },
    {
      fullname: "Aytac Samadova",
      address: "Uzeyir Hajibayov 57",
      completed: true
    },
    {
      fullname: "Aytac Samadova",
      address: "Uzeyir Hajibayov 57",
      completed: true
    },
    {
      fullname: "Aytac Samadova",
      address: "Uzeyir Hajibayov 57",
      completed: false
    },
    {
      fullname: "Aytac Samadova",
      address: "Uzeyir Hajibayov 57",
      completed: false
    },
    {
      fullname: "Aytac Samadova",
      address: "Uzeyir Hajibayov 57",
      completed: false
    },
  ]

  const students = [
    {
      firstname: "Aytac",
      lastname: "Samadova",
      phone: "tel:7777777777"
    },
    {
      firstname: "Aytac",
      lastname: "Samadova",
      phone: "tel:7777777777"
    },
    {
      firstname: "Aytac",
      lastname: "Samadova",
      phone: "tel:7777777777"
    },
    {
      firstname: "Aytac",
      lastname: "Samadova",
      phone: "tel:7777777777"
    },
    {
      firstname: "Aytac",
      lastname: "Samadova",
      phone: "tel:7777777777"
    },
    {
      firstname: "Aytac",
      lastname: "Samadova",
      phone: "tel:7777777777"
    },
    {
      firstname: "Aytac",
      lastname: "Samadova",
      phone: "tel:7777777777"
    },
    {
      firstname: "Aytac",
      lastname: "Samadova",
      phone: "tel:7777777777"
    },
    {
      firstname: "Aytac",
      lastname: "Samadova",
      phone: "tel:7777777777"
    }
  ]

  return (
    <StyledView className="flex-1 bg-white">
      <MainPageHeader navigation={navigation} />
      <StyledView className="bg-white w-full h-full p-4">
        <StyledText className="text-lg mb-4 text-[#204F50] font-poppi-semibold">{t("attributes.todaysRideToSchool")}</StyledText>
        <Rides setModalOpen={setRidesModalOpen} items={rides} />
        <StyledText className="text-lg my-4 text-[#204F50] font-poppi-semibold">{t("attributes.studentList")}</StyledText>
        <StudentsAccordion items={students} />
      </StyledView>
      {ridesModalOpen && <RidesModal items={rides} setModalOpen={setRidesModalOpen} />}
    </StyledView>
  );
};

export default MainPage;
