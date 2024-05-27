import { StyledText, StyledTouchableOpacity, StyledView } from '../../common/components/StyledComponents'
import DotsIcon from "../../../assets/icons/dots-ride.svg"
import CompletedIcon from "../../../assets/icons/complete-pin-ride.svg"
import ArrowDown from "../../../assets/icons/arrow-down-ride.svg"
import IncompletedIcon from "../../../assets/icons/incomplete-pin-ride.svg"
import { FlatList } from 'react-native-gesture-handler'

const Rides = ({ items, setModalOpen }) => {
    const renderItem = ({ item }) => {
        return (
            <StyledView className='w-full p-4'>
                <StyledView className='flex-row items-center gap-2'>
                    <StyledView className='w-[2%] justify-center items-center'>
                        {item.completed ? <CompletedIcon /> : <IncompletedIcon />}
                    </StyledView>
                    <StyledText className='text-[#000000B2] text-xs font-poppi'>{item.fullname}</StyledText>
                </StyledView>
                <StyledView className='flex-row items-center gap-2'>
                    <StyledView className='w-[2%] items-center'>
                        <DotsIcon />
                    </StyledView>
                    <StyledText className='text-black text-base font-poppi-semibold border-b-[1px] w-[95%] border-[#D0D0D0] pb-1'>{item.address}</StyledText>
                </StyledView>
            </StyledView>
        )
    }

    return (
        <StyledView className='border-[1px] items-center p-4 pb-0 border-[#EDEFF3] max-h-[300px] rounded-[18px] '>
            <StyledView className='h-[90%]'>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ gap: 0 }}
                    data={items}
                    scrollEnabled={false}
                    renderItem={renderItem}
                />
            </StyledView>
            <StyledTouchableOpacity onPress={() => setModalOpen(true)} className='w-full h-[10%]  justify-center items-center'>
                <ArrowDown />
            </StyledTouchableOpacity>
        </StyledView>
    )
}

export default Rides