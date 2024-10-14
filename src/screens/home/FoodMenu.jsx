import Styled from '@common/StyledComponents';
import {fetchData} from '@utils/fetchData';
import storage from '@utils/MMKVStore';
import {useEffect, useState, useRef} from 'react';
import FoodItem from './components/FoodItem';
import {useRoute} from '@react-navigation/native';
import {SectionList} from 'react-native';
import NoItemsFound from '@common/NoItemsFound';
import CustomComponents from '@common/CustomComponents';
import {format} from 'date-fns';
import {az, enUS} from 'date-fns/locale';
import CategoryHeader from './components/CategoryHeader';

const FoodMenu = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [menu, setMenu] = useState([]);
  const route = useRoute();
  const {year, date, fullDate} = route.params;
  const scrollToCategory = route.params?.scrollToCategory;
  const today = new Date();
  const sectionListRef = useRef(null);

  const scrollToSectionByTitle = title => {
    const sectionIndex = menu.findIndex(section => section.title === title);

    if (sectionIndex !== -1) {
      sectionListRef.current.scrollToLocation({
        animated: true,
        sectionIndex: sectionIndex,
        itemIndex: 0,
        viewPosition: 0,
      });
    }
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
      url: `https://api.myburda.com/api/v1/menu-items/?date=${fullDate}&page_size=100`,
    });

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

    const structuredData = restructureData(result.data.results);

    result?.success && setMenu(structuredData);
  };

  const getItemLayout = (data, index) => {
    const itemHeight = 140; // Adjust this to match your item's height
    return {
      length: itemHeight,
      offset: itemHeight * index,
      index,
    };
  };

  const onScrollToIndexFailed = info => {
    console.warn('Scroll to index failed', info);
    // You might want to handle this more gracefully
  };

  useEffect(() => {
    getFoodData();
  }, []);

  useEffect(() => {
    setSelectedCategory(scrollToCategory ? scrollToCategory : categories[0]);
  }, [scrollToCategory, categories]);

  useEffect(() => {
    scrollToSectionByTitle(selectedCategory);
  }, [selectedCategory, menu]);

  return (
    <>
      <CustomComponents.Header
        bgColor="bg-white"
        extraStyles="border-white"
        title={`${date} ${formattedMonth} ${year}`}
      />

      <CategoryHeader
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        scrollToSectionByTitle={scrollToSectionByTitle}
      />

      {menu?.length ? (
        <SectionList
          ref={sectionListRef}
          stickySectionHeadersEnabled={false}
          sections={menu}
          getItemLayout={getItemLayout}
          onScrollToIndexFailed={onScrollToIndexFailed}
          renderItem={({item}) => <FoodItem item={item} />}
          renderSectionHeader={({section: {title}}) => (
            <Styled.Text className="text-[#414141] font-poppins-medium text-[20px] mx-5 mt-5 mb-3">
              {title}
            </Styled.Text>
          )}
        />
      ) : (
        <NoItemsFound />
      )}
    </>
  );
};

export default FoodMenu;
