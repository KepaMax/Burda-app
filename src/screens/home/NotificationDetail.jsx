import Styled from '@common/StyledComponents';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icons from '@icons/icons.js';
import {TouchableOpacity} from 'react-native';
import {formatDistanceToNow} from 'date-fns';
import {az, ru, enUS} from 'date-fns/locale';
import {useTranslation} from 'react-i18next';

const NotificationDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {notification} = route.params;
  const {i18n} = useTranslation();

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
    <Styled.View className="flex-1 bg-[#F8F8F8]">
      {/* Header */}
      <Styled.View className="px-4 py-5 border-b-[1px] border-[#E4E4E4] flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icons.ArrowBlack width={24} height={24} />
        </TouchableOpacity>
        <Styled.Text className="text-[18px] font-semibold text-[#184639] ml-3">
          Bildiriş
        </Styled.Text>
      </Styled.View>

      {/* Content */}
      <Styled.View className="px-5 py-6">
        {/* Title */}
        <Styled.Text className="text-[20px] font-bold text-[#1A1A1A] mb-2">
          {notification.title}
        </Styled.Text>

        {/* Time */}
        <Styled.Text className="text-[12px] text-[#999] mb-5">
          {formatTime(notification.created_at)}
        </Styled.Text>

        {/* Divider */}
        <Styled.View className="h-[1px] bg-[#E4E4E4] mb-5" />

        {/* Message */}
        <Styled.Text className="text-[15px] text-[#444] leading-[22px]">
          {notification.description}
        </Styled.Text>
      </Styled.View>
    </Styled.View>
  );
};

export default NotificationDetail;
