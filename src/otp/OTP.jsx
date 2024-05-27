import { OtpInput } from 'react-native-otp-entry'
import { StyledText, StyledTouchableOpacity, StyledView } from '../common/components/StyledComponents'
import { useEffect, useRef, useState } from 'react'
import { Keyboard } from 'react-native';

const OTP = () => {

    const [canResend, setCanResend] = useState(true)
    const handleFilled = () => {
        Keyboard.dismiss();
    }

    return (
        <StyledView className='flex-1 p-4 justify-between bg-white'>
            <StyledView>
                <StyledText className='text-[22px] font-poppi-bold text-[#204F50]'>Enter verification code</StyledText>
                <StyledText className='text-[#868782] text-base font-poppi'>
                    We sent the code to your phone number
                </StyledText>
                <StyledView className='px-20 mt-28 justify-center items-center'>
                    <OtpInput numberOfDigits={4} focusColor={"#204F50"} hideStick={false} onFilled={handleFilled}
                        theme={{
                            pinCodeContainerStyle: { borderColor: "#EDEFF3", borderRadius: 0, borderWidth: 0, borderBottomWidth: 2, height: 70 },
                            pinCodeTextStyle: { color: "#204F50", fontSize: 48 },
                            focusedPinCodeContainerStyle: { borderColor: "#EDEFF3", borderRadius: 0, borderWidth: 0, borderBottomWidth: 2 }
                        }} />
                    <StyledView className='flex-row justify-center items-center mt-20'>
                        <StyledTouchableOpacity disabled={!canResend} onPress={() => {
                            setCanResend(false);
                            setTimeout(() => setCanResend(true), 40000);
                        }}>
                            <StyledText className={`${canResend ? 'text-[#204F50]' : "text-[#868782]"} text-base font-poppi-semibold`}>Resend </StyledText>
                        </StyledTouchableOpacity>
                        <StyledText className='text-[15px] text-[#868782] font-poppi'>In 40 seconds</StyledText>
                    </StyledView>
                </StyledView>
            </StyledView>
            <StyledTouchableOpacity className='rounded-[18px] p-[10px] items-center bg-[#76F5A4]'>
                <StyledText className='text-base font-poppi-semibold text-[#204F50]'>Complete</StyledText>
            </StyledTouchableOpacity>
        </StyledView>
    )
}

export default OTP