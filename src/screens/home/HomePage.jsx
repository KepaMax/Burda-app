import Styled from '@common/StyledComponents';
import CarouselC from './components/CarouselC';
import Categories from './components/Categories';
import HomeHeader from './components/HomeHeader';
import TodaysMenu from './components/TodaysMenu';
import TopSales from './components/TopSales';
import WeeklyMenu from './components/WeeklyMenu';
import {useMMKVBoolean} from 'react-native-mmkv';
import {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {ActivityIndicator} from 'react-native';
import Images from '@images/images';
import {API_URL} from '@env';
import {fetchData} from '@utils/fetchData';

const HomePage = () => {
  const isFocused = useIsFocused();
  const arr = [Images.Banner1, Images.Banner2];
  const [basketVisible, setBasketVisible] = useMMKVBoolean('basketVisible');
  const [loading, setLoading] = useState(true);
  const [sliderImages, setSliderImages] = useState(arr);

  useEffect(() => {
    isFocused && setBasketVisible(true);
  }, [isFocused]);

  useEffect(() => {
    const getSliderImages = async () => {
      const result = await fetchData({
        url: `${API_URL}/sliders/`,
      });
      console.log(API_URL);
      console.log(result.success);

      if (result.success) {
        setSliderImages(result.data.map(item => item.image));
      }

      setLoading(false);
    };

    getSliderImages();
  }, []);

  useEffect(() => {
    console.log(sliderImages);
  }, [sliderImages]);

  return !loading ? (
    <Styled.ScrollView className="h-full bg-[#F8F8F8]">
      <HomeHeader />
      <CarouselC sliderImages={sliderImages} />
      <WeeklyMenu />
      <TodaysMenu />
      <Categories />
      <TopSales />
    </Styled.ScrollView>
  ) : (
    <Styled.View className="flex-1 bg-[#F8F8F8] justify-center items-center">
      <ActivityIndicator size="large" color="#184639" />
    </Styled.View>
  );
};

export default HomePage;
