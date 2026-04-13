import Styled from '@common/StyledComponents';
import {fetchData} from '@utils/fetchData';
import storage from '@utils/MMKVStore';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import FoodItem from './components/FoodItem';
import {useRoute} from '@react-navigation/native';
import {FlatList} from 'react-native';
import NoItemsFound from '@common/NoItemsFound';
import CustomComponents from '@common/CustomComponents';
import {format} from 'date-fns';
import {az, enUS} from 'date-fns/locale';
import CategoryHeader from './components/CategoryHeader';
import {API_URL} from '@env';

// Section başlığı (renderSectionHeader ile aynı spacing) — getItemLayout ile uyumlu sabit yükseklik

const SECTION_HEADER_HEIGHT = Platform.OS === 'android' ? 72 : 64;
// FoodItem: h-[140px] + my-2 (8+8)
const FOOD_ROW_HEIGHT = 156;

const buildFlatRows = sections => {
  const rows = [];
  for (const section of sections) {
    rows.push({kind: 'header', title: section.title});
    for (const item of section.data) {
      rows.push({kind: 'food', item});
    }
  }
  return rows;
};

const buildRowOffsets = rows => {
  const offsets = [];
  let offset = 0;
  for (let i = 0; i < rows.length; i++) {
    offsets.push(offset);
    offset +=
      rows[i].kind === 'header' ? SECTION_HEADER_HEIGHT : FOOD_ROW_HEIGHT;
  }
  return offsets;
};

const FoodMenu = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [menu, setMenu] = useState([]);
  const [searchText, setSearchText] = useState('');
  const route = useRoute();
  const {year, date, fullDate} = route.params;
  const scrollToCategory = route.params?.scrollToCategory;
  const today = new Date();
  const listRef = useRef(null);

  const filteredMenu = useMemo(() => {
    if (!searchText.trim()) {
      return menu;
    }

    const searchLower = searchText.toLowerCase();
    return menu
      .map(section => ({
        ...section,
        data: section.data.filter(item => {
          const name = item.meal?.name || item.name || '';
          const description = item.meal?.description || item.description || '';
          return (
            name.toLowerCase().includes(searchLower) ||
            description.toLowerCase().includes(searchLower)
          );
        }),
      }))
      .filter(section => section.data.length > 0);
  }, [menu, searchText]);

  const flatRows = useMemo(() => buildFlatRows(filteredMenu), [filteredMenu]);

  const rowOffsets = useMemo(() => buildRowOffsets(flatRows), [flatRows]);

  const getItemLayout = useCallback(
    (_data, index) => {
      const row = flatRows[index];
      const length =
        row.kind === 'header' ? SECTION_HEADER_HEIGHT : FOOD_ROW_HEIGHT;
      return {
        length,
        offset: rowOffsets[index],
        index,
      };
    },
    [flatRows, rowOffsets],
  );

  const scrollToSectionByTitle = useCallback(
    title => {
      const index = flatRows.findIndex(
        row => row.kind === 'header' && row.title === title,
      );
      if (index === -1 || !listRef.current) {
        return;
      }
      listRef.current.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0,
        viewOffset: 50,
      });
    },
    [flatRows],
  );

  const onScrollToIndexFailed = info => {
    const targetIndex = info.index;
    setTimeout(() => {
      listRef.current?.scrollToIndex({
        index: targetIndex,
        animated: true,
        viewPosition: 0,
        viewOffset: 50,
      });
    }, 100);
  };

  const selectedLanguage = storage.getString('selectedLanguage');

  const getLocale = language => {
    switch (language) {
      case 'az':
        return az;
      case 'en':
      default:
        return enUS;
    }
  };

  const formattedMonth = format(today, 'MMMM', {
    locale: getLocale(selectedLanguage),
  });

  const getFoodData = async () => {
    const result = await fetchData({
      url: `${API_URL}/menu-items/?date=${fullDate}&page_size=100`,
      tokenRequired: true,
    });
    console.log(result);

    if (!result?.success || !result?.data?.results?.[0]?.meal_items) {
      setMenu([]);
      setCategories([]);
      return;
    }

    const restructureData = items => {
      return items.reduce((acc, item) => {
        const categoryName = item.meal.category.name;

        const categoryGroup = acc.find(group => group.title === categoryName);

        setCategories(prevCategories => {
          if (!prevCategories.includes(categoryName)) {
            return [...prevCategories, categoryName];
          }
          return prevCategories;
        });

        if (categoryGroup) {
          categoryGroup.data.push(item);
        } else {
          acc.push({
            title: categoryName,
            data: [item],
          });
        }

        return acc;
      }, []);
    };

    const allMealItems = result.data.results.flatMap(item => item.meal_items);
    const structuredData = restructureData(allMealItems);
    setMenu(structuredData);
  };

  useEffect(() => {
    getFoodData();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- yalnız mount: fullDate ile tek istek
  }, []);

  useEffect(() => {
    setSelectedCategory(scrollToCategory ? scrollToCategory : categories[0]);
  }, [scrollToCategory, categories]);

  useEffect(() => {
    if (!selectedCategory || !flatRows.length) {
      return;
    }
    const id = requestAnimationFrame(() => {
      scrollToSectionByTitle(selectedCategory);
    });
    return () => cancelAnimationFrame(id);
  }, [selectedCategory, scrollToSectionByTitle, flatRows.length]);

  const keyExtractor = useCallback((row, index) => {
    if (row.kind === 'header') {
      return `h-${row.title}-${index}`;
    }
    const mealId = row.item?.meal?.id ?? row.item?.id ?? index;
    return `f-${mealId}-${index}`;
  }, []);

  const renderRow = useCallback(
    ({item: row}) => {
      if (row.kind === 'header') {
        return (
          <Styled.Text className="text-[#414141] font-poppins-medium text-[20px] mx-5 mt-5 mb-3">
            {row.title}
          </Styled.Text>
        );
      }
      return (
        <FoodItem
          showCount={true}
          item={row.item}
          source="WeeklyMenu"
          menuDate={fullDate}
        />
      );
    },
    [fullDate],
  );

  return (
    <>
      <CustomComponents.Header
        bgColor="bg-white"
        extraStyles="border-white"
        title={`${date} ${formattedMonth} ${year}`}
      />

      <Styled.View className="bg-white px-4 py-3 ">
        <Styled.View className="relative">
          <Styled.TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Yemək axtarın..."
            placeholderTextColor="#9CA3AF"
            className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-black font-poppins text-base"
          />
          {searchText.length > 0 && (
            <Styled.TouchableOpacity
              onPress={() => setSearchText('')}
              className="absolute right-3 top-3">
              <Styled.Text className="text-gray-400 text-lg">✕</Styled.Text>
            </Styled.TouchableOpacity>
          )}
        </Styled.View>
      </Styled.View>

      <CategoryHeader
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        scrollToSectionByTitle={scrollToSectionByTitle}
      />

      {filteredMenu?.length ? (
        <FlatList
          ref={listRef}
          style={{flex: 1, backgroundColor: '#F8F8F8'}}
          data={flatRows}
          keyExtractor={keyExtractor}
          renderItem={renderRow}
          getItemLayout={getItemLayout}
          onScrollToIndexFailed={onScrollToIndexFailed}
          initialNumToRender={24}
          maxToRenderPerBatch={12}
          windowSize={11}
          removeClippedSubviews={false}
        />
      ) : (
        <NoItemsFound />
      )}
    </>
  );
};

export default FoodMenu;
