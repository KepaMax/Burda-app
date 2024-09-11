import BottomSheet from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  StyledImageBackground,
  StyledText,
  StyledTouchableOpacity,
  StyledView,
} from '@common/StyledComponents';
import {useTranslation} from 'react-i18next';
import DriverIcon from '@icons/driver-icon.svg';
import NannyIcon from '@icons/nanny-icon.svg';
import {useNavigation} from '@react-navigation/native';
import LoginBg from '@images/loginBg.png';
import {useMMKVString} from 'react-native-mmkv';

const WelcomeBottomSheet = () => {
  const [userType, setUserType] = useMMKVString('userType');
  const navigation = useNavigation();
  const {t} = useTranslation();

  return (
    <StyledImageBackground className="flex-1 bg-[#7658F2]" source={LoginBg}>
      <StyledView className="bg-black/20 absolute h-full w-screen z-50">
        <GestureHandlerRootView style={{flex: 1}}>
          <BottomSheet
            snapPoints={userType ? ['55%'] : ['40%']}
            handleIndicatorStyle={{backgroundColor: '#BEBFC0'}}
            backgroundStyle={{backgroundColor: '#fff'}}>
            <StyledView className="p-6  items-center  w-max h-full">
              <StyledText className="font-poppi-bold text-[22px] mb-2 text-[#204F50]">
                {t('attributes.welcome')}
              </StyledText>

              <StyledText className="text-[#868782] text-[15px] font-poppi mb-5">
                {t('attributes.2schoolDesc')}
              </StyledText>
              <StyledView className="flex-row justify-center gap-6 w-full">
                <StyledTouchableOpacity
                  onPress={() => {
                    if (userType === 'drivers') {
                      setUserType('');
                    } else {
                      setUserType('drivers');
                    }
                  }}
                  className={`${
                    userType === 'drivers' ? 'bg-[#76F5A433]' : 'bg-transparent'
                  } rounded-[18px] w-[140px] border-[1px] border-[#EDEFF3] px-5 py-3`}>
                  <DriverIcon />
                  <StyledText className="font-poppi-bold text-[#204F50] text-xl text-center">
                    {t('attributes.driver')}
                  </StyledText>
                </StyledTouchableOpacity>
                <StyledTouchableOpacity
                  onPress={() => {
                    if (userType === 'nannies') {
                      setUserType('');
                    } else {
                      setUserType('nannies');
                    }
                  }}
                  className={`${
                    userType === 'nannies' ? 'bg-[#76F5A433]' : 'bg-transparent'
                  } rounded-[18px] w-[140px] border-[1px] border-[#EDEFF3] px-5 py-3`}>
                  <NannyIcon />
                  <StyledText className="font-poppi-bold text-[#204F50] text-xl text-center">
                    {t('attributes.nanny')}
                  </StyledText>
                </StyledTouchableOpacity>
              </StyledView>
              {userType && (
                <StyledView className="w-full mt-4">
                  <StyledTouchableOpacity
                    onPress={() => navigation.navigate('SignUp')}
                    className="rounded-[18px] w-full items-center  bg-[#76F5A4] p-[10px]">
                    <StyledText className="font-poppi-semibold text-base text-[#204F50]">
                      {t('attributes.getStarted')}
                    </StyledText>
                  </StyledTouchableOpacity>
                  <StyledTouchableOpacity
                    onPress={() => navigation.navigate('SignIn')}
                    className="rounded-[18px] mt-3 w-full items-center bg-[#EDEFF3] p-[10px]">
                    <StyledText className="font-poppi-semibold text-base text-[#204F50]">
                      {t('attributes.alreadyHasAccount')}
                    </StyledText>
                  </StyledTouchableOpacity>
                </StyledView>
              )}
            </StyledView>
          </BottomSheet>
        </GestureHandlerRootView>
      </StyledView>
    </StyledImageBackground>
  );
};

export default WelcomeBottomSheet;
