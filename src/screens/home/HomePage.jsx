import Styled from '@common/StyledComponents';
import CarouselC from './components/CarouselC';
import Categories from './components/Categories';
import HomeHeader from './components/HomeHeader';
import TodaysMenu from './components/TodaysMenu';
import TopSales from './components/TopSales';
import WeeklyMenu from './components/WeeklyMenu';
import {useMMKVBoolean} from 'react-native-mmkv';
import {useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native';

const HomePage = () => {
  const isFocused = useIsFocused();
  const [basketVisible, setBasketVisible] = useMMKVBoolean('basketVisible');

  useEffect(() => {
    isFocused && setBasketVisible(true);
  }, [isFocused]);

  return (
    <Styled.ScrollView className="h-full bg-[#F8F8F8]">
      <HomeHeader />
      <CarouselC />
      <Categories />
      <TodaysMenu />
      <TopSales />
      <WeeklyMenu />
    </Styled.ScrollView>
  );
};

export default HomePage;
