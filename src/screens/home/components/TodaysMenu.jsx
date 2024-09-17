import Styled from '@common/StyledComponents';
import {FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';
import InfoPill from './InfoPill';

const TodaysMenu = () => {
  const arr = [...new Array(3).keys()];

  const MenuItem = () => {
    return (
      <Styled.TouchableOpacity className="w-[226px] h-[280px] px-4 py-2.5 bg-white rounded-[10px] shadow shadow-zinc-300">
        <InfoPill type="new" title="New" />
        <FastImage style={{borderWidth: 1, height: 144, borderRadius: 18}} />
        <Styled.Text numberOfLines={1} className="text-base font-semibold mt-3">
          Main dish
        </Styled.Text>
        <Styled.Text numberOfLines={2} className="text-xs mt-2">
          Lorem dolor sit fuihewf hjfewufv wegfiuwefg
        </Styled.Text>
        <Styled.Text
          numberOfLines={2}
          className="text-sm text-right mt-3 text-[#42C2E5]">
          From
          <Styled.Text className="font-bold"> 12 AZN</Styled.Text>
        </Styled.Text>
      </Styled.TouchableOpacity>
    );
  };

  return (
    <>
      <Styled.View className="flex-row justify-between items-center mx-5">
        <Styled.Text className="text-[20px] text-[#184639] font-medium">
          Today’s menu
        </Styled.Text>
        <Styled.TouchableOpacity>
          <Styled.Text className="text-sm text-[#66B600]">See more</Styled.Text>
        </Styled.TouchableOpacity>
      </Styled.View>

      <FlatList
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{gap: 20, padding: 20}}
        horizontal
        data={arr}
        renderItem={item => <MenuItem item={item} />}
      />
    </>
  );
};

export default TodaysMenu;
