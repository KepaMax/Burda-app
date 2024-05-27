import { StyledView, StyledTouchableOpacity, StyledText, } from "../../common/components/StyledComponents"
import AddHomeIcon from "../../../assets/icons/add-home.svg"
import FastImage from "react-native-fast-image"
import { useNavigation } from "@react-navigation/native"

const CreateRideRequest = () => {
    const navigation = useNavigation();

    return (
        <StyledView className="gap-2 mt-4">
            <StyledText className="text-base text-[#204F50] font-poppi-semibold">Request ride</StyledText>
            <StyledView className="bg-white relative p-4 border-[1px] border-[#EDEFF3] rounded-[24px]">
                <StyledView className="w-[250px] ">
                    <StyledText className="text-base  text-black font-poppi-medium">Create monthly ride plan</StyledText>
                    <StyledText className="text-xs mt-2 text-[#868686] font-poppi">Add  your child before requesting ride </StyledText>

                </StyledView>
                <StyledTouchableOpacity onPress={() => navigation.navigate("RequestRide")} className="py-2 flex-row w-[150px] mt-9 justify-center items-center bg-[#76F5A4] rounded-[18px]">
                    <AddHomeIcon />
                    <StyledText className="font-poppi-semibold ml-1 text-[#204F50] text-xs">Start</StyledText>
                </StyledTouchableOpacity>
                <FastImage source={require("../../../assets/images/bus-image-home.png")} className="absolute w-[98px] h-[134px] right-0 top-[52px]">
                </FastImage>
            </StyledView>
        </StyledView>
    )
}

export default CreateRideRequest