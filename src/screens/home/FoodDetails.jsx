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

const FoodDetails = () => {
  const route = useRoute();
  const item = route.params?.item;
  const navigationScreen = route.params?.navigationScreen;
  const source = route.params?.source;
  const navigation = useNavigation();
  const {t} = useTranslation();

  const incrementBasketItemCount = async ({basketItemId, itemQuantity}) => {
    await fetchData({
      url: `${API_URL}/basket-items/${basketItemId}/`,
      tokenRequired: true,
      method: 'PATCH',
      body: {
        quantity: itemQuantity + 1,
      },
    });
  };

  const setBasketItem = async mealId => {
    await fetchData({
      url: `${API_URL}/basket-items/`,
      tokenRequired: true,
      method: 'POST',
      body: {meal: mealId},
    });
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

  const checkForExistingItem = async (mealId, basketItems) => {
    if (basketItems.length) {
      const existingItem = basketItems.find(item => item.meal.id === mealId);
      if (existingItem) {
        await incrementBasketItemCount({
          basketItemId: existingItem.id,
          itemQuantity: existingItem.quantity,
        });
      } else {
        await setBasketItem(mealId);
      }
    } else {
      await setBasketItem(mealId);
    }
  };

  const addToBasket = async () => {
    const mealId = item?.meal?.id ? item?.meal?.id : item.id;
    const basketItems = await getBasketItems();
    await checkForExistingItem(mealId, basketItems);
    navigation.navigate('Home', {
      screen: 'Basket',
    });
  };

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
      <FoodProperties item={item} navigationScreen={navigationScreen} />

      <Ingredients
        ingredients={
          item?.meal?.ingredients ? item?.meal?.ingredients : item.ingredients
        }
      />

      <CustomComponents.Button
        title={
          navigationScreen === 'Basket' 
            ? t('returnToBasket') 
            : source === 'WeeklyMenu' 
              ? t('addToBasket') 
              : t('goBack')
        }
        padding="py-3"
        margin="mx-5 my-5"
        borderRadius="rounded-[24px]"
        bgColor="bg-[#66B600]"
        buttonAction={() => {
          if (navigationScreen === 'Basket') {
            navigation.goBack();
          } else if (source === 'WeeklyMenu') {
            addToBasket();
          } else {
            navigation.goBack();
          }
        }}
      />
    </Styled.ScrollView>
  );
};

export default FoodDetails;
