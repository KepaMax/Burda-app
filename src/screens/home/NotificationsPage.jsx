import React, {useState, useEffect} from 'react';
import Styled from '@common/StyledComponents';
import {useNavigation} from '@react-navigation/native';
import Icons from '@icons/icons.js';
import {
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
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
  const {i18n} = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

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

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    getNotifications(1, true);
  };

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

  return (
    <Styled.View className="flex-1 bg-[#F8F8F8]">
      {/* Header */}
      <Styled.View className="px-4 py-5 flex-row items-center border-b-[1px] border-[#E4E4E4] bg-white">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icons.ArrowBlack width={24} height={24} />
        </TouchableOpacity>
        <Styled.Text className="text-[18px] font-semibold text-[#184639] ml-3">
          Bildirişlər
        </Styled.Text>
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
              onPress={() => {
                if (!item.is_read) {
                  markAsRead(item.id, item.is_read);
                }
                navigation.navigate('NotificationDetail', {
                  notification: {...item, is_read: true},
                });
              }}
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
    </Styled.View>
  );
};

export default NotificationsPage;
