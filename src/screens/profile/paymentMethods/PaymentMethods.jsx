import Styled from '@common/StyledComponents';
import CustomComponents from '@common/CustomComponents';
import {useTranslation} from 'react-i18next';
import NoCardAdded from './components/NoCardAdded';
import PaymentHistory from './PaymentHistory';
import PaymentSuccessModal from './components/PaymentSuccessModal';
import PaymentFailureModal from './components/PaymentFailureModal';
import {fetchData} from '@utils/fetchData';
import {useEffect, useState, useCallback} from 'react';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {FlatList} from 'react-native';
import Icons from '@icons/icons';
import {
  getPaymentMethods,
  addNewPaymentMethod,
  deletePaymentMethod,
} from './utils/paymentMethodUtils';
import {API_URL} from '@env';
import {useMMKVNumber} from 'react-native-mmkv';

const PaymentMethods = () => {
  const pay = useRoute().params?.pay;
  const orderId = useRoute().params?.orderId;
  const isFocused = useIsFocused();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [basketUpdateTrigger, setBasketUpdateTrigger] = useMMKVNumber('basketUpdateTrigger');

  const triggerBasketUpdate = useCallback(() => {
    setBasketUpdateTrigger((basketUpdateTrigger || 0) + 1);
  }, [basketUpdateTrigger, setBasketUpdateTrigger]);

  const handlePayment = useCallback(async (paymentMethodId = null) => {
    // Eğer paymentMethodId bir object ise (event objesi olabilir), ignore et
    const methodId = (typeof paymentMethodId === 'number' ? paymentMethodId : null) || selectPaymentMethod;
    
    if (methodId && orderId) {
      setIsProcessing(true);
      const result = await fetchData({
        url: `${API_URL}/orders/${orderId}/pay/`,
        method: 'POST',
        tokenRequired: true,
        body: {
          payment_method: methodId,
        },
      });
      console.log(result);
      if (result.success) {
        if (result.data.status === 'APPROVED') {
          setShowSuccessModal(true);
          triggerBasketUpdate();
        } else {
          setShowFailureModal(true);
        }
      } else {
        setShowFailureModal(true);
      }
      setIsProcessing(false);
    } else {
      if (!methodId) {
        alert(t('choosePaymentMethod'));
      }
    }
  }, [selectPaymentMethod, orderId, t, triggerBasketUpdate]);

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

  const PaymentItem = ({item}) => {
    return (
      <Styled.TouchableOpacity
        onPress={() => {
          setSelectedPaymentMethod(item.id);
        }}
        disabled={!pay}
        className={`bg-[#F4F5F7] p-4 mx-5 my-2 rounded-[8px] flex-row items-center justify-between border-[2px] ${
          selectPaymentMethod === item.id
            ? 'border-[#FF8C03]'
            : 'border-[#F4F5F7]'
        }`}>
        <Styled.Text
          numberOfLines={1}
          className="text-lg text-[#32343E] font-poppins">
          {item.masked_pan}
        </Styled.Text>

        {!pay && (
          <Styled.TouchableOpacity
            onPress={() =>
              deletePaymentMethod({
                t,
                paymentMethodId: item.id,
                setPaymentMethods,
              })
            }
            className="bg-white shadow shadow-zinc-300 rounded-full w-[32px] h-[32px] items-center justify-center">
            <Icons.DeleteAccount />
          </Styled.TouchableOpacity>
        )}
      </Styled.TouchableOpacity>
    );
  };

  useEffect(() => {
    if (isFocused) {
      getPaymentMethods({setPaymentMethods});
    }
  }, [isFocused]);

  // Otomatik kart seçimi: Eğer pay true ise ve 1 kart varsa otomatik olarak seç
  useEffect(() => {
    if (pay && paymentMethods.length === 1 && !selectPaymentMethod) {
      setSelectedPaymentMethod(paymentMethods[0].id);
    }
  }, [pay, paymentMethods, selectPaymentMethod]);

  return (
    <>
      <CustomComponents.Header
        title={t(pay ? 'selectPaymentMethod' : 'paymentMethods')}
        bgColor="bg-white"
      />

      <Styled.ScrollView className="bg-white h-full">
        <Styled.Text className="text-[#414141] text-[20px] font-poppins-semibold mx-5 mt-5 mb-1">
          {t('myCards')}
        </Styled.Text>

        {!paymentMethods.length ? (
          <NoCardAdded />
        ) : (
          <FlatList
            scrollEnabled={false}
            keyExtractor={item => item.id}
            data={paymentMethods}
            renderItem={({item}) => <PaymentItem item={item} />}
          />
        )}

        <CustomComponents.Link
          title={!paymentMethods.length ? `+ ${t('addCard')}` : `+ ${t('addNewCard')}`}
          textColor="text-[#FF8C03]"
          textSize="text-[20px]"
          fontWeight="font-poppins-semibold"
          margin="mx-5 mt-1"
          linkAction={() => {
            addNewPaymentMethod({t, navigation});
          }}
        />



        {pay && paymentMethods.length > 0 && selectPaymentMethod && (
          <CustomComponents.Button
            title={isProcessing ? t('processing') : t('confirmPayment')}
            bgColor={isProcessing ? 'bg-gray-400' : 'bg-[#66B600]'}
            padding="py-3"
            margin="mx-5 mt-10"
            borderRadius="rounded-[24px]"
            buttonAction={() => handlePayment()}
            disabled={isProcessing}
          />
        )}
      </Styled.ScrollView>

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

export default PaymentMethods;
