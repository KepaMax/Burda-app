import Icons from '@icons/icons';
import CustomComponents from '@common/CustomComponents';
import {useTranslation} from 'react-i18next';
import {useState, useEffect} from 'react';
import {FlatList} from 'react-native';
import BasketItem from './components/BasketItem';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import Styled from '@common/StyledComponents';
import {fetchData} from '@utils/fetchData';
import {useMMKVBoolean, useMMKVNumber} from 'react-native-mmkv';
import {API_URL} from '@env';

const Basket = () => {
  const isFocused = useIsFocused();
  const router = useRoute();
  const mealId = router.params?.mealId;
  const {t} = useTranslation();
  const [basketItems, setBasketItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(null);
  const navigation = useNavigation();
  const [basketVisible, setBasketVisible] = useMMKVBoolean('basketVisible');

  const getBasketItems = async () => {
    const result = await fetchData({
      url: `${API_URL}/basket-items/`,
      tokenRequired: true,
    });

    if (result?.success) {
      setBasketItems(result.data.basket_items);
      setTotalPrice(result.data.total_price);
    }
  };

  const setBasketItem = async () => {
    await fetchData({
      url: `${API_URL}/basket-items/`,
      tokenRequired: true,
      method: 'POST',
      body: {meal: mealId},
    });

    getBasketItems();
  };


  const checkForExistingItem = async () => {
    if (basketItems.length) {
      basketItems.map(item => {
        if (item.meal.id === mealId) {
          incrementBasketItemCount({
            basketItemId: item.id,
            itemQuantity: item.quantity,
          });
          return;
        } else {
          setBasketItem({mealId});
        }
      });
    } else {
      setBasketItem({mealId});
    }

    getBasketItems();
    // setBasketItem(null);
  };

  const incrementBasketItemCount = async ({basketItemId, itemQuantity}) => {
    const result = await fetchData({
      url: `${API_URL}/basket-items/${basketItemId}/`,
      tokenRequired: true,
      method: 'PUT',
      body: {
        quantity: itemQuantity + 1,
      },
    });

    getBasketItems();
  };

  const decrementBasketItemCount = async ({basketItemId, itemQuantity}) => {
    const result = await fetchData({
      url: `${API_URL}/basket-items/${basketItemId}/`,
      tokenRequired: true,
      method: 'PUT',
      body: {
        quantity: itemQuantity - 1,
      },
    });

    getBasketItems();
  };

  const removeBasketItem = async ({basketItemId}) => {
    const result = await fetchData({
      url: `${API_URL}/basket-items/${basketItemId}/`,
      tokenRequired: true,
      method: 'DELETE',
    });

    getBasketItems();
  };

  const createOrder = async () => {
    if (basketItems?.length) {
      const transformedData = basketItems.map(item => ({
        quantity: item.quantity,
        meal: item.meal.id,
      }));

      const result = await fetchData({
        url: `${API_URL}/orders/`,
        method: 'POST',
        tokenRequired: true,
        body: {
          items: transformedData,
        },
      });

      if (result?.success) {
        navigation.navigate('Profile', {
          screen: 'PaymentMethods',
          params: {pay: true, orderId: result.data.id},
          navigationScreen: 'Basket',
        });
      } else {
        alert(result.data[0].detail);
      }
    } else {
      alert('Basket is empty');
    }
  };

  useEffect(() => {
    if (isFocused) {
      setBasketVisible(false);
      getBasketItems();
      // mealId && checkForExistingItem();
    }
  }, [isFocused]);

  return (
    <>
      <CustomComponents.Header
        title={t('basket')}
        bgColor="bg-white"
        navigationScreen="HomePage"
      />

      <Styled.View className="flex-1">
        <FlatList
        scrollEnabled
          style={{
            backgroundColor: '#F8F8F8',
          }}
          contentContainerStyle={{
            paddingTop: 10,
          }}
          data={basketItems}
          renderItem={({item}) => (
            <BasketItem
              item={item}
              incrementBasketItemCount={incrementBasketItemCount}
              decrementBasketItemCount={decrementBasketItemCount}
              removeBasketItem={removeBasketItem}
            />
          )}
          ListFooterComponent={() => (
            <CustomComponents.Button
              buttonAction={() => {
                navigation.navigate('FoodMenu', {
                  month: new Date().getMonth() + 1,
                  year: new Date().getFullYear(),
                  date: new Date().getDate(),
                  fullDate: new Date().toISOString().split('T')[0],
                });
              }}
              title={t('addNewProductFromMenu')}
              bgColor="bg-white"
              textColor="text-[#FF8C03]"
              textSize="text-base"
              fontWeight="font-poppins-medium"
              extraBtnStyling="shadow shadow-zinc-300 border-[1px] border-dashed border-[#FF8C03] w-auto justify-center"
              extraTxtStyling="ml-2"
              gap="gap-2"
            />
          )}
          ListFooterComponentStyle={{marginHorizontal: 20, marginTop: 30}}
        />
      </Styled.View>

      <Styled.View className="bg-[#F8F8F8] p-5 pt-0">
        <Styled.View className="flex-row justify-between items-center mb-5 border-t-[1px] border-zinc-200 pt-4">
          <Styled.Text className="text-black text-[18px] font-poppins-semibold">
            {t('totalPrice')}:
          </Styled.Text>
          <Styled.Text className="text-[#42C2E5] text-[20px] font-poppins-semibold">
            {totalPrice} AZN
          </Styled.Text>
        </Styled.View>

        <CustomComponents.Button
          title={t('proceedToPayment')}
          bgColor="bg-[#66B600]"
          borderRadius="rounded-[24px]"
          padding="p-[10px]"
          textColor="text-white"
          textSize="text-lg"
          buttonAction={createOrder}
        />
      </Styled.View>
    </>
  );
};

export default Basket;
