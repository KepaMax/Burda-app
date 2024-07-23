import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import AddChildHomeIcon from '@icons/add-child-home.svg';
import ArrowRightHomeIcon from '@icons/arrow-right-home.svg';
import MainPageHeader from './components/MainPageHeader';
import {
  StyledView,
  StyledText,
  StyledTouchableOpacity,
} from '@common/StyledComponents';
import CreateRideRequest from './components/CreateRideRequest';
import StudentsAccordion from './components/StudentsAccordion';
import Rides from './components/Rides';
import RidesModal from './components/RidesModal';
import {useTranslation} from 'react-i18next';

const HomePage = () => {
  const navigation = useNavigation();
  const [isRidesModalOpen, setIsRidesModalOpen] = useState(false);
  const {t} = useTranslation();

  const rides = [
    {
      fullname: 'Aytac Samadova',
      address: 'Uzeyir Hajibayov 57',
      completed: true,
    },
    {
      fullname: 'Aytac Samadova',
      address: 'Uzeyir Hajibayov 57',
      completed: true,
    },
    {
      fullname: 'Aytac Samadova',
      address: 'Uzeyir Hajibayov 57',
      completed: true,
    },
    {
      fullname: 'Aytac Samadova',
      address: 'Uzeyir Hajibayov 57',
      completed: true,
    },
    {
      fullname: 'Aytac Samadova',
      address: 'Uzeyir Hajibayov 57',
      completed: true,
    },
    {
      fullname: 'Aytac Samadova',
      address: 'Uzeyir Hajibayov 57',
      completed: false,
    },
    {
      fullname: 'Aytac Samadova',
      address: 'Uzeyir Hajibayov 57',
      completed: false,
    },
    {
      fullname: 'Aytac Samadova',
      address: 'Uzeyir Hajibayov 57',
      completed: false,
    },
  ];

  const students = [
    {
      firstname: 'Aytac',
      lastname: 'Samadova',
      phone: 'tel:7777777777',
    },
    {
      firstname: 'Aytac',
      lastname: 'Samadova',
      phone: 'tel:7777777777',
    },
    {
      firstname: 'Aytac',
      lastname: 'Samadova',
      phone: 'tel:7777777777',
    },
    {
      firstname: 'Aytac',
      lastname: 'Samadova',
      phone: 'tel:7777777777',
    },
    {
      firstname: 'Aytac',
      lastname: 'Samadova',
      phone: 'tel:7777777777',
    },
    {
      firstname: 'Aytac',
      lastname: 'Samadova',
      phone: 'tel:7777777777',
    },
    {
      firstname: 'Aytac',
      lastname: 'Samadova',
      phone: 'tel:7777777777',
    },
    {
      firstname: 'Aytac',
      lastname: 'Samadova',
      phone: 'tel:7777777777',
    },
    {
      firstname: 'Aytac',
      lastname: 'Samadova',
      phone: 'tel:7777777777',
    },
  ];

  return (
    <StyledView className="flex-1 bg-white">
      <MainPageHeader navigation={navigation} />
      <StyledView className="bg-white w-full h-full p-4">
        <StyledText className="text-lg mb-4 text-[#204F50] font-poppi-semibold">
          {t('attributes.todaysRideToSchool')}
        </StyledText>
        {/* <Rides setModalOpen={setRidesModalOpen} items={rides} /> */}
        <StyledText className="text-lg my-4 text-[#204F50] font-poppi-semibold">
          {t('attributes.studentList')}
        </StyledText>
        <StudentsAccordion items={students} />
      </StyledView>
      {isRidesModalOpen && (
        <RidesModal items={rides} setModalOpen={setIsRidesModalOpen} />
      )}
    </StyledView>
  );
};

export default HomePage;
