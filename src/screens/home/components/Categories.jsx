import Styled from '@common/StyledComponents';
import {FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';

const Categories = () => {
  2;
  const arr = [...new Array(3).keys()];

  const CategoryItem = ({item}) => {
    return (
      <Styled.TouchableOpacity className="items-center gap-2 mb-5">
        <FastImage
          style={{borderWidth: 1, width: 50, height: 50, borderRadius: 100}}
          source={item}
        />
        <Styled.Text className="text-sm text-[#184639]">item name</Styled.Text>
      </Styled.TouchableOpacity>
    );
  };

  return (
    <FlatList
      contentContainerStyle={{gap: 20, paddingHorizontal: 20}}
      horizontal
      data={arr}
      renderItem={item => <CategoryItem item={item} />}
    />
  );
};

export default Categories;
