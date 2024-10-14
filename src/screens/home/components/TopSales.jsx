import Styled from '@common/StyledComponents';
import {FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';
import InfoPill from './InfoPill';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useState, useEffect} from 'react';
import {fetchData} from '@utils/fetchData';
import CustomComponents from '@common/CustomComponents';

const TopSales = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [topSaleItems, setTopSaleItems] = useState([]);

  const getTopSales = async () => {
    const result = await fetchData({
      url: `https://api.myburda.com/api/v1/meals/?top=true&page_size=100`,
    });

    result?.success && setTopSaleItems(result?.data.results);
  };

  useEffect(() => {
    getTopSales();
  }, []);

  const MenuItem = ({item}) => {
    return (
      <Styled.TouchableOpacity
        onPress={() => {
          navigation.navigate('FoodDetails', {item: item});
        }}
        className="w-[267px] h-[281px] bg-white rounded-[18px] shadow shadow-zinc-300">
        <InfoPill type="new" />
        <FastImage
          source={{uri: item.thumbnail}}
          style={{
            height: 144,
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
          }}
        />
        <Styled.View className="px-4 py-2.5">
          <Styled.Text
            numberOfLines={1}
            className="text-base font-poppins-semibold mt-3 text-black">
            {item.name}
          </Styled.Text>
          <Styled.Text
            numberOfLines={2}
            className="text-xs mt-2 font-poppins text-black">
            {item.description}
          </Styled.Text>
          <Styled.Text
            numberOfLines={2}
            className="text-sm text-right mt-3 text-[#42C2E5] font-poppins-bold">
            {item.price} AZN
          </Styled.Text>
        </Styled.View>
      </Styled.TouchableOpacity>
    );
  };

  return (
    <>
      <Styled.View className="flex-row justify-between items-center mx-5">
        <Styled.Text className="text-[20px] text-[#184639] font-poppins-medium">
          {t('topSales')}
        </Styled.Text>

        <CustomComponents.Link
          title={t('seeMore')}
          textColor="text-[#66B600]"
          textSize="text-sm"
          fontWeight="font-poppins"
          linkAction={() => {
            navigation.navigate('FoodList', {
              title: t('topSales'),
              items: topSaleItems,
            });
          }}
        />
      </Styled.View>

      <FlatList
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{gap: 20, padding: 20}}
        horizontal
        data={topSaleItems}
        renderItem={({item}) => <MenuItem item={item} />}
      />
    </>
  );
};

export default TopSales;
