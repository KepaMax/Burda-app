import { StyledText, StyledTouchableOpacity, StyledView } from '../../common/components/StyledComponents'

const Address = () => {

    return (
        <StyledTouchableOpacity className='border-[1px] my-1 px-4 py-[10px] rounded-[18px] border-[#EDEFF3] '>
            <StyledText className='text-base text-black font-poppi'>Address</StyledText>
        </StyledTouchableOpacity>
    )
}

export default Address