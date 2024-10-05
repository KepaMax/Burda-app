import {useState} from 'react';
import Styled from './StyledComponents';
import Icons from '@icons/icons.js';

const CustomSelect = ({
  disabled,
  type,
  items,
  placeholder,
  selectedItem,
  setSelectedItem,
  error,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <Styled.TouchableOpacity
      disabled={disabled}
      onPress={() => {
        setDropdownOpen(!dropdownOpen);
      }}
      className={`${type === 'full' ? 'w-full' : 'w-[30%]'}`}>
      {!dropdownOpen ? (
        <Styled.View
          className={`border-[1px] px-4 h-[45px]  flex-row items-center  ${
            type === 'full'
              ? 'rounded-[18px] justify-between'
              : 'rounded-l-[18px]  justify-center border-r-0'
          }  border-[#EDEFF3] ${
            error
              ? 'border-red-400 bg-red-50'
              : 'border-[#EDEFF3] bg-white focus:border-[#7658F2]'
          } `}>
          <Styled.Text className="text-[#868782] text-poppins font-poppi mr-2">
            {selectedItem ? selectedItem.label : placeholder}
          </Styled.Text>
          <Icons.ArrowUpIconArrowDownIcon />
        </Styled.View>
      ) : (
        <>
          <Styled.View
            className={`border-[1px] h-[45px] px-4 py-[12px] flex-row items-center ${
              type === 'full'
                ? 'rounded-t-[18px] justify-between'
                : 'rounded-tl-[18px] justify-center border-r-0'
            }  border-[#EDEFF3]`}>
            <Styled.Text className="text-[#868782] text-poppins font-poppi mr-2">
              {selectedItem ? selectedItem.label : placeholder}
            </Styled.Text>
            <Icons.ArrowUpIcon />
          </Styled.View>
          <Styled.ScrollView
            nestedScrollEnabled
            style={{height: 150, borderTopWidth: 0}}
            scrollEnabled={true}>
            <Styled.View className="bg-white rounded-b-[18px] border-t-0 border-[1px] border-[#EDEFF3]">
              {items.map((item, index) => {
                return (
                  <Styled.TouchableOpacity
                    className={`${
                      index == items.length - 1
                        ? 'rounded-b-[18px]'
                        : 'rounded-b-0'
                    } ${
                      selectedItem && item.label === selectedItem.label
                        ? 'bg-[#76F5A4]'
                        : 'bg-transparent'
                    }  ${type === 'full' ? '' : 'items-center'}`}
                    key={item.value}
                    onPress={() => {
                      setSelectedItem(item);
                      setDropdownOpen(false);
                    }}>
                    <Styled.Text className="text-[#868782] text-poppins font-poppi px-4 py-[10px]">
                      {item.label}
                    </Styled.Text>
                  </Styled.TouchableOpacity>
                );
              })}
            </Styled.View>
          </Styled.ScrollView>
        </>
      )}
    </Styled.TouchableOpacity>
  );
};

export default CustomSelect;
