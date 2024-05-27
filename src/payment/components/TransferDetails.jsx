import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import SuccessIcon from "../../../assets/icons/success-payment.svg"
import ErrorIcon from "../../../assets/icons/error-payment.svg"
import { format } from 'date-fns';

const StyledView = styled(View);
// const StyledScrollView = styled(ScrollView);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const TransferDetails = () => {
  //const navigation = useNavigation();
  const success = false;
  return (
    <StyledView className='flex-1 p-4 pt-12 bg-white justify-between'>
      <StyledView className='justify-center items-center w-full '>
        {success ? <SuccessIcon /> : <ErrorIcon />}
        <StyledText className='text-xl text-[#204F50] font-poppi-semibold mt-5'> {success ? "Successfull!" : "Payment Error!"}</StyledText>
        {success ?
          (
            <>
              <StyledView className='flex-row justify-between my-1 mt-5 items-center w-full'>
                <StyledText className='text-[#414141] text-sm font-poppi'>Transaction ID</StyledText>
                <StyledText className='text-[#414141] text-sm font-poppi-medium'>12345678</StyledText>
              </StyledView>
              <StyledView className='flex-row justify-between my-1 items-center w-full'>
                <StyledText className='text-[#414141] text-sm font-poppi'>Purchase date</StyledText>
                <StyledText className='text-[#414141] text-sm font-poppi-medium'>{format(new Date(), "dd.MM.yy, HH:mm")}</StyledText>
              </StyledView>
              <StyledView className='flex-row justify-between my-1 items-center w-full'>
                <StyledText className='text-[#414141] text-sm font-poppi'>Card number</StyledText>
                <StyledText className='text-[#414141] text-sm font-poppi-medium'>41694455****7754</StyledText>
              </StyledView>
              <StyledView className='flex-row justify-between my-1 items-center w-full'>
                <StyledText className='text-[#414141] text-sm font-poppi'>41694455****7754</StyledText>
                <StyledText className='text-[#414141] text-sm font-poppi-medium'>120 AZN</StyledText>
              </StyledView>
            </>)
          : (
            <>
              <StyledView className='flex-row justify-between my-1 mt-5 items-center w-full'>
                <StyledText className='text-[#414141] text-sm font-poppi'>Transaction ID</StyledText>
                <StyledText className='text-[#414141] text-sm font-poppi-medium'>12345678</StyledText>
              </StyledView>
              <StyledView className='flex-row justify-between my-1 items-center w-full'>
                <StyledText className='text-[#414141] text-sm font-poppi'>Status</StyledText>
                <StyledText className='text-[#414141] text-sm font-poppi-medium'>Declined</StyledText>
              </StyledView>
              <StyledView className='flex-row justify-between my-1 items-center w-full'>
                <StyledText className='text-[#414141] text-sm font-poppi'>Response description</StyledText>
                <StyledText className='text-[#414141] text-sm font-poppi-medium'>Insufficient funds</StyledText>
              </StyledView>
            </>)}
      </StyledView>
      <StyledTouchableOpacity className='p-[10px] rounded-[18px] bg-[#76F5A4] items-center'>
        <StyledText className='text-base text-[#204F50] font-poppi-semibold'>Back to homepage</StyledText>
      </StyledTouchableOpacity>
    </StyledView>
  );
};

export default TransferDetails;
