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
import PaymentSuccessModal from '../profile/paymentMethods/components/PaymentSuccessModal';
import PaymentFailureModal from '../profile/paymentMethods/components/PaymentFailureModal';

const Basket = () => {
  const isFocused = useIsFocused();
  const router = useRoute();
  const mealId = router.params?.mealId;
  const {t} = useTranslation();
  const [basketItems, setBasketItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(null);
  const navigation = useNavigation();
  const [basketVisible, setBasketVisible] = useMMKVBoolean('basketVisible');
  const [basketUpdateTrigger, setBasketUpdateTrigger] = useMMKVNumber('basketUpdateTrigger');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const triggerBasketUpdate = () => {
    setBasketUpdateTrigger((basketUpdateTrigger || 0) + 1);
  };

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
    // Bugünün tarihini YYYY-MM-DD formatında al
    const menuDate = new Date().toISOString().split('T')[0];
    await fetchData({
      url: `${API_URL}/basket-items/`,
      tokenRequired: true,
      method: 'POST',
      body: {
        meal: mealId,
        quantity: 1,
        menu_date: menuDate,
      },
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

    if (result?.success) {
      getBasketItems();
      triggerBasketUpdate();
    }
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

    if (result?.success) {
      getBasketItems();
      triggerBasketUpdate();
    }
  };

  const removeBasketItem = async ({basketItemId}) => {
    const result = await fetchData({
      url: `${API_URL}/basket-items/${basketItemId}/`,
      tokenRequired: true,
      method: 'DELETE',
    });

    if (result?.success) {
      getBasketItems();
      triggerBasketUpdate();
    }
  };

  const getPaymentMethods = async () => {
    const result = await fetchData({
      url: `${API_URL}/payment-methods/`,
      tokenRequired: true,
    });
    return result?.success ? result.data.results : [];
  };

  const payWithCard = async (orderId, paymentMethodId) => {
    const result = await fetchData({
      url: `${API_URL}/orders/${orderId}/pay/`,
      method: 'POST',
      tokenRequired: true,
      body: {
        payment_method: paymentMethodId,
      },
    });

    if (result?.success) {
      if (result.data.status === 'APPROVED') {
        setShowSuccessModal(true);
        triggerBasketUpdate();
      } else {
        setShowFailureModal(true);
      }
    } else {
      setShowFailureModal(true);
    }
  };

  const createOrder = async () => {
    if (basketItems?.length) {
      setIsProcessing(true);
      
      // Basket items'ı menu_date'e göre grupla
      const groupedByDate = basketItems.reduce((acc, item) => {
        const date = item.menu_date || 'no_date';
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(item);
        return acc;
      }, {});

      // Her menu_date için ayrı order oluştur
      const orderPromises = Object.entries(groupedByDate).map(async ([menuDate, items]) => {
        const transformedData = items.map(item => ({
          quantity: item.quantity,
          meal: item.meal.id,
        }));

        return await fetchData({
          url: `${API_URL}/orders/`,
          method: 'POST',
          tokenRequired: true,
          body: {
            items: transformedData,
            ...(menuDate !== 'no_date' && { menu_date: menuDate }),
          },
        });
      });

      // Tüm orderları bekle
      const results = await Promise.all(orderPromises);
      // Tüm orderlar başarılı mı kontrol et
      const allSuccessful = results.every(result => result?.success);
      
      if (allSuccessful) {
        // İlk order'ın ID'sini al (ödeme için)
        const firstOrderId = results[0].data.id;
        
        // Her zaman kart seçme ekranına git
        navigation.navigate('Profile', {
          screen: 'PaymentMethods',
          params: {
            pay: true, 
            orderId: firstOrderId,
            multipleOrders: results.length > 1,
            orderIds: results.map(r => r.data.id),
          },
          navigationScreen: 'Basket',
        });
      } else {
        const failedResult = results.find(r => !r?.success);
        alert(failedResult?.data?.[0]?.detail || t('somethingWentWrong'));
      }
      
      setIsProcessing(false);
    } else {
      alert(t('basketIsEmpty'));
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigation.navigate('HomePage');
  };

  const handleSuccessGoToTransactions = () => {
    setShowSuccessModal(false);
    navigation.navigate('Profile', {
      screen: 'PaymentHistory',
    });
  };

  const handleFailureClose = () => {
    setShowFailureModal(false);
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
            {totalPrice} ₼
          </Styled.Text>
        </Styled.View>

        <CustomComponents.Button
          title={isProcessing ? t('processing') : t('proceedToPayment')}
          bgColor={isProcessing ? 'bg-gray-400' : 'bg-[#66B600]'}
          borderRadius="rounded-[24px]"
          padding="p-[10px]"
          textColor="text-white"
          textSize="text-lg"
          buttonAction={createOrder}
          disabled={isProcessing}
        />
      </Styled.View>

      {/* Payment Success Modal */}
      <PaymentSuccessModal
        visible={showSuccessModal}
        onClose={handleSuccessClose}
        onGoToTransactions={handleSuccessGoToTransactions}
      />

      {/* Payment Failure Modal */}
      <PaymentFailureModal
        visible={showFailureModal}
        onClose={handleFailureClose}
      />
    </>
  );
};

export default Basket;
