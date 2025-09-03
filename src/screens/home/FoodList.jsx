import CustomComponents from '@common/CustomComponents';
import {FlatList} from 'react-native';
import FoodItem from './components/FoodItem';
import {useRoute} from '@react-navigation/native';
import NoItemsFound from '@common/NoItemsFound';
import {useState, useMemo} from 'react';
import Styled from '@common/StyledComponents';

const FoodList = () => {
  const route = useRoute();
  const title = route.params?.title;
  const items = route.params?.items;
  const navigationScreen = route.params?.navigationScreen;
  
  const [searchText, setSearchText] = useState('');

  // Filter items based on search text
  const filteredItems = useMemo(() => {
    if (!searchText.trim()) {
      return items;
    }
    
    return items?.filter(item => 
      item.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchText.toLowerCase())
    ) || [];
  }, [items, searchText]);

  return (
    <>
      <CustomComponents.Header title={title} bgColor="bg-white" />
      
      {/* Search Bar */}
      <Styled.View className="bg-white px-4 py-3 border-b border-gray-200">
        <Styled.View className="relative">
          <Styled.TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Yemək axtarın..."
            placeholderTextColor="#9CA3AF"
            className="bg-white border border-gray-200 rounded-lg px-4 py-3  text-black font-poppins text-base"
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
      
      <FlatList
        style={{
          backgroundColor: '#F8F8F8',
          flex: 1,
        }}
        contentContainerStyle={{
          paddingVertical: 10,
        }}
        data={filteredItems}
        renderItem={({item}) => <FoodItem showCount={false} item={item} />}
        ListEmptyComponent={() => <NoItemsFound />}
      />
    </>
  );
};

export default FoodList;
