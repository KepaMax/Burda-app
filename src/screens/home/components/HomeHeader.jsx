import React, {useState, useEffect, useCallback} from 'react';
import Styled from '@common/StyledComponents';
import Icons from '@icons/icons.js';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native';
import {useMMKVNumber} from 'react-native-mmkv';
import {fetchData} from '@utils/fetchData';
import {API_URL} from '@env';

const HomeHeader = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadCountRefreshTrigger] = useMMKVNumber('unreadCountRefreshTrigger');

  const getUnreadCount = useCallback(async () => {
    try {
      const result = await fetchData({
        url: `${API_URL}/notifications/unread-count/`,
        tokenRequired: true,
      });

      if (result?.success) {
        setUnreadCount(result.data.unread_count || 0);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      getUnreadCount();
    }
  }, [isFocused, getUnreadCount]);

  // Refresh unread count when a push notification is received (foreground or background)
  useEffect(() => {
    if (unreadCountRefreshTrigger != null && unreadCountRefreshTrigger > 0) {
      getUnreadCount();
    }
  }, [unreadCountRefreshTrigger, getUnreadCount]);

  return (
    <Styled.View className="px-4 py-5 border-b-[1px] border-[#E4E4E4] flex-row items-center justify-between">
      <Icons.HomeHeaderLogo />
      <TouchableOpacity
        onPress={() => navigation.navigate('Notifications')}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
        <Styled.View className="w-10 h-10 rounded-full border-[1px] border-[#E4E4E4] shadow-sm shadow-zinc-300 bg-white items-center justify-center">
          <Icons.NotificationBell width={20} height={20} color="#184639" />
          {unreadCount > 0 && (
            <Styled.View className="absolute -top-1.5 -right-1.5 bg-[#66B600] rounded-full min-w-[20px] h-[20px]  items-center justify-center px-1">
              <Styled.Text className="text-white text-[11px] font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </Styled.Text>
            </Styled.View>
          )}
        </Styled.View>
      </TouchableOpacity>
    </Styled.View>
  );
};

export default HomeHeader;
