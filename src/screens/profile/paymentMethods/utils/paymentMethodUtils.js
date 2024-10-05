import {fetchData} from '@utils/fetchData';

export const getPaymentMethods = async ({setPaymentMethods}) => {
  const result = await fetchData({
    url: 'https://api.myburda.com/api/v4/payment-methods/',
    tokenRequired: true,
  });

  result?.success && setPaymentMethods(result.data.results);
};

export const addNewPaymentMethod = async ({t, navigation}) => {
  const result = await fetchData({
    url: 'https://api.myburda.com/api/v4/payment-methods/',
    tokenRequired: true,
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
    tokenRequired: true,
    method: 'DELETE',
    returnsData: false,
  });

  result?.success && alert(t('paymentMethodDeleted'));

  getPaymentMethods({setPaymentMethods});
};
