import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import MainPageHeader from './components/MainPageHeader';
import {
  StyledView,
  StyledText
} from '@common/StyledComponents';
import { API_URL } from "@env"
import StudentsAccordion from './components/StudentsAccordion';
import Rides from './components/Rides';
import RidesModal from './components/RidesModal';
import { useTranslation } from 'react-i18next';
import { storage } from '@utils/MMKVStore';
import { fetchData } from '@utils/dataFetch';

const HomePage = () => {
  const navigation = useNavigation();
  const [isRidesModalOpen, setIsRidesModalOpen] = useState(false);
  const [upcomingRides, setUpcomingRides] = useState(null);
  const [children, setChidlren] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const dataFetch = async () => {
      // const url = `${API_URL}/rides/upcomings/`;
      const url = `${API_URL}/rides/upcomings/`;
      const token = storage.getString("accessToken");
      const lang = storage.getString("selectedLanguage");
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Accept-Language": lang
      }

      const result = await fetchData(url, headers);

      const groupedData = result.data.reduce((acc, current) => {
        const childId = current.child.id;
        acc[childId] = acc[childId] || [];
        acc[childId].push(current);
        return acc;
      }, {});

      const newArray = Object.values(groupedData).map((group) => {
        return group[0];
      });
      // console.log(new Date(result.data[0].pickup_time));
      // console.log(result.data);

      if (result.success) {
        setUpcomingRides(result.data);
        setChidlren(newArray);
      }

    }

    dataFetch()
  }, [])

  return (
    <StyledView className="flex-1 bg-white">
      <MainPageHeader navigation={navigation} />
      <StyledView className="bg-white w-full h-full p-4">
        <StyledText className="text-lg mb-4 text-[#204F50] font-poppi-semibold">
          {t('attributes.todaysRideToSchool')}
        </StyledText>
        <Rides setModalOpen={setIsRidesModalOpen} items={upcomingRides} />
        <StyledText className="text-lg my-4 text-[#204F50] font-poppi-semibold">
          {t('attributes.studentList')}
        </StyledText>
        <StudentsAccordion items={children} />
      </StyledView>
      {isRidesModalOpen && (
        <RidesModal items={upcomingRides} setModalOpen={setIsRidesModalOpen} />
      )}
    </StyledView>
  );
};

export default HomePage;