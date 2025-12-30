import Styled from '@common/StyledComponents';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import InfoPill from './InfoPill';

const FoodItem = ({item, showCount, source}) => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const screenWidth = Dimensions.get('screen').width;

  return (
    <Styled.TouchableOpacity
      onPress={() => {
        navigation.navigate('FoodDetails', {
          item: item, // Tüm item objesini gönder (quantity meal_item seviyesinde)
          source: source,
        });
      }}
      style={{width: screenWidth - 40}}
      className="mx-auto h-[140px] flex-row justify-between bg-white my-2 shadow shadow-zinc-300 rounded-[18px]">
      {item?.meal?.new || item?.new ? (
        <InfoPill type="new" customPosition="absolute left-2 top-2" />
      ) : null}
      <FastImage
        source={{
          uri: item.meal ? item?.meal?.thumbnail : item.thumbnail,
        }}
        style={{
          borderTopLeftRadius: 18,
          borderBottomLeftRadius: 18,
          width: 140,
          height: 140,
        }}
      />

      <Styled.View
        style={{width: screenWidth - 180}}
        className="h-full px-[14px] py-[16px] justify-around">
        <Styled.View>
          <Styled.Text
            className="font-poppins-semibold text-base text-black mb-2"
            numberOfLines={1}>
            {item.meal ? item?.meal?.name : item.name}
          </Styled.Text>

          <Styled.Text
            className="font-poppins text-sm text-black"
            numberOfLines={2}>
            {item.meal ? item?.meal?.description : item.description}
          </Styled.Text>
        </Styled.View>
        {(item?.meal?.calories || item.calories) && (
          <Styled.Text>{item?.meal?.calories || item.calories} kkal</Styled.Text>
        )}
        {(item?.meal?.weight || item.weight) && (
          <Styled.Text>{item?.meal?.weight || item.weight} g</Styled.Text>
        )}

        <Styled.View className="flex-row justify-between items-center">
           {showCount && (item?.quantity != null || item?.meal?.quantity != null) && (         
               <Styled.Text className="text-[#FF8C03] text-xs font-poppins-semibold">
                 {item?.quantity ?? item?.meal?.quantity} ədəd qaldı
               </Styled.Text>
           )}
          <Styled.Text
            className="font-poppins-bold text-base text-[#42C2E5]"
            numberOfLines={2}>
            {item.meal ? item?.meal?.price : item.price} AZN
          </Styled.Text>
        </Styled.View>
      </Styled.View>
    </Styled.TouchableOpacity>
  );
};

export default FoodItem;
