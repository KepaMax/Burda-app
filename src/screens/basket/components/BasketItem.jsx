import Styled from '@common/StyledComponents';
import {useNavigation} from '@react-navigation/native';
import {Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icons from '@icons/icons';
import {useEffect} from 'react';

const BasketItem = ({item, decrementBasketItemCount}) => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('screen').width;

  return (
    <Styled.TouchableOpacity
      onPress={() => {
        navigation.navigate('FoodDetails', {
          item: item,
          navigationScreen: 'Basket',
        });
      }}
      style={{width: screenWidth - 40}}
      className="mx-auto h-[115px] flex-row justify-between bg-white my-2 shadow shadow-zinc-300 rounded-[8px]">
      <Styled.TouchableOpacity
        onPress={() => {
          decrementBasketItemCount({
            basketItemId: item.id,
            itemQuantity: item.quantity,
          });
        }}
        hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
        className="absolute -right-3 -top-3 p-[6px] bg-white shadow shadow-zinc-300 rounded-[8px]">
        <Icons.X />
      </Styled.TouchableOpacity>

      <Styled.View className="absolute right-4 top-3 h-[25px] w-[25px] items-center justify-center border-[1px] border-[#66B600] rounded-[8px] bg-white z-10">
        <Styled.Text className="text-xs text-[#66B600] font-poppins-semibold">
          {item.quantity}x
        </Styled.Text>
      </Styled.View>

      <FastImage
        source={{
          uri: item.meal.thumbnail,
        }}
        style={{
          borderRadius: 8,
          width: 95,
          height: 95,
          margin: 10,
          marginRight: 0,
        }}
      />

      <Styled.View
        style={{width: screenWidth - 140}}
        className="h-full px-[14px] py-[16px] justify-between">
        <Styled.Text
          className="font-poppins-semibold text-base text-black mb-1 w-[90%]"
          numberOfLines={1}>
          {item.meal.name}
        </Styled.Text>

        <Styled.View className="flex-row gap-1 mb-2">
          {item.meal.weight && (
            <Styled.View className="w-fit bg-white px-[6px] py-[4px] rounded-[8px] shadow shadow-zinc-300">
              <Styled.Text className="text-[#66B600] text-sm font-poppins">
                {item.meal.weight} g
              </Styled.Text>
            </Styled.View>
          )}

          {item.meal.calories && (
            <Styled.View className="w-fit bg-white px-[6px] py-[4px] rounded-[8px] shadow shadow-zinc-300">
              <Styled.Text className="text-[#184639] text-sm font-poppins">
                {item.meal.calories} kkal
              </Styled.Text>
            </Styled.View>
          )}
        </Styled.View>

        <Styled.Text
          className="font-poppins-semibold text-base text-[#42C2E5]"
          numberOfLines={2}>
          {item.meal.price} AZN
        </Styled.Text>
      </Styled.View>
    </Styled.TouchableOpacity>
  );
};

export default BasketItem;
