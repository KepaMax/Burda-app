import React, {useState, useEffect, useCallback} from 'react';
import Styled from '@common/StyledComponents';
import {useNavigation} from '@react-navigation/native';
import {useMMKVNumber} from 'react-native-mmkv';
import Icons from '@icons/icons.js';
import {
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Pressable,
} from 'react-native';
import {fetchData} from '@utils/fetchData';
import {API_URL} from '@env';
import {formatDistanceToNow} from 'date-fns';
import {az, ru, enUS} from 'date-fns/locale';
import {useTranslation} from 'react-i18next';

const NotificationItem = ({item, onPress, getLocale}) => {
  const formatTime = dateString => {
    try {
      if (!dateString) {
        return '';
      }
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: getLocale(),
      });
    } catch (error) {
      return '';
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Styled.View
        className={`px-4 py-4 border-b-[1px] border-[#EBEBEB] flex-row ${
          !item.is_read ? 'bg-[#EEF5F1]' : 'bg-white'
        }`}>
        {/* Unread dot */}
        <Styled.View className="pt-1.5 mr-3">
          <Styled.View
            className={`w-2.5 h-2.5 rounded-full ${
              !item.is_read ? 'bg-[#184639]' : 'bg-transparent'
            }`}
          />
        </Styled.View>

        {/* Content */}
        <Styled.View className="flex-1">
          <Styled.Text className="text-[15px] font-semibold text-[#1A1A1A] mb-1">
            {item.title}
          </Styled.Text>
          <Styled.Text numberOfLines={1} className="text-[13px] text-[#666] leading-[18px]">
            {item.description}
          </Styled.Text>
          <Styled.Text className="text-[11px] text-[#999] mt-2">
            {formatTime(item.created_at)}
          </Styled.Text>
        </Styled.View>
      </Styled.View>
    </TouchableOpacity>
  );
};

const NotificationsPage = () => {
  const navigation = useNavigation();
  const {i18n, t} = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [modalNotification, setModalNotification] = useState(null);
  const [unreadCountRefreshTrigger] = useMMKVNumber('unreadCountRefreshTrigger');

  const getLocale = () => {
    switch (i18n.language) {
      case 'az':
        return az;
      case 'ru':
        return ru;
      default:
        return enUS;
    }
  };

  const formatTime = dateString => {
    try {
      if (!dateString) return '';
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: getLocale(),
      });
    } catch (error) {
      return '';
    }
  };

  const openModal = item => {
    if (!item.is_read) markAsRead(item.id, item.is_read);
    setModalNotification({...item, is_read: true});
  };

  const closeModal = () => setModalNotification(null);

  const getNotifications = async (pageNumber = 1, isRefresh = false) => {
    try {
      const result = await fetchData({
        url: `${API_URL}/notifications/?page=${pageNumber}&page_size=20`,
        tokenRequired: true,
      });

      if (result?.success) {
        const newData = result.data.results || [];
        if (isRefresh) {
          setNotifications(newData);
        } else {
          setNotifications(prev => [...prev, ...newData]);
        }
        setHasMore(result.data.next !== null);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    getNotifications(1, true);
  }, []);

  // Refresh list when a push notification is received (same trigger as HomeHeader unread count)
  useEffect(() => {
    if (unreadCountRefreshTrigger != null && unreadCountRefreshTrigger > 0) {
      setPage(1);
      getNotifications(1, true);
    }
  }, [unreadCountRefreshTrigger]);

  const loadMore = () => {
    if (!loading && hasMore && notifications.length > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      getNotifications(nextPage);
    }
  };

  const markAsRead = async (id, isRead) => {
    if (isRead) {
      return;
    }

    try {
      setNotifications(prev =>
        prev.map(item => (item.id === id ? {...item, is_read: true} : item)),
      );

      await fetchData({
        url: `${API_URL}/notifications/${id}/`,
        method: 'PATCH',
        tokenRequired: true,
        body: {
          is_read: true,
        },
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const result = await fetchData({
        url: `${API_URL}/notifications/mark-all-read/`,
        method: 'POST',
        tokenRequired: true,
      });
      if (result?.success) {
        setNotifications(prev => prev.map(item => ({...item, is_read: true})));
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return (
    <Styled.View className="flex-1 bg-[#F8F8F8]">
      {/* Header */}
      <Styled.View className="px-4 py-5 flex-row justify-between items-center border-b-[1px] border-[#E4E4E4] bg-white">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icons.ArrowBlack width={24} height={24} />
        </TouchableOpacity>
        <Styled.Text className="text-[18px] font-semibold text-[#184639] ml-3">
          Bildirişlər
        </Styled.Text>
        <TouchableOpacity onPress={markAllAsRead}>
          <Icons.NotificationCheck width={24} height={24} color="#184639" />
        </TouchableOpacity>
      </Styled.View>

      {/* Notification list */}
      {loading && page === 1 ? (
        <Styled.View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#184639" />
        </Styled.View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <NotificationItem
              item={item}
              getLocale={getLocale}
              onPress={() => openModal(item)}
            />
          )}
          contentContainerStyle={{paddingBottom: 20}}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#184639"
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <Styled.View className="flex-1 justify-center items-center mt-20">
              <Styled.Text className="text-[#666] text-[15px]">
                Bildiriş yoxdur
              </Styled.Text>
            </Styled.View>
          }
        />
      )}

      {/* Bildirim detay modalı */}
      <Modal
        visible={!!modalNotification}
        transparent
        animationType="fade"
        onRequestClose={closeModal}>
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
          }}
          onPress={closeModal}>
          <Pressable
            style={{
              width: '100%',
              maxWidth: 400,
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              paddingHorizontal: 20,
              paddingTop: 20,
              paddingBottom: 24,
            }}
            onPress={e => e.stopPropagation()}>
            {modalNotification && (
              <>
                <Styled.Text className="text-[18px] font-bold text-[#1A1A1A] mb-2">
                  {modalNotification.title}
                </Styled.Text>
                <Styled.Text className="text-[15px] text-[#444] leading-[22px] mb-3">
                  {modalNotification.description}
                </Styled.Text>
                <Styled.Text className="text-[12px] text-[#999] mb-5">
                  {formatTime(modalNotification.created_at)}
                </Styled.Text>
                <TouchableOpacity
                  onPress={closeModal}
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: '#E8E8E8',
                    borderRadius: 10,
                    paddingVertical: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Styled.Text className="text-[16px] font-semibold text-[#1A1A1A]">
                    {t('close')}
                  </Styled.Text>
                </TouchableOpacity>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </Styled.View>
  );
};

export default NotificationsPage;
