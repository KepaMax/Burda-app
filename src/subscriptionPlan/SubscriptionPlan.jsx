import { FlatList } from "react-native"
import { StyledText, StyledTouchableOpacity, StyledView } from "../common/components/StyledComponents"
import ArrowRightProfileIcon from "../../assets/icons/arrow-right-profile.svg"
import CreateRideRequest from "../mainpage/components/CreateRideRequest"


const SubscriptionPlan = ({ data }) => {

    const renderItem = ({ item }) => {
        console.log(item)
        return (
            <StyledTouchableOpacity className="bg-white flex-row justify-between items-center my-2 p-4 pr-6 border-[1px] border-[#EDEFF3] rounded-[24px]">
                <StyledText className="ml-4 text-base text-[#204F50] font-poppi-medium">{item.name} {item.surname}</StyledText>
                <ArrowRightProfileIcon />
            </StyledTouchableOpacity>
        )
    }

    return (
        <StyledView className="flex-1 p-4 bg-white">
            {data === null || data.length === 0 ?
                <CreateRideRequest />
                : <>
                    <StyledText className="font-poppi-semibold text-base text-[#204F50]">Students</StyledText>
                    <FlatList
                        renderItem={renderItem}
                        data={data}
                    />
                </>}

        </StyledView>
    )
}

export default SubscriptionPlan