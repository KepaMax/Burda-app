import RingbellHomeIcon from '@icons/ringbell-home.svg';
import LogoHomeIcon from '@icons/logo-home.svg';
import {useNavigation} from '@react-navigation/native';
import '@locales/index';
import {StyledTouchableOpacity, StyledView} from '@common/StyledComponents';

const MainPageHeader = () => {
  const navigation = useNavigation();

  return (
    <StyledView className=" px-4 py-2 flex-row justify-between bg-[#7658F2]">
      <StyledView className="border-[1px] border-[#BABABA] w-[44px] h-[44px] items-center justify-center rounded-[10px]">
        <LogoHomeIcon />
      </StyledView>

      {/* <StyledView className="flex-row gap-[16px]">
        <StyledTouchableOpacity
          onPress={() => navigation.navigate('Notifications')}
          className="border-[1px] bg-white border-[#EDEFF3] w-[40px] h-[40px] items-center justify-center rounded-full">
          <RingbellHomeIcon />
        </StyledTouchableOpacity>
      </StyledView> */}
    </StyledView>
  );
};

export default MainPageHeader;
