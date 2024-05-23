import { StyledText, StyledTouchableOpacity, StyledView } from "./StyledComponents"
import SuccesIcon from "../../../assets/icons/succes-add-child.svg"
import LogoIcon from "../../../assets/icons/logo-home.svg"
import FastImage from "react-native-fast-image"
import { useNavigation, useRoute } from "@react-navigation/native"

const RegisterSuccess = () => {
    const route = useRoute();
    const isParent = route.params.isParent;
    const navigation = useNavigation();
    return (
        <>
            <StyledView className="w-full bg-[#7658F2] px-4 py-2">
                <StyledTouchableOpacity onPress={() => navigation.navigate("Home Page")} className="border-[1px] border-[#BABABA] w-[44px] h-[44px] items-center justify-center rounded-[10px]">
                    <LogoIcon />
                </StyledTouchableOpacity>
            </StyledView>
            <StyledView className="flex-1 bg-white justify-between items-center p-4">
                <StyledView className="justify-center items-center w-full">
                    <StyledView className="my-4">
                        <SuccesIcon />
                    </StyledView>
                    <StyledView className="gap-1">
                        <StyledText className="text-black text-center text-xl font-poppi-semibold">
                            Congratulations!
                        </StyledText>
                        <StyledText className="text-black text-center text-xl font-poppi-semibold">
                            {isParent ? "You are registered" : "Your child is registered"}
                        </StyledText>
                        <StyledView className="px-10 ">
                            <StyledText className="text-[#868782] my-2 text-center text-sm font-poppi">
                                This information will be displayed in your profile
                            </StyledText>
                        </StyledView>
                    </StyledView>

                    <StyledTouchableOpacity className="flex-row mt-4 p-4 border-[1px] border-[#EDEFF3] rounded-[18px] w-full items-center">
                        <FastImage
                            source={require("../../../assets/images/test-avatar1.png")}
                            style={{ width: 61, height: 61, borderRadius: 9999 }}
                        />
                        <StyledText className="text-base text-black ml-2 font-poppi-semibold">Aynur Mammadli</StyledText>
                    </StyledTouchableOpacity>
                </StyledView>

                <StyledTouchableOpacity onPress={() => navigation.navigate("Home Page")} className="bg-[#76F5A4] rounded-[18px] w-full items-center py-2">
                    <StyledText className="font-poppi-semibold text-base text-[#204F50]">Go to homepage</StyledText>
                </StyledTouchableOpacity>
            </StyledView>
        </>
    )
}

export default RegisterSuccess