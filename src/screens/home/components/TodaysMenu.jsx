import Styled from '@common/StyledComponents';
import {FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';
import InfoPill from './InfoPill';
import {useState, useEffect} from 'react';
import {fetchData} from '@utils/fetchData';
import CustomComponents from '@common/CustomComponents';
import {useMMKVString} from 'react-native-mmkv';
import {format} from 'date-fns';
import {az, enUS} from 'date-fns/locale';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {API_URL} from '@env';
import Svg, {Path, Defs, RadialGradient, Stop} from 'react-native-svg';

const TodaysMenu = () => {
  const [selectedLanguage, setSelectedLanguage] =
    useMMKVString('selectedLanguage');
  const date = format(new Date(), 'yyyy-MM-d');
  const formatString = 'd MMMM';
  console.log(selectedLanguage);

  const locale = selectedLanguage === 'az' ? az : enUS;

  const formattedDate = format(new Date(), formatString, {locale});
  const {t} = useTranslation();
  const [menuItems, setMenuItems] = useState([]);
  const navigation = useNavigation();

  const getMenuItems = async () => {
    const result = await fetchData({
      url: `${API_URL}/menu-items/?date=${date}&page_size=100`,
      tokenRequired: true,
    });
    const getUniqueByCategoryId = items => {
      const uniqueItemsMap = new Map();

      items.forEach(item => {
        const categoryId = item.meal.category.id;

        if (!uniqueItemsMap.has(categoryId)) {
          uniqueItemsMap.set(categoryId, item);
        }
      });

      return Array.from(uniqueItemsMap.values());
    };

    const uniqueItems = getUniqueByCategoryId(result.data.results[0].meal_items);

    result?.success && setMenuItems(uniqueItems);
  };

  useEffect(() => {
    getMenuItems();
  }, []);

  const MenuItem = ({item}) => {
    const category = item.meal.category;
    const hasDiscount = item.meal.has_discount;
    const originalPrice = item.meal.original_price;
    const discountedPrice = item.meal.discounted_price;

    // İndirim yüzdesini API response'dan al (max_discount)
    const discountPercent = hasDiscount 
      ? (item.meal?.category?.max_discount ?? 0)
      : 0;
    return (
      <Styled.TouchableOpacity
        onPress={() => {
          navigation.navigate('FoodMenu', {
            scrollToCategory: category.name,
            categoryId: category.id,
            date: date.split('-')[2],
            month: date.split('-')[1],
            year: date.split('-')[0],
            fullDate: date,
          });
        }}
        className="w-[226px] h-[280px] px-4 py-2.5 bg-white rounded-[10px] shadow shadow-zinc-300">
        <Styled.View style={{position: 'relative'}}>
        <FastImage
          source={{uri: category.thumbnail}}
          style={{height: 144, borderRadius: 18}}
        />
          {hasDiscount && discountPercent > 0 && (
            <Styled.View
              style={{
                position: 'absolute',
                top: 3,
                right: 3,
                width: 45,
                height: 45,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Shadow */}
              <Svg
                width={45}
                height={45}
                viewBox="2067 114 855 811"
                style={{ position: 'absolute', top: 3, left: 0 }}
              >
                <Path
                  d="M2890.93,604.28L2890.78,604.457C2871.7,626.659 2863.75,656.339 2869.19,685.106L2869.21,685.206C2878.06,732.033 2851.33,778.291 2806.33,793.999C2778.62,803.673 2756.83,825.458 2747.16,853.17C2731.45,898.164 2685.19,924.898 2638.37,916.045L2638.27,916.027C2609.5,910.588 2579.82,918.533 2557.62,937.617L2557.44,937.769C2521.35,968.79 2468.01,968.79 2431.92,937.769L2431.74,937.617C2409.54,918.533 2379.86,910.588 2351.09,916.026L2350.99,916.045C2304.17,924.898 2257.91,898.164 2242.2,853.17L2242.2,853.169C2232.53,825.458 2210.74,803.672 2183.03,793.998C2138.03,778.29 2111.3,732.032 2120.15,685.204L2120.17,685.106C2125.61,656.338 2117.66,626.659 2098.58,604.456L2098.43,604.28C2067.409,568.188 2067.409,514.847 2098.43,478.755L2098.58,478.578C2117.66,456.376 2125.61,426.696 2120.17,397.929L2120.15,397.829C2111.3,351.002 2138.03,304.744 2183.03,289.036C2210.74,279.362 2232.53,257.576 2242.2,229.865C2257.91,184.871 2304.17,158.136 2350.99,166.989L2351.09,167.008C2379.86,172.447 2409.54,164.502 2431.74,145.418L2431.92,145.266C2468.01,114.245 2521.35,114.245 2557.44,145.266L2557.62,145.418C2579.82,164.502 2609.5,172.447 2638.27,167.009L2638.37,166.99C2685.2,158.137 2731.45,184.871 2747.16,229.865L2747.16,229.866C2756.84,257.577 2778.62,279.363 2806.33,289.037C2851.33,304.744 2878.06,351.003 2869.21,397.831L2869.19,397.929C2863.75,426.697 2871.7,456.376 2890.78,478.579L2890.93,478.755C2921.95,514.847 2921.95,568.188 2890.93,604.28Z"
                  fill="rgba(0,0,0,0.18)"
                />
              </Svg>
            
              {/* Main badge */}
              <Svg width={45} height={45} viewBox="2067 114 855 811" style={{ position: 'absolute', left: 0 }}>
                <Defs>
                  <RadialGradient id="discountGrad" cx="35%" cy="35%">
                    <Stop offset="0%" stopColor="#FF6B6B" />
                    <Stop offset="100%" stopColor="#E63946" />
                  </RadialGradient>
                </Defs>
            
                <Path
                  d="M2890.93,604.28L2890.78,604.457C2871.7,626.659 2863.75,656.339 2869.19,685.106L2869.21,685.206C2878.06,732.033 2851.33,778.291 2806.33,793.999C2778.62,803.673 2756.83,825.458 2747.16,853.17C2731.45,898.164 2685.19,924.898 2638.37,916.045L2638.27,916.027C2609.5,910.588 2579.82,918.533 2557.62,937.617L2557.44,937.769C2521.35,968.79 2468.01,968.79 2431.92,937.769L2431.74,937.617C2409.54,918.533 2379.86,910.588 2351.09,916.026L2350.99,916.045C2304.17,924.898 2257.91,898.164 2242.2,853.17L2242.2,853.169C2232.53,825.458 2210.74,803.672 2183.03,793.998C2138.03,778.29 2111.3,732.032 2120.15,685.204L2120.17,685.106C2125.61,656.338 2117.66,626.659 2098.58,604.456L2098.43,604.28C2067.409,568.188 2067.409,514.847 2098.43,478.755L2098.58,478.578C2117.66,456.376 2125.61,426.696 2120.17,397.929L2120.15,397.829C2111.3,351.002 2138.03,304.744 2183.03,289.036C2210.74,279.362 2232.53,257.576 2242.2,229.865C2257.91,184.871 2304.17,158.136 2350.99,166.989L2351.09,167.008C2379.86,172.447 2409.54,164.502 2431.74,145.418L2431.92,145.266C2468.01,114.245 2521.35,114.245 2557.44,145.266L2557.62,145.418C2579.82,164.502 2609.5,172.447 2638.27,167.009L2638.37,166.99C2685.2,158.137 2731.45,184.871 2747.16,229.865L2747.16,229.866C2756.84,257.577 2778.62,279.363 2806.33,289.037C2851.33,304.744 2878.06,351.003 2869.21,397.831L2869.19,397.929C2863.75,426.697 2871.7,456.376 2890.78,478.579L2890.93,478.755C2921.95,514.847 2921.95,568.188 2890.93,604.28Z"
                  fill="url(#discountGrad)"
                />
              </Svg>
            
              {/* Text */}
              <Styled.Text
                style={{
                  color: 'white',
                  fontSize: 12,
                  top: 1,
                  fontFamily: 'Poppins-Bold',
                  textShadowColor: 'rgba(0,0,0,0.25)',
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 2,
                  zIndex: 10,
                }}
              >
                -{discountPercent}%
              </Styled.Text>
            </Styled.View>
          )}
        </Styled.View>
        <Styled.Text
          numberOfLines={1}
          className="text-base font-poppins-semibold mt-3 text-black">
          {category.name}
        </Styled.Text>
        <Styled.Text
          numberOfLines={2}
          className="text-xs mt-2 font-poppins text-black">
          {category.description}
        </Styled.Text>
        <Styled.Text
          numberOfLines={2}
          className="text-sm text-right mt-3 text-[#42C2E5] font-poppins">
          {selectedLanguage === 'en' && 'From '}
          <Styled.Text className="font-poppins-bold">
            {' '}
            {category.starting_price} ₼
          </Styled.Text>
          {selectedLanguage === undefined  && '-dən başlayaraq'}
          {selectedLanguage === "az"  && '-dən başlayaraq'}
        </Styled.Text>
      </Styled.TouchableOpacity>
    );
  };

  if (menuItems.length) {
    return (
      <>
        <Styled.View className="flex-row justify-between items-center mx-5">
          <Styled.Text className="text-[20px] text-[#184639] font-poppins-medium">
            {t('todaysMenu')}{' '}
            <Styled.Text className="text-[#7D7D7D] font-poppins-italic">
              ({formattedDate})
            </Styled.Text>
          </Styled.Text>

          <CustomComponents.Link
            title={t('seeMore')}
            textColor="text-[#66B600]"
            textSize="text-sm w-[60px]"
            numberOfLines={1}
            fontWeight="font-poppins"
            linkAction={() => {
              navigation.navigate('FoodMenu', {
                date: date.split('-')[2],
                month: date.split('-')[1],
                year: date.split('-')[0],
                fullDate: date,
              });
            }}
          />
        </Styled.View>

        <FlatList
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{gap: 20, padding: 20}}
          horizontal
          data={menuItems}
          renderItem={({item}) => <MenuItem item={item} />}
        />
      </>
    );
  }
};

export default TodaysMenu;
