import Styled from '@common/StyledComponents';
import {FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';
import InfoPill from './InfoPill';
import {useNavigation} from '@react-navigation/native';

const TopSales = () => {
  const arr = [...new Array(3).keys()];
  const navigation = useNavigation();

  const MenuItem = () => {
    return (
      <Styled.TouchableOpacity
        onPress={() => {
          navigation.navigate('FoodDetails');
        }}
        className="w-[267px] h-[281px] bg-white rounded-[18px] shadow shadow-zinc-300">
        <InfoPill type="new" title="New" />
        <FastImage
          style={{
            borderWidth: 1,
            height: 144,
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
          }}
        />
        <Styled.View className="px-4 py-2.5">
          <Styled.Text
            numberOfLines={1}
            className="text-base font-semibold mt-3">
            Main dish
          </Styled.Text>
          <Styled.Text numberOfLines={2} className="text-xs mt-2">
            Lorem dolor sit fuihewf hjfewufv wegfiuwefg
          </Styled.Text>
          <Styled.Text
            numberOfLines={2}
            className="text-sm text-right mt-3 text-[#42C2E5] font-bold">
            12 AZN
          </Styled.Text>
        </Styled.View>
      </Styled.TouchableOpacity>
    );
  };

  return (
    <>
      <Styled.View className="flex-row justify-between items-center mx-5">
        <Styled.Text className="text-[20px] text-[#184639] font-medium">
          Top sales
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

export default TopSales;
