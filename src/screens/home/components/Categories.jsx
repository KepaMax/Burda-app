import Styled from '@common/StyledComponents';
import {FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';
import {fetchData} from '@utils/fetchData';
import {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {API_URL} from '@env';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const navigation = useNavigation();

  const getCategoriesData = async () => {
    const result = await fetchData({
      url: `${API_URL}/categories/`,
    });

    result?.success && setCategories(result?.data.results);
  };

  const getMealsByCategory = async (categoryId, categoryName) => {
    const result = await fetchData({
      url: `${API_URL}/meals/?category=${categoryId}&page_size=100`,
    });

    result?.success &&
      navigation.navigate('FoodList', {
        items: result.data.results,
        title: categoryName,
      });
  };

  useEffect(() => {
    getCategoriesData();
  }, []);

  const CategoryItem = ({item}) => {
    return (
      <Styled.TouchableOpacity
        onPress={() => {
          getMealsByCategory(item.id, item.name);
        }}
        className="items-center gap-2 mb-5">
        <FastImage
          style={{
            borderWidth: 1,
            width: 50,
            height: 50,
            borderRadius: 100,
            borderColor: '#42C2E5',
          }}
          source={{uri: item.thumbnail}}
        />
        <Styled.Text className="text-sm text-[#184639] font-poppins">
          {item.name}
        </Styled.Text>
      </Styled.TouchableOpacity>
    );
  };

  return (
    <FlatList
      keyExtractor={item => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{gap: 20, paddingHorizontal: 20}}
      horizontal
      data={categories}
      renderItem={({item}) => <CategoryItem item={item} />}
    />
  );
};

export default Categories;
