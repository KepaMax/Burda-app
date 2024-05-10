import { StyledText, StyledTouchableOpacity, StyledView } from '../common/components/StyledComponents'
import VisaIcon from "../../assets/icons/visa-payment.svg"
import MasterCardIcon from "../../assets/icons/mastercard-payment.svg"
import DeleteCardIcon from "../../assets/icons/delete-card-payment.svg"
import { FlatList } from 'react-native'
import { useState } from 'react'
import WarningModal from '../common/components/WarningModal'
import { useNavigation } from '@react-navigation/native'

const ManageCards = () => {
    const navigation = useNavigation()

    const [selectedCard, setSelectedCard] = useState();
    const [deleteCardOpen, setDeleteCardOpen] = useState(false);

    const cardData = [
        {
            id: 1,
            icon: <VisaIcon />
        },
        {
            id: 2,
            icon: <MasterCardIcon />
        },]

    const renderItem = ({ item }) => {
        return (
            <StyledTouchableOpacity onPress={() => setSelectedCard(item.id)} className={`p-4 flex-row border-[1px] justify-between items-center rounded-[8px] ${selectedCard === item.id ? "border-[#7658F2]" : "border-[#EDEFF3]"}`}>
                <StyledView className='flex-row items-center gap-4'>
                    {item.icon}
                    <StyledText className='text-[#414141] text-sm font-poppi-medium'>
                        ****   5567
                    </StyledText>
                </StyledView>
            </StyledTouchableOpacity>
        )
    }

    return (
        <>
            <StyledView className='flex-1 justify-between bg-white p-4'>
                <StyledView className='gap-2'>
                    <StyledText className='text-[#204F50] font-poppi-bold text-xl'>Payment details</StyledText>
                    <StyledText className='text-[#868782] font-poppi text-sm'>Amet minim mollit Amet minim mollit </StyledText>
                    <StyledView>
                        <FlatList
                            scrollEnabled={true}
                            data={cardData}
                            contentContainerStyle={{ gap: 12 }}
                            renderItem={renderItem}
                        />
                    </StyledView>
                    <StyledTouchableOpacity onPress={() => navigation.navigate("AddCard")}>
                        <StyledText className='text-[#7658F2] mt-2 font-poppi-semibold text-base'>+ Add new card</StyledText>
                    </StyledTouchableOpacity>

                </StyledView>
                <StyledTouchableOpacity onPress={() => navigation.goBack()} className='rounded-[18px] bg-[#76F5A4] p-[10px] items-center'>
                    <StyledText className='text-base text-[#204F50] font-poppi-semibold'>Confirm</StyledText>
                </StyledTouchableOpacity>
            </StyledView>
        </>

    )
}

export default ManageCards