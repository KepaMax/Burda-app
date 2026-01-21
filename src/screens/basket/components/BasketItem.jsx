import Styled from '@common/StyledComponents';
import {useNavigation} from '@react-navigation/native';
import {Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icons from '@icons/icons';
import {useEffect} from 'react';

const BasketItem = ({item, incrementBasketItemCount, decrementBasketItemCount, removeBasketItem}) => {
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
          removeBasketItem({
            basketItemId: item.id,
          });
        }}
        hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
        className="absolute -right-3 -top-3 p-[6px] bg-white shadow shadow-zinc-300 rounded-[8px]">
        <Icons.X />
      </Styled.TouchableOpacity>

      <Styled.View className="absolute right-4 bottom-2 flex-row items-center gap-2 bg-white rounded-[8px] p-1 z-10">
        <Styled.TouchableOpacity
          onPress={() => {
            if (item.quantity > 1) {
              decrementBasketItemCount({
                basketItemId: item.id,
                itemQuantity: item.quantity,
              });
            }
          }}
          className="w-6 h-6 items-center justify-center rounded-[4px] border-[1px] border-[#66B600]">
          <Icons.ArrowDown />
        </Styled.TouchableOpacity>
        
        <Styled.Text className="text-sm text-[#66B600] font-poppins-semibold  text-center">
          {item.quantity}
        </Styled.Text>
        
        <Styled.TouchableOpacity
          onPress={() => {
            incrementBasketItemCount({
              basketItemId: item.id,
              itemQuantity: item.quantity,
            });
          }}
          className="w-6 h-6 items-center justify-center rounded-[4px] border-[1px] border-[#66B600]">
          <Icons.ArrowUp />
        </Styled.TouchableOpacity>
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

        <Styled.View className="flex-row items-center gap-2">
          {(() => {
            const mealData = item.meal;
            const hasDiscount = mealData?.has_discount;
            
            if (hasDiscount) {
              return (
                <>
                  <Styled.Text
                    className="font-poppins-semibold text-md text-[#BF4E30]"
                    style={{textDecorationLine: 'line-through', textDecorationColor: '#C53030'}}>
                    {mealData?.original_price} ₼
                  </Styled.Text>
                  <Styled.Text
                    className="font-poppins-semibold text-base text-[#42C2E5]"
                    numberOfLines={2}>
                    {mealData?.discounted_price} ₼
                  </Styled.Text>
                </>
              );
            } else {
              return (
        <Styled.Text
          className="font-poppins-semibold text-base text-[#42C2E5]"
          numberOfLines={2}>
                  {mealData?.price} ₼
        </Styled.Text>
              );
            }
          })()}
        </Styled.View>
      </Styled.View>
    </Styled.TouchableOpacity>
  );
};

export default BasketItem;
