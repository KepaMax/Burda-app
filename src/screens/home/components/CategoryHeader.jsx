import CustomComponents from '@common/CustomComponents';
import Styled from '@common/StyledComponents';
import {FlatList} from 'react-native';

const CategoryHeader = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  scrollToSectionByTitle,
}) => {
  return (
    <Styled.View>
      <FlatList
        data={categories}
        renderItem={({item}) => (
          <CustomComponents.Link
            padding="pb-4"
            title={item}
            textSize="text-lg"
            fontWeight="font-poppins-medium"
            textColor={
              item === selectedCategory
                ? 'text-[#66B600] underline'
                : 'text-[#B7B7B7]'
            }
            linkAction={() => {
              setSelectedCategory(item);
              scrollToSectionByTitle(item);
            }}
          />
        )}
        showsHorizontalScrollIndicator={false}
        className="bg-white"
        horizontal
        contentContainerStyle={{
          gap: 24,
          paddingHorizontal: 20,
        }}
      />
    </Styled.View>
  );
};

export default CategoryHeader;
