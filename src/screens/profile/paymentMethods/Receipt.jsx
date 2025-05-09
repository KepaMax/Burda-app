import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import CustomComponents from '../../../common/CustomComponents';
import {useTranslation} from 'react-i18next';
import {useRoute} from '@react-navigation/native';
import {fetchData} from '@utils/fetchData';
import {format} from 'date-fns';
import {az} from 'date-fns/locale'; // Added locale for Azerbaijani
import {API_URL} from '@env';

export default function Receipt() {
  const {t} = useTranslation();
  const route = useRoute();
  const {id} = route.params;
  const [loading, setLoading] = useState(true);
  const [receiptData, setReceiptData] = useState(null);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const result = await fetchData({
          url: `${API_URL}/histories/${id}/`,
          tokenRequired: true,
        });
        console.log(result.data.order);
        result.success && setReceiptData(result.data);
      } catch (error) {
        console.error('Error fetching receipt:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [id]);

  if (loading) {
    return (
      <>
        <CustomComponents.Header title={t('transaction')} bgColor="bg-white" />
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </>
    );
  }

  if (!receiptData) {
    return (
      <>
        <CustomComponents.Header title={t('transaction')} bgColor="bg-white" />
        <View style={styles.loaderContainer}>
          <Text>Something went wrong.</Text>
        </View>
      </>
    );
  }

  const userFullName = `${receiptData.user.first_name} ${receiptData.user.last_name}`;
  const masked_pan = receiptData.method.masked_pan;
  const createdAt = receiptData.order.created_at;
  const items = receiptData.order.items || []; // Optional chaining
  const totalAmount = receiptData.transaction.amount;

  return (
    <>
      <CustomComponents.Header title={t('transaction')} bgColor="bg-white" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>BURDA</Text>

        <Text style={[styles.cell, {flex: 2}]}>Owner: {userFullName}</Text>
        <Text style={styles.info}>
          Tarix:{' '}
          {format(new Date(createdAt), 'd MMMM yyyy HH:mm', {locale: az})}
        </Text>

        <View style={styles.separator} />

        {/* Table Header */}
        <View style={styles.row}>
          <Text style={[styles.cell, {flex: 2}]}>{t('name')}</Text>
          <Text style={[styles.cell, {flex: 1}]}>{t('quantity')}</Text>
          <Text style={[styles.cell, {flex: 1}]}>{t('price')}</Text>
          <Text style={[styles.cell, {flex: 1}]}>{t('subtotal')}</Text>
        </View>

        {/* Items */}
        {items.length > 0 ? (
          items.map((item, index) => (
            <View style={styles.row} key={index}>
              <Text style={[styles.cell, {flex: 2}]}>
                {item.meal.name || 'Unknown'}
              </Text>
              <Text style={[styles.cell, {flex: 1}]}>{item.quantity}</Text>
              <Text style={[styles.cell, {flex: 1}]}>{item.price}</Text>
              <Text style={[styles.cell, {flex: 1}]}>
                {item.price * item.quantity}
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.row}>
            <Text style={styles.cell}>No items</Text>
          </View>
        )}

        <View style={styles.separator} />

        {/* Total */}
        <View style={styles.row}>
          <Text style={[styles.totalText, {flex: 3}]}>{t('grandTotal')}</Text>
          <Text style={[styles.totalText, {flex: 1}]}>{totalAmount} ₼</Text>
        </View>

        <Text style={styles.paymentInfo}>
          {t('paymentMethod')}: {masked_pan}
        </Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  container: {
    padding: 16,
    backgroundColor: '#F8F8F8',
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    color:"black",
    fontSize: 18,
    marginBottom: 12,
  },
  info: {
    fontSize: 14,
    marginBottom: 2,
    color:"black",
  },
  separator: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginVertical: 10,
    
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  cell: {
    fontSize: 14,
    color:"black",
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
    color:"black",
  },
  paymentInfo: {
    fontSize: 14,
    marginTop: 6,
    textAlign: 'left',
    color:"black",
  },
});
