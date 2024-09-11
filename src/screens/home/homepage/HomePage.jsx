import {useEffect, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import MainPageHeader from './components/MainPageHeader';
import {API_URL} from '@env';
import StudentsAccordion from './components/StudentsAccordion';
import Rides from './components/Rides';
import RidesModal from './components/RidesModal';
import storage from '@utils/MMKVStore';
import {fetchData} from '@utils/fetchData';
import {StyledScrollView} from '@common/StyledComponents';
import {RefreshControl} from 'react-native-gesture-handler';

const HomePage = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [isRidesModalOpen, setIsRidesModalOpen] = useState(false);
  const [upcomingRides, setUpcomingRides] = useState(null);
  const [children, setChidlren] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    getRideData();
    setRefreshing(true);
  };

  const getRideData = async () => {
    const result = await fetchData({
      url: `${API_URL}/rides/upcomings/`,
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': storage.getString('selectedLanguage'),
        Authorization: `Bearer ${storage.getString('accessToken')}`,
      },
      setLoading,
    });

    const groupedData = result?.data?.reduce((acc, current) => {
      const childId = current.child.id;
      acc[childId] = acc[childId] || [];
      acc[childId].push(current);
      return acc;
    }, {});

    if (groupedData) {
      const newArray = Object.values(groupedData).map(group => {
        return group[0];
      });

      if (result?.success) {
        setUpcomingRides(result.data);
        setChidlren(newArray);
      }
    }

    setRefreshing(false);
  };

  useEffect(() => {
    isFocused && getRideData();
  }, [isFocused]);

  return (
    <>
      <MainPageHeader />

      <StyledScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className="bg-white w-full h-full p-4">
        <Rides
          setModalOpen={setIsRidesModalOpen}
          items={upcomingRides?.slice(0, 3)}
        />

        {Boolean(children?.length) && <StudentsAccordion items={children} />}
      </StyledScrollView>

      {isRidesModalOpen && (
        <RidesModal items={upcomingRides} setModalOpen={setIsRidesModalOpen} />
      )}
    </>
  );
};

export default HomePage;
