import {fetchData} from '@utils/fetchData';
import storage from '@utils/MMKVStore';

export const getPaymentMethods = async ({setPaymentMethods}) => {
  const result = await fetchData({
    url: 'https://api.myburda.com/api/v4/payment-methods/',
    headers: {
      Authorization: `Bearer ${storage.getString('accessToken')}`,
      Accept: 'application/json',
    },
  });

  result?.success && setPaymentMethods(result.data.results);
};

export const addNewPaymentMethod = async ({t, navigation}) => {
  const result = await fetchData({
    url: 'https://api.myburda.com/api/v4/payment-methods/',
    headers: {
      Authorization: `Bearer ${storage.getString('accessToken')}`,
    },
    method: 'POST',
  });

  result?.success &&
    navigation.navigate('WebViewScreen', {
      url: result.data.payment_url,
      title: t('addCard'),
    });
};

export const deletePaymentMethod = async ({
  t,
  paymentMethodId,
  setPaymentMethods,
}) => {
  const result = await fetchData({
    url: `https://api.myburda.com/api/v4/payment-methods/${paymentMethodId}/`,
    headers: {
      Authorization: `Bearer ${storage.getString('accessToken')}`,
      Accept: 'application/json',
    },
    method: 'DELETE',
    returnsData: false,
  });

  result?.success && alert(t('paymentMethodDeleted'));

  getPaymentMethods({setPaymentMethods});
};
