import Styled from '@common/StyledComponents';
import {FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';
import InfoPill from './InfoPill';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useState, useEffect} from 'react';
import {fetchData} from '@utils/fetchData';
import CustomComponents from '@common/CustomComponents';
import {API_URL} from '@env';

const TopSales = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [topSaleItems, setTopSaleItems] = useState([]);

  const getTopSales = async () => {
    const result = await fetchData({
      url: `${API_URL}/meals/?top=true&page_size=100`,
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
          navigation.navigate('FoodDetails', {item: item, source: 'TopSales'});
        }}
        className="w-[267px] h-[281px] bg-white rounded-[18px] shadow shadow-zinc-300">
        {item?.new && <InfoPill type="new" />}
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
          <Styled.View className="flex-row items-center gap-2 justify-end mt-3">
            {(() => {
              const hasDiscount = item?.has_discount;
              
              if (hasDiscount) {
                return (
                  <>
                    <Styled.Text
                      className="font-poppins-bold text-md text-[#BF4E30]"
                      style={{textDecorationLine: 'line-through', textDecorationColor: '#C53030'}}>
                      {item?.original_price} ₼
                    </Styled.Text>
                    <Styled.Text
                      className="font-poppins-bold text-sm text-[#42C2E5]"
                      numberOfLines={2}>
                      {item?.discounted_price} ₼
                    </Styled.Text>
                  </>
                );
              } else {
                return (
          <Styled.Text
                    className="font-poppins-bold text-sm text-[#42C2E5]"
                    numberOfLines={2}>
                    {item?.price} ₼
          </Styled.Text>
                );
              }
            })()}
          </Styled.View>
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
              navigationScreen: 'TopSales',
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
