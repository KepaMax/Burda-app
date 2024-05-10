import { StyledText, StyledTouchableOpacity, StyledView } from '../common/components/StyledComponents'
import { format } from 'date-fns'
import AddIcon from "../../assets/icons/add-card.svg"
import VisaIcon from "../../assets/icons/visa-payment.svg"
import { useNavigation } from '@react-navigation/native'

const SubscriptionPayment = () => {
    const navigation= useNavigation();
    const cardSelected = true;
    return (
        <StyledView className='flex-1 bg-white justify-between p-4 '>
            <StyledView className='gap-4'>
                <StyledText className='w-full text-center font-poppi-medium text-lg text-[#204F50]'>Mikael David</StyledText>
                <StyledView className='p-4 flex-row items-center justify-between rounded-[18px] border-[1px] border-[#EDEFF3]'>
                    <StyledText className='text-black text-base font-poppi-medium'>Start date</StyledText>
                    <StyledText className='text-[#7658F2] text-base font-poppi-bold-italic'>{format(new Date(), "dd MMM, yyyy")}</StyledText>
                </StyledView>
                <StyledView className='p-[10px] border-[1px] border-[#EDEFF3] mb-5 rounded-[18px]'>
                    <StyledText className='text-lg font-poppi-semibold text-[#204F50]'>Payment</StyledText>
                    {cardSelected ? <StyledView className='flex-row p-[10px] justify-between items-center'>
                        <StyledView className='flex-row items-center'>
                            <VisaIcon />
                            <StyledText className='text-sm ml-3 text-[#414141] font-poppi-medium'>****   5567</StyledText>
                        </StyledView>
                        <StyledTouchableOpacity onPress={()=>navigation.navigate("ManageCards")}>
                            <StyledText className='text-sm text-[#7658F2] font-poppi-medium'>Change</StyledText>
                        </StyledTouchableOpacity>
                    </StyledView>
                        :
                        <StyledTouchableOpacity onPress={()=>navigation.navigate("AddCard")} className='flex-row p-[10px] items-center'>
                            <AddIcon />
                            <StyledText className="text-base ml-2 text-[#7658F2] font-poppi-semibold">Add new card</StyledText>
                        </StyledTouchableOpacity>
                    }
                </StyledView>

                <StyledView className='flex-row justify-between'>
                    <StyledText className='text-black text-base font-poppi-semibold'>Total price:</StyledText>
                    <StyledText className='text-base font-poppi-semibold text-[#7658F2]'> 120 AZN</StyledText>
                </StyledView>
            </StyledView>

            <StyledTouchableOpacity className='rounded-[18px] items-center bg-[#76F5A4] py-[10px]'>
                <StyledText className='text-base text-[#204F50] font-poppi-semibold'>Pay now</StyledText>
            </StyledTouchableOpacity>
        </StyledView>
    )
}

export default SubscriptionPayment