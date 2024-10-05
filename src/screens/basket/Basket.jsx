import Icons from '@icons/icons';
import CustomComponents from '@common/CustomComponents';
import {useTranslation} from 'react-i18next';
import {useState, useEffect} from 'react';
import {FlatList} from 'react-native';
import BasketItem from './components/BasketItem';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import Styled from '@common/StyledComponents';
import {fetchData} from '@utils/fetchData';
import storage from '@utils/MMKVStore';

const Basket = () => {
  const isFocused = useIsFocused();
  const router = useRoute();
  const [mealId, setMealId] = useState(null);
  const {t} = useTranslation();
  const [basketItems, setBasketItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(null);
  const navigation = useNavigation();

  const getBasketItems = async () => {
    const result = await fetchData({
      url: 'https://api.myburda.com/api/v1/basket-items/',
      headers: {
        Authorization: `Bearer ${storage.getString('accessToken')}`,
        Accept: 'application/json',
      },
    });

    if (result?.success) {
      setBasketItems(result.data.basket_items);
      setTotalPrice(result.data.total_price);
    }
  };

  const setBasketItem = async () => {
    const result = await fetchData({
      url: `https://api.myburda.com/api/v1/basket-items/`,
      headers: {
        Authorization: `Bearer ${storage.getString('accessToken')}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: {meal: mealId},
    });

    // result?.success ? console.log(result?.data) : console.log(result?.error);

    getBasketItems();
  };

  const incrementBasketItemCount = async ({basketItemId, itemQuantity}) => {
    const result = await fetchData({
      url: `https://api.myburda.com/api/v1/basket-items/${basketItemId}/`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${storage.getString('accessToken')}`,
      },
      method: 'PUT',
      body: {
        quantity: itemQuantity + 1,
      },
    });

    // result?.success
    //   ? console.log(JSON.stringify(result?.data))
    //   : console.log(JSON.stringify(result?.error));

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
        } else {
          setBasketItem({mealId});
        }
      });
    } else {
      setBasketItem({mealId});
    }

    getBasketItems();
    setMealId(null);
  };

  const decrementBasketItemCount = async ({basketItemId, itemQuantity}) => {
    const result = await fetchData({
      url: `https://api.myburda.com/api/v1/basket-items/${basketItemId}/`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${storage.getString('accessToken')}`,
      },
      method: 'PUT',
      body: {
        quantity: itemQuantity - 1,
      },
    });

    // result?.success
    //   ? console.log(JSON.stringify(result?.data))
    //   : console.log(JSON.stringify(result?.error));

    getBasketItems();
  };

  const createOrder = async () => {
    const transformedData = basketItems.map(item => ({
      quantity: item.quantity,
      meal: item.meal.id,
    }));

    const result = await fetchData({
      url: 'https://api.myburda.com/api/v4/orders/',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${storage.getString('accessToken')}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: {
        items: transformedData,
      },
    });

    // console.log(result);

    result?.success &&
      navigation.navigate('Profile', {
        screen: 'PaymentMethods',
        params: {pay: true, orderId: result.data.id},
      });
  };

  useEffect(() => {
    setMealId(router.params?.mealId);
    getBasketItems();
  }, [router.params]);

  useEffect(() => {
    isFocused && mealId && checkForExistingItem();
  }, [isFocused]);

  return (
    <>
      <CustomComponents.Header
        navigationScreen={'Scan'}
        title={t('basket')}
        bgColor="bg-white"
      />

      <FlatList
        style={{
          backgroundColor: '#F8F8F8',
        }}
        contentContainerStyle={{
          flex: 1,
          paddingTop: 10,
        }}
        data={basketItems}
        renderItem={({item}) => (
          <BasketItem
            item={item}
            decrementBasketItemCount={decrementBasketItemCount}
          />
        )}
        ListFooterComponent={() => (
          <CustomComponents.Button
            buttonAction={() => {
              navigation.navigate('Scan');
            }}
            title={t('addNewProduct')}
            bgColor="bg-white"
            textColor="text-[#FF8C03]"
            textSize="text-base"
            fontWeight="font-poppins-medium"
            extraBtnStyling="shadow shadow-zinc-300 border-[1px] border-dashed border-[#FF8C03] w-auto justify-center"
            extraTxtStyling="ml-2"
            icon={<Icons.Barcode />}
            gap="gap-2"
          />
        )}
        ListFooterComponentStyle={{marginHorizontal: 20, marginTop: 30}}
      />

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
          title={t('confirm')}
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
