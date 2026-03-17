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
import {ActivityIndicator, RefreshControl} from 'react-native';
import Images from '@images/images';
import {API_URL} from '@env';
import {fetchData} from '@utils/fetchData';

const HomePage = () => {
  const isFocused = useIsFocused();
  const arr = [Images.Banner1, Images.Banner2];
  const [basketVisible, setBasketVisible] = useMMKVBoolean('basketVisible');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [sliderImages, setSliderImages] = useState(arr);

  useEffect(() => {
    isFocused && setBasketVisible(true);
  }, [isFocused]);

  const getSliderImages = async () => {
    const result = await fetchData({
      url: `${API_URL}/sliders/`,
    });
    if (result?.success) {
      setSliderImages(result.data.map(item => item.image));
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    getSliderImages();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshKey(prev => prev + 1);
    await getSliderImages();
  };

  return !loading ? (
    <Styled.ScrollView
      className="h-full bg-[#F8F8F8]"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#184639"
        />
      }>
      <HomeHeader />
      <CarouselC sliderImages={sliderImages} />
      <WeeklyMenu key={`weekly-${refreshKey}`} />
      <TodaysMenu key={`todays-${refreshKey}`} />
      <Categories key={`categories-${refreshKey}`} />
      <TopSales key={`topsales-${refreshKey}`} />
    </Styled.ScrollView>
  ) : (
    <Styled.View className="flex-1 bg-[#F8F8F8] justify-center items-center">
      <ActivityIndicator size="large" color="#184639" />
    </Styled.View>
  );
};

export default HomePage;
