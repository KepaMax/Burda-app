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
  const [searchText, setSearchText] = useState('');

  const filteredItems =
    type === 'full'
      ? items.filter(item =>
          item.label.toLowerCase().includes(searchText.toLowerCase()),
        )
      : items;

  return (
    <Styled.View className={`${type === 'full' ? 'w-full' : 'w-[30%]'}`}>
      {/* Select Button */}
      <Styled.TouchableOpacity
        disabled={disabled}
        onPress={() => {
          setDropdownOpen(!dropdownOpen);
          if (dropdownOpen) {
            setSearchText('');
          }
        }}>
        <Styled.View
          className={`border-[1px] px-4 h-[45px] flex-row items-center ${
            type === 'full'
              ? 'rounded-[18px] justify-between'
              : 'rounded-l-[18px] justify-center border-r-0'
          } border-[#EDEFF3] ${
            error
              ? 'border-red-400 bg-red-50'
              : 'border-[#EDEFF3] bg-white focus:border-[#7658F2]'
          } `}>
          <Styled.Text className="text-[#868782] text-poppins font-poppi mr-2">
            {selectedItem ? selectedItem.label : placeholder}
          </Styled.Text>
          <Icons.ArrowUpIconArrowDownIcon />
        </Styled.View>
      </Styled.TouchableOpacity>

      {/* Dropdown */}
      {dropdownOpen && (
        <>
          {/* Search Bar */}
          {type === 'full' && (
            <Styled.View className="border-x-[1px] border-t-0 border-[#EDEFF3] bg-white px-4 py-2">
              <Styled.TextInput
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Search..."
                className="text-[#868782] text-poppins font-poppi border-[1px] border-[#EDEFF3] rounded-[12px] px-3 py-2"
              />
            </Styled.View>
          )}

          {/* Items */}
          <Styled.ScrollView
            nestedScrollEnabled
            style={{height: 150, borderTopWidth: 0}}
            scrollEnabled={true}>
            <Styled.View className="bg-white rounded-b-[18px] border-t-0 border-[1px] border-[#EDEFF3]">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <Styled.TouchableOpacity
                    key={item.value}
                    className={`${
                      index === filteredItems.length - 1
                        ? 'rounded-b-[18px]'
                        : ''
                    } ${
                      selectedItem && item.label === selectedItem.label
                        ? 'bg-[#76F5A4]'
                        : 'bg-transparent'
                    } ${type === 'full' ? '' : 'items-center'}`}
                    onPress={() => {
                      setSelectedItem(item);
                      setDropdownOpen(false);
                      setSearchText('');
                    }}>
                    <Styled.Text className="text-[#868782] text-poppins font-poppi px-4 py-[10px]">
                      {item.label}
                    </Styled.Text>
                  </Styled.TouchableOpacity>
                ))
              ) : (
                <Styled.Text className="text-center text-[#868782] p-4">
                  No results found
                </Styled.Text>
              )}
            </Styled.View>
          </Styled.ScrollView>
        </>
      )}
    </Styled.View>
  );
};

export default CustomSelect;
