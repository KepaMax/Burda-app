import Styled from '@common/StyledComponents';
import {FlatList} from 'react-native';

const WeeklyMenu = () => {
  const arr = [...new Array(7).keys()];

  const MenuItem = () => {
    return (
      <Styled.TouchableOpacity className="w-[48px] h-[98px] bg-white rounded-[100px] shadow shadow-zinc-300"></Styled.TouchableOpacity>
    );
  };

  return (
    <>
      <Styled.View className="flex-row justify-between items-center mx-5">
        <Styled.Text className="text-[20px] text-[#184639] font-medium">
          Weekly menu
        </Styled.Text>
        <Styled.TouchableOpacity>
          <Styled.Text className="text-sm text-[#66B600]">See more</Styled.Text>
        </Styled.TouchableOpacity>
      </Styled.View>

      <FlatList
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 20,
          padding: 20,
          paddingRight: 40,
          backgroundColor: 'white',
          margin: 20,
          borderRadius: 8,
        }}
        horizontal
        data={arr}
        renderItem={item => <MenuItem item={item} />}
      />
    </>
  );
};

export default WeeklyMenu;
