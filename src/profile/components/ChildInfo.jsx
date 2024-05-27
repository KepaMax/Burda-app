import { StyledText, StyledTouchableOpacity, StyledView } from "../../common/components/StyledComponents"
import EditChildProfileIcon from "../../../assets/icons/edit-child-profile.svg"
import { Text, View } from "react-native"
import FastImage from "react-native-fast-image"
import { useNavigation } from "@react-navigation/native"

const ChildInfo = () => {
    const navigation = useNavigation();
    
    return (
        <StyledView className="bg-white flex-row justify-between items-center my-2 p-4 pr-6 border-[1px] border-[#EDEFF3] rounded-[18px]">
            <StyledView className="flex-row items-center">
                <FastImage  style={{ width: 60, height: 60, borderRadius: 9999 }} source={require("../../../assets/images/test-avatar1.png")} />
                <StyledText className="ml-4 text-base text-[#204F50] font-poppi-medium">Mikael David</StyledText>
            </StyledView>
            <StyledTouchableOpacity onPress={()=>navigation.navigate("ChildProfile")}>
                <EditChildProfileIcon />
            </StyledTouchableOpacity>
        </StyledView>
    )
}

ChildInfo.displayName = "ChildInfo"

export default ChildInfo