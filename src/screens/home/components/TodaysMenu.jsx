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

const TodaysMenu = () => {
  const [selectedLanguage, setSelectedLanguage] =
    useMMKVString('selectedLanguage');
  const date = format(new Date(), 'yyyy-MM-d');
  const formatString = 'd MMMM';

  const locale = selectedLanguage === 'az' ? az : enUS;

  const formattedDate = format(new Date(), formatString, {locale});
  const {t} = useTranslation();
  const [menuItems, setMenuItems] = useState([]);
  const navigation = useNavigation();

  const getMenuItems = async () => {
    const result = await fetchData({
      url: `${API_URL}/menu-items/?date=${date}&page_size=100`,
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

    const uniqueItems = getUniqueByCategoryId(result.data.results);

    result?.success && setMenuItems(uniqueItems);
  };

  useEffect(() => {
    getMenuItems();
  }, []);

  const MenuItem = ({item}) => {
    const category = item.meal.category;

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
        <InfoPill type="new" title="New" />
        <FastImage
          source={{uri: category.thumbnail}}
          style={{height: 144, borderRadius: 18}}
        />
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
          {selectedLanguage === 'en' && 'From'}
          <Styled.Text className="font-poppins-bold">
            {' '}
            {category.starting_price} AZN
          </Styled.Text>
          {selectedLanguage === 'az' && '-dən başlayaraq'}
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
