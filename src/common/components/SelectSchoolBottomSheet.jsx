import {
    StyledView,
    StyledText,
    StyledTouchableOpacity,
    StyledTextInput,
} from "./StyledComponents";
import CheckedIcon from "../../../assets/icons/checked-select-school.svg";
import ArrowRight from "../../../assets/icons/arrow-right-profile.svg";
import ArrowDown from "../../../assets/icons/arrow-down-select.svg";
import MagnifierIcon from "../../../assets/icons/magnifier.svg";
import ResetSearchIcon from "../../../assets/icons/reset-search.svg";
import SendIcon from "../../../assets/icons/send-school.svg";
import { useMemo, useRef, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { FlatList, GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import { KeyboardAvoidingView } from "react-native";
import { KeyboardAwareMixin, KeyboardAwareScrollView, KeyboardAwareSectionList } from "react-native-keyboard-aware-scroll-view";

const SelectSchoolBottomSheet = ({
    data,
    setSelectedOption,
    selectedOption,
    setModalOpen,
    search,
    searchTerm,
    setSearchTerm,
    setShowSelect
}) => {
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['65%'], []);
    const [cantFindSchool, setCantFindSchool] = useState(false);
    const [schoolAddModalOpen, setSchoolAddModalOpen] = useState(false)
    const [newSchool, setNewSchool] = useState('')
    const scrollViewRef = useRef(null);

    const handleClosePress = () => {
        setShowSelect(false);
    };

    const RenderItem = ({ item }) => {
        return (
            <StyledTouchableOpacity
                className="px-[24px]  flex-row justify-between items-center py-3 rounded-[28px] bg-[#EDEFF3]"
                key={item.value}
                onPress={() => {
                    setSelectedOption(item);
                }}
            >
                <StyledText
                    className="text-base text-[#204F50] font-poppi-medium"
                >
                    {item.label}
                </StyledText>
                {selectedOption?.value === item.value && <CheckedIcon />}
            </StyledTouchableOpacity>
        );
    };


    return (
        <StyledView className='bg-black/20 absolute h-full w-screen z-40' >
            <GestureHandlerRootView style={{ flex: 1 }}>
                <BottomSheet
                    ref={bottomSheetRef}
                    index={0}
                    snapPoints={snapPoints}
                    enablePanDownToClose={true}
                    handleIndicatorStyle={{ backgroundColor: '#BEBFC0' }}
                    backgroundStyle={{ backgroundColor: '#fff' }}
                    onClose={() => handleClosePress()}
                >
                    <KeyboardAwareScrollView
                        nestedScrollEnabled
                        ref={scrollViewRef}
                        contentContainerStyle={{ flex: 1 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <StyledView className='p-4 pt-6  w-max h-full'>
                            <StyledText className="text-[#204F50] text-2xl font-poppi-black">Choose school</StyledText>
                            <StyledView className="bg-white border-[1px] my-3 border-[#EDEFF3] rounded-[18px]  px-4 pr-4 w-full items-center flex-row">
                                <MagnifierIcon />
                                <StyledTextInput
                                    placeholderTextColor="#B7B7B7"
                                    onChangeText={(text) => setSearchTerm(text)}
                                    placeholder="Search"
                                    className="text-[#204F50] text-base font-poppi w-[86%] "
                                />
                                <StyledTouchableOpacity onPress={() => setSearchTerm("")}>
                                    <ResetSearchIcon />
                                </StyledTouchableOpacity>
                            </StyledView>
                            <ScrollView contentContainerStyle={{ gap: 8 }}>
                                {data.map((item) => (<RenderItem key={item.value} item={item} />))}
                            </ScrollView>
                            <StyledView className="mt-2">
                                <StyledTouchableOpacity onPress={() => setCantFindSchool(!cantFindSchool)} className="px-[24px]  flex-row justify-between items-center py-3 rounded-[28px] border-[1px] border-[#FDD233] bg-[#FFF9E2]">
                                    <StyledText className="text-base text-[#204F50] font-poppi-medium">Can’t find your School</StyledText>
                                    {cantFindSchool ? <ArrowDown /> : <ArrowRight />}
                                </StyledTouchableOpacity>
                                {cantFindSchool && <StyledView className="flex-row mt-2">
                                    <StyledTextInput placeholder="Write  your school name" placeholderTextColor="#868782"
                                        className="border-[1px] border-[#EDEFF3] rounded-[18px] text-black rounded-r-none w-[85%] px-5 text-base font-poppi-medium" />
                                    <StyledTouchableOpacity onPress={() => setModalOpen(true)} className="rounded-[18px] w-[15%] bg-[#76F5A4] rounded-l-none justify-center items-center">
                                        <SendIcon />
                                    </StyledTouchableOpacity>
                                </StyledView>}
                            </StyledView>
                        </StyledView>
                    </KeyboardAwareScrollView>
                </BottomSheet>
            </GestureHandlerRootView>
        </StyledView>
    );
};

export default SelectSchoolBottomSheet;
