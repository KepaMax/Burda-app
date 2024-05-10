import { StyledText, StyledTouchableOpacity, StyledView } from '../components/StyledComponents';
import WarningProfileIcon from "../../../assets/icons/warning-profile.svg"

const WarningModal = ({ setModalOpen, title, description }) => {
    return (
        <StyledView className=" items-center justify-center bg-black/20 absolute h-full w-full z-50">
            <StyledView
                className={`bg-white p-4 pt-12 rounded-sm shadow justify-center items-center shadow-zinc-400 border-t-2 border-[#FF3115] mx-5`}>
                <StyledView className="bg-[#FF3115] w-[42px] h-[42px] items-center justify-center absolute -top-5   rounded-full">
                    <WarningProfileIcon />
                </StyledView>
                <StyledText className="text-center text-base font-poppi-semibold text-[#414141] my-4">
                    {title}
                </StyledText>
                <StyledText className="text-center text-sm font-serrat text-[#414141]">
                    {description}
                </StyledText>
                <StyledView className="flex-row w-full items-center mt-10">
                    <StyledTouchableOpacity
                        onPress={() => {
                            setModalOpen(false);
                        }}
                        className="py-2 w-[64px] rounded-md">
                        <StyledText className="text-center text-lg font-serrat-medium text-[#757575]">
                            No
                        </StyledText>
                    </StyledTouchableOpacity>
                    <StyledTouchableOpacity
                        className="py-2 bg-[#FF3115] ml-12 w-[64px] rounded-md">
                        <StyledText className="text-center text-lg text-white font-serrat-medium">
                            Yes
                        </StyledText>
                    </StyledTouchableOpacity>
                </StyledView>
            </StyledView>
        </StyledView>
    )
}

export default WarningModal