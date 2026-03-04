import Styled from '@common/StyledComponents';
import Icons from '@icons/icons.js';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

const UNREAD_COUNT = 10; // mock data

const HomeHeader = () => {
  const navigation = useNavigation();

  return (
    <Styled.View className="px-4 py-5 border-b-[1px] border-[#E4E4E4] flex-row items-center justify-between">
      <Icons.HomeHeaderLogo />
      <TouchableOpacity
        onPress={() => navigation.navigate('Notifications')}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Styled.View className="w-10 h-10 rounded-full border-[1px] border-[#E4E4E4] shadow-sm shadow-zinc-300 bg-white items-center justify-center">
          <Icons.NotificationBell width={20} height={20} color="#184639" />
          {UNREAD_COUNT > 0 && (
            <Styled.View className="absolute -top-1.5 -right-1.5 bg-[#66B600] rounded-full min-w-[20px] h-[20px]  items-center justify-center px-1">
              <Styled.Text className="text-white text-[11px] font-bold">
                {UNREAD_COUNT > 9 ? '9+' : UNREAD_COUNT}
              </Styled.Text>
            </Styled.View>
          )}
        </Styled.View>
      </TouchableOpacity>
    </Styled.View>
  );
};

export default HomeHeader;
