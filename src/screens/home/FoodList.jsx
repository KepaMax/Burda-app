import CustomComponents from '@common/CustomComponents';
import {FlatList} from 'react-native';
import FoodItem from './components/FoodItem';
import {useRoute} from '@react-navigation/native';
import NoItemsFound from '@common/NoItemsFound';

const FoodList = () => {
  const route = useRoute();
  const title = route.params?.title;
  const items = route.params?.items;

  return (
    <>
      <CustomComponents.Header title={title} bgColor="bg-white" />
      <FlatList
        style={{
          backgroundColor: '#F8F8F8',
          flex: 1,
        }}
        contentContainerStyle={{
          paddingVertical: 10,
        }}
        data={items}
        renderItem={({item}) => <FoodItem item={item} />}
        ListEmptyComponent={() => <NoItemsFound />}
      />
    </>
  );
};

export default FoodList;
