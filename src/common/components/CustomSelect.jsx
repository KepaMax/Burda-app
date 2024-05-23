import { useState } from 'react';
import { StyledText, StyledTouchableOpacity, StyledView } from './StyledComponents';
import ArrowDownIcon from "../../../assets/icons/arrow-down-select.svg"
import ArrowUpIcon from "../../../assets/icons/arrow-up-select.svg"
import { ScrollView } from 'react-native';

const CustomSelect = ({ disabled, type, items, placeholder, selectedItem, setSelectedItem }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <StyledTouchableOpacity
            disabled={disabled}
            onPress={() => {
                setDropdownOpen(!dropdownOpen);
            }}
            className={`${type === "full" ? "w-full" : "w-[30%]"}`}
        >
            {!dropdownOpen ? (
                <StyledView className={`border-[1px] px-4 h-[45px]  flex-row items-center  ${type === "full" ? "rounded-[18px] justify-between" : "rounded-l-[18px]  justify-center border-r-0"}  border-[#EDEFF3] `}>
                    <StyledText className="text-[#868782] text-base font-poppi mr-2">
                        {selectedItem ? selectedItem.label : placeholder}
                    </StyledText>
                    <ArrowDownIcon />
                </StyledView>
            ) : (
                <>
                    <StyledView className={`border-[1px] h-[45px] px-4 py-[12px] flex-row items-center ${type === "full" ? "rounded-t-[18px] justify-between" : "rounded-tl-[18px] justify-center border-r-0"}  border-[#EDEFF3]`}>
                        <StyledText className="text-[#868782] text-base font-poppi mr-2">
                            {selectedItem ? selectedItem.label : placeholder}
                        </StyledText>
                        <ArrowUpIcon />
                    </StyledView>
                    <ScrollView nestedScrollEnabled style={{ height: 150, borderTopWidth: 0 }} scrollEnabled={true}>
                        <StyledView className="bg-white rounded-b-[18px] border-t-0 border-[1px] border-[#EDEFF3]">
                            {items.map((item, index) => {
                                return (
                                    <StyledTouchableOpacity
                                        className={`${index == items.length - 1 ? "rounded-b-[18px]" : "rounded-b-0"} ${selectedItem && item.label === selectedItem.label ? "bg-[#76F5A4]" : "bg-transparent"}  ${type === "full" ? '' : "items-center"}`}
                                        key={item.value}
                                        onPress={() => {
                                            setSelectedItem(item);
                                            setDropdownOpen(false);
                                        }}
                                    >
                                        <StyledText className="text-[#868782] text-base font-poppi px-4 py-[10px]">
                                            {item.label}
                                        </StyledText>
                                    </StyledTouchableOpacity>
                                );
                            })}
                        </StyledView>
                    </ScrollView>
                </>
            )}
        </StyledTouchableOpacity>
    )
}

export default CustomSelect