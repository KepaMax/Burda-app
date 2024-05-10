import { FlatList } from "react-native"
import { StyledView } from "../common/components/StyledComponents"
import HistoryInfo from "./components/HistoryInfo"

const SubscriptionHistory = () => {

    const renderItem = ({item}) => {
        return (
            <HistoryInfo isActive={item} />
        )
    }

    const dummyData = [true, false, true, false];
    return (
        <StyledView className="flex-1 bg-white p-4">
            <FlatList
                contentContainerStyle={{ gap: 20 }}
                scrollEnabled={true}
                renderItem={renderItem}
                data={dummyData}
            />
        </StyledView>
    )
}

export default SubscriptionHistory