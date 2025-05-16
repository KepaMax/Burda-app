import Styled from '@common/StyledComponents';
import {useTranslation} from 'react-i18next';
import {fetchData} from '@utils/fetchData';
import {useEffect, useState} from 'react';
import {parseISO, format} from 'date-fns';
import {FlatList} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {API_URL} from '@env';
import CustomComponents from '@common/CustomComponents';
import ReceiptIcon from '@icons/receipt.svg';

const PaymentHistory = () => {
  const isFocused = useIsFocused();
  const [paymentHistory, setPaymentHistory] = useState([]);
  const {t} = useTranslation();
  const navigation = useNavigation();

  const HistoryItem = ({item}) => {
    const date = item.created_at
      ? format(parseISO(item.paid_at), 'HH:mm')
      : null;
    console.log(item);

    return (
      <Styled.TouchableOpacity
        onPress={() => {
          navigation.navigate('Receipt', {
            id: item.id,
          });
        }}
        className="px-[10px] mx-5 border-b-[1px] border-zinc-200">
        <Styled.View>
          <Styled.View className="flex-row justify-between mb-2 items-center">
            <Styled.Text className="text-black font-poppins font-bold text-lg">
              {item.company.name}
            </Styled.Text>
            <Styled.Text className="text-[#42C2E5] font-poppins-medium text-lg">
              {item.transaction.amount} AZN
            </Styled.Text>
          </Styled.View>
        </Styled.View>
        <Styled.View className="flex-row justify-between items-center">
          <Styled.Text className="text-black font-poppins text-lg">
            {format(parseISO(item.order.created_at), 'dd/MM/yyyy')}
          </Styled.Text>

          <ReceiptIcon />
        </Styled.View>

        <Styled.View className="flex-row justify-between">
          <Styled.Text className="text-sm text-[#909090] font-poppins">
            {date && date}
          </Styled.Text>
          <Styled.Text className="text-sm text-[#909090] font-poppins">
            {item.invoice_uuid}
          </Styled.Text>
        </Styled.View>
      </Styled.TouchableOpacity>
    );
  };

  const getPaymentHistory = async () => {
    const result = await fetchData({
      url: `${API_URL}/histories/`,
      tokenRequired: true,
    });

    console.log(result.data.results);

    result?.success && setPaymentHistory(result.data.results);
  };

  useEffect(() => {
    isFocused && getPaymentHistory();
  }, [isFocused]);

  return (
    <>
      <CustomComponents.Header title={t('myTransactions')} bgColor="bg-white" />
      <Styled.View className="mt-4">
        {!paymentHistory.length ? (
          <Styled.View className="bg-[#F7F8F9] rounded-[8px] py-6 items-center mx-5">
            <Styled.Text className="text-[#32343E] text-base font-poppins-semibold">
              {t('noInfo')}
            </Styled.Text>
          </Styled.View>
        ) : (
          <FlatList
            scrollEnabled={false}
            keyExtractor={item => item.id}
            data={paymentHistory}
            renderItem={({item}) => <HistoryItem item={item} />}
          />
        )}
      </Styled.View>
    </>
  );
};

export default PaymentHistory;
