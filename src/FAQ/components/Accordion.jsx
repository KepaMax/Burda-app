import { useState } from "react"
import { StyledText, StyledTouchableOpacity, StyledView } from "../../common/components/StyledComponents";
import { FlatList } from "react-native";
import ArrowDownIcon from "../../../assets/icons/arrow-down-faq.svg"
import ArrowUpIcon from "../../../assets/icons/arrow-up-faq.svg"

const Accordion = ({ items }) => {
    const [activeIndex, setActiveIndex] = useState();
    const handlePress = (index) => {
        index === activeIndex ? setActiveIndex(null) : setActiveIndex(index)
    }

    const renderItem = ({ item, index }) => {
        return (
            <StyledTouchableOpacity onPress={() => handlePress(index)} className="p-4  rounded-[18px] border-[1px] border-[#EDEFF3]">
                <StyledView className="flex-row justify-between items-center ">
                    <StyledText className="font-poppi-medium text-base text-[#204F50]">{item.title}</StyledText>
                    {index === activeIndex ? <ArrowUpIcon /> : <ArrowDownIcon />}
                </StyledView>
                {index === activeIndex && <StyledText className="font-poppi mt-4 text-sm text-black">{item.content}</StyledText>}
            </StyledTouchableOpacity>
        )

    }

    return (
        <StyledView className="w-full h-full">
            <FlatList
                contentContainerStyle={{ gap: 12 }}
                data={items}
                renderItem={renderItem}
            />
        </StyledView>
    )
}

export default Accordion