import Styled from '@common/StyledComponents';
import Images from '@images/images.js';
import CustomComponents from '@common/CustomComponents';
import FoodProperties from './components/FoodProperties';
import Ingredients from './components/Ingredients';
import {useNavigation, useRoute} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {useTranslation} from 'react-i18next';
import {useEffect} from 'react';
import {fetchData} from '@utils/fetchData';
import {API_URL} from '@env';
import {useMMKVNumber} from 'react-native-mmkv';

const FoodDetails = () => {
  const route = useRoute();
  const item = route.params?.item;
  const navigationScreen = route.params?.navigationScreen;
  const source = route.params?.source;
  const menuDateFromParams = route.params?.menuDate;
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [basketUpdateTrigger, setBasketUpdateTrigger] = useMMKVNumber('basketUpdateTrigger');

  const triggerBasketUpdate = () => {
    setBasketUpdateTrigger((basketUpdateTrigger || 0) + 1);
  };

  const incrementBasketItemCount = async ({basketItemId, itemQuantity}) => {
    const result = await fetchData({
      url: `${API_URL}/basket-items/${basketItemId}/`,
      tokenRequired: true,
      method: 'PATCH',
      body: {
        quantity: itemQuantity + 1,
      },
    });
    return result?.success || false;
  };

  const setBasketItem = async (mealId, menuDate) => {
    const result = await fetchData({
      url: `${API_URL}/basket-items/`,
      tokenRequired: true,
      method: 'POST',
      body: {
        meal: mealId,
        quantity: 1,
        menu_date: menuDate,
      },
    });
    console.log(result);
    return result?.success || false;
  };

  const getBasketItems = async () => {
    const result = await fetchData({
      url: `${API_URL}/basket-items/`,
      tokenRequired: true,
    });

    if (result?.success) {
      return result?.data?.basket_items;
    } else {
      return [];
    }
  };

  const checkForExistingItem = async (mealId, basketItems, menuDate) => {
    if (basketItems.length) {
      const existingItem = basketItems.find(item => item.meal.id === mealId);
      if (existingItem) {
        return await incrementBasketItemCount({
          basketItemId: existingItem.id,
          itemQuantity: existingItem.quantity,
        });
      } else {
        return await setBasketItem(mealId, menuDate);
      }
    } else {
      return await setBasketItem(mealId, menuDate);
    }
  };

  const addToBasket = async () => {
    const mealId = item?.meal?.id ? item?.meal?.id : item.id;
    // menu_date'i önce params'tan, sonra item'dan al, yoksa bugünün tarihini kullan
    const menuDate = menuDateFromParams || item?.menu_date || item?.meal?.menu_date || new Date().toISOString().split('T')[0];
    const basketItems = await getBasketItems();
    const success = await checkForExistingItem(mealId, basketItems, menuDate);
    
    if (success) {
      triggerBasketUpdate();
      navigation.navigate('Home', {
        screen: 'Basket',
      });
    } else {
      // Hata durumunda kullanıcıya bilgi ver
      alert(t('somethingWentWrong'));
    }
  };

  // Quantity kontrolü - meal_item seviyesinde veya meal seviyesinde olabilir
  const quantity = item?.quantity != null ? item.quantity : (item?.meal?.quantity != null ? item.meal.quantity : null);
  const isOutOfStock = quantity === 0;
  return (
    <Styled.ScrollView>
      <CustomComponents.Header
        overlay={true}
        title={item?.meal?.name ? item?.meal?.name : item.name}
        titleColor="text-white"
        {...(navigationScreen ? {navigationScreen: navigationScreen} : {})}
      />
      <Images.FoodDetailsHeader />
      <Styled.View className="w-full absolute items-center top-[140px]">
        <FastImage
          style={{width: 200, height: 200, borderRadius: 100}}
          source={{
            uri: item?.meal?.thumbnail ? item?.meal?.thumbnail : item.thumbnail,
          }}
        />
      </Styled.View>
      <FoodProperties item={item.meal ? item.meal : item} navigationScreen={navigationScreen} />

      <Ingredients
        ingredients={
          item?.meal?.ingredients ? item?.meal?.ingredients : item.ingredients
        }
      />

      <CustomComponents.Button
        title={
          isOutOfStock
            ? t('outOfStock')
            : navigationScreen === 'Basket' 
            ? t('returnToBasket') 
            : source === 'WeeklyMenu' 
              ? t('addToBasket') 
              : t('goBack')
        }
        padding="py-3"
        margin="mx-5 my-5"
        borderRadius="rounded-[24px]"
        bgColor={isOutOfStock ? 'bg-gray-400' : 'bg-[#66B600]'}
        buttonAction={() => {
          if (isOutOfStock) {
            return; // Disabled durumda hiçbir şey yapma
          }
          if (navigationScreen === 'Basket') {
            navigation.goBack();
          } else if (source === 'WeeklyMenu') {
            addToBasket();
          } else {
            navigation.goBack();
          }
        }}
        disabled={isOutOfStock}
      />
    </Styled.ScrollView>
  );
};

export default FoodDetails;
