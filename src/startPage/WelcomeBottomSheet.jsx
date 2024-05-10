import { useEffect, useMemo, useRef } from 'react';
import BottomSheet, { useBottomSheet } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyledText, StyledTouchableOpacity, StyledView } from '../common/components/StyledComponents';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const WelcomeBottomSheet = () => {
    const bottomSheetRef = useRef(null);
    const navigation = useNavigation();
    const snapPoints = useMemo(() => ['35%'], []);

    return (
        <StyledView className=' bg-black/20 absolute h-full w-screen z-50' >
            <GestureHandlerRootView style={{ flex: 1 }}>
                <BottomSheet
                    ref={bottomSheetRef}
                    index={0}
                    snapPoints={snapPoints}
                    handleIndicatorStyle={{ backgroundColor: '#BEBFC0' }}
                    backgroundStyle={{ backgroundColor: '#fff' }}
                >
                    <StyledView className='p-6  items-center  w-max h-full'>
                        <StyledText className="font-poppi-bold text-[22px] mb-2 text-[#204F50]">Welcome to 2School</StyledText>

                        <StyledText className='text-[#868782] text-[15px] font-poppi mb-5'>Service for transporting children</StyledText>
                        <StyledView className='w-full'>
                            <StyledTouchableOpacity onPress={() => navigation.navigate("SignUp")} className='rounded-[18px] w-full items-center  bg-[#76F5A4] p-[10px]'>
                                <StyledText className='font-poppi-semibold text-base text-[#204F50]'>Get started</StyledText>
                            </StyledTouchableOpacity>
                            <StyledTouchableOpacity onPress={() => navigation.navigate("SignIn")} className='rounded-[18px] mt-3 w-full items-center bg-[#EDEFF3] p-[10px]'>
                                <StyledText className='font-poppi-semibold text-base text-[#204F50]'>I already have an account</StyledText>
                            </StyledTouchableOpacity>
                        </StyledView>
                    </StyledView>
                </BottomSheet>
            </GestureHandlerRootView>

        </StyledView>
    );
};

export default WelcomeBottomSheet;