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

const FoodMenu = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [menu, setMenu] = useState([]);
  const route = useRoute();
  const {year, date, fullDate} = route.params;
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
      url: `https://api.myburda.com/api/v1/menu-items/?date=${fullDate}`,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${storage.getString('accessToken')}`,
      },
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

  useEffect(() => {
    getFoodData();
  }, []);

  useEffect(() => {
    setSelectedCategory(categories[0]);
  }, [menu]);

  return (
    <>
      <CustomComponents.Header
        bgColor="bg-white"
        extraStyles="border-white"
        title={`${date} ${formattedMonth} ${year}`}
      />

      {categories?.length ? (
        <Styled.ScrollView
          className="bg-white"
          horizontal
          contentContainerStyle={{
            gap: 24,
            paddingHorizontal: 20,
          }}>
          {categories.map(category => (
            <CustomComponents.Link
              padding="pb-4"
              margin="mb-2"
              title={category}
              textSize="text-lg"
              fontWeight="font-poppins-medium"
              textColor={
                category === selectedCategory
                  ? 'text-[#66B600] underline'
                  : 'text-[#B7B7B7]'
              }
              linkAction={() => {
                setSelectedCategory(category);
                scrollToSectionByTitle(category);
              }}
            />
          ))}
        </Styled.ScrollView>
      ) : null}

      {menu?.length ? (
        <SectionList
          ref={sectionListRef}
          stickySectionHeadersEnabled={false}
          sections={menu}
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
