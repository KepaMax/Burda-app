import { StyledTextInput, StyledTouchableOpacity, StyledView } from '../common/components/StyledComponents'
import MagnifierIcon from "../../assets/icons/magnifier.svg"
import MapIcon from "../../assets/icons/map.svg"
import Address from './components/Address'

const HomeAddress = () => {
    return (
        <StyledView className='flex-1 p-4 bg-white'>
            <StyledView className="bg-white border-[1px] my-3 border-[#EDEFF3] rounded-[18px]  px-4 pr-4 w-full items-center flex-row">
                <MagnifierIcon />
                <StyledTextInput
                    placeholderTextColor="#B7B7B7"
                    placeholder="Search address"
                    className="text-[black] text-base  font-poppi w-[86%] "
                />
                <StyledTouchableOpacity >
                    <MapIcon />
                </StyledTouchableOpacity>
            </StyledView>
            <Address />
            <Address />
        </StyledView>

    )
}

export default HomeAddress