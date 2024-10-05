import Styled from '@common/StyledComponents';
import CustomComponents from '@common/CustomComponents';
import {useTranslation} from 'react-i18next';
import NoCardAdded from './components/NoCardAdded';
import PaymentHistory from './components/PaymentHistory';
import {fetchData} from '@utils/fetchData';
import {useEffect, useState} from 'react';
import storage from '@utils/MMKVStore';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {FlatList} from 'react-native';
import Icons from '@icons/icons';
import {
  getPaymentMethods,
  addNewPaymentMethod,
  deletePaymentMethod,
} from './utils/paymentMethodUtils';

const PaymentMethods = () => {
  const pay = useRoute().params?.pay;
  const orderId = useRoute().params?.orderId;
  const isFocused = useIsFocused();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const navigation = useNavigation();
  const {t} = useTranslation();

  const handlePayment = async () => {
    if (selectPaymentMethod) {
      const result = await fetchData({
        url: `https://api.myburda.com/api/v4/orders/${orderId}/pay/`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${storage.getString('accessToken')}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: {
          payment_method: selectPaymentMethod,
        },
      });
    } else {
      alert('Please choose a payment method first');
    }
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
    isFocused && getPaymentMethods({setPaymentMethods});
  }, [isFocused]);

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
          title={`+ ${t('addNewCard')}`}
          textColor="text-[#FF8C03]"
          textSize="text-[20px]"
          fontWeight="font-poppins-semibold"
          margin="mx-5 mt-1"
          linkAction={() => {
            addNewPaymentMethod({t, navigation});
          }}
        />

        {!pay && <PaymentHistory />}

        {pay && (
          <CustomComponents.Button
            title={t('confirm')}
            bgColor="bg-[#66B600]"
            padding="py-3"
            margin="mx-5 mt-10"
            borderRadius="rounded-[24px]"
            buttonAction={handlePayment}
          />
          // <Styled.TouchableOpacity onPress={handlePayment}>
          //   <Styled.Text>{t('confirm')}</Styled.Text>
          // </Styled.TouchableOpacity>
        )}
      </Styled.ScrollView>
    </>
  );
};

export default PaymentMethods;
