import FastImage from "react-native-fast-image";
import { StyledText, StyledTouchableOpacity, StyledView } from "../../common/components/StyledComponents";
import ArrowUpIcon from "../../../assets/icons/arrow-up-faq.svg"
import ArrowDownIcon from "../../../assets/icons/arrow-down-faq.svg"
import AcceptIcon from "../../../assets/icons/accept-home.svg"
import CancelIcon from "../../../assets/icons/cancel-home.svg"
import PhoneIcon from "../../../assets/icons/phone-home.svg"
import { useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { Linking } from "react-native";
import { useTranslation } from "react-i18next";

const StudentsAccordion = ({ items }) => {
    const [activeIndex, setActiveIndex] = useState();
    const { t } = useTranslation();
    const handlePress = (index) => {
        index === activeIndex ? setActiveIndex(null) : setActiveIndex(index)
    }

    const renderItem = ({ item, index }) => {
        return (
            <StyledTouchableOpacity onPress={() => handlePress(index)} className="p-4  rounded-[18px] border-[1px] border-[#EDEFF3]">
                <StyledView className="flex-row justify-between items-center ">
                    <StyledView className="flex-row gap-4">
                        <FastImage
                            style={{ width: 50, height: 50, borderRadius: 100 }}
                            source={require("../../../assets/images/test-profilepicture.png")}
                        />
                        <StyledView className="">
                            <StyledText className="font-poppi-medium text-base text-[#204F50]">{item.firstname} {item.lastname}</StyledText>
                            <StyledTouchableOpacity>
                                <StyledText className="text-sm text-[#7658F2] font-poppi-semibold">{t("attributes.goToProfile")}</StyledText>
                            </StyledTouchableOpacity>
                        </StyledView>
                    </StyledView>
                    {index === activeIndex ? <ArrowUpIcon /> : <ArrowDownIcon />}
                </StyledView>
                {index === activeIndex &&
                    <StyledView className=" mt-4">
                        <StyledView className="flex-row justify-center border-t-[1px] border-[#EFEFEF]">
                            <StyledTouchableOpacity className="mx-10 mt-4">
                                <AcceptIcon />
                            </StyledTouchableOpacity >
                            <StyledTouchableOpacity className="mx-10 mt-4">
                                <CancelIcon />
                            </StyledTouchableOpacity>
                            <StyledTouchableOpacity onPress={() => {
                                Linking.openURL(item.phone)
                            }} className="mx-10 mt-4">
                                <PhoneIcon />
                            </StyledTouchableOpacity>
                        </StyledView>

                    </StyledView>}
            </StyledTouchableOpacity>
        )

    }

    return (
        <FlatList
            scrollEnabled={true}
            contentContainerStyle={{ gap: 12, paddingBottom: 60 }}
            data={items}
            renderItem={renderItem}
        />
    )
}

export default StudentsAccordion