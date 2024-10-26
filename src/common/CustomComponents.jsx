import Styled from '@common/StyledComponents';
import {useEffect, useState} from 'react';
import Icons from '@icons/icons.js';
import {useNavigation} from '@react-navigation/native';
import {FlatList} from 'react-native';
import {prefixData} from '@utils/staticData';
import {useTranslation} from 'react-i18next';
import {fetchData} from '@utils/fetchData';
import {useMMKVBoolean} from 'react-native-mmkv';
import {API_URL} from '@env';
import {ScrollView} from 'react-native-gesture-handler';

const Button = ({
  bgColor = 'bg-slate-400',
  borderRadius = 'rounded-lg',
  buttonAction = () => console.log('Button Clicked'),
  padding = 'p-4',
  margin = 'm-0',
  title = 'Click',
  textColor = 'text-white',
  fontWeight = 'font-medium',
  textSize = 'text-base',
  extraBtnStyling = '',
  extraTxtStyling = '',
  icon = null,
  iconPosition = 'left',
  widthInPixels = null,
  // gap = icon ? 'gap-2' : 'gap-0',
}) => {
  return (
    <Styled.TouchableOpacity
      {...(widthInPixels ? {style: {width: widthInPixels}} : {})}
      onPress={buttonAction}
      className={`-z-10 justify-center ${bgColor} ${borderRadius} ${padding} ${margin} ${
        icon && iconPosition === 'right' ? 'flex-row-reverse' : 'flex-row'
      }  ${extraBtnStyling}`}>
      {icon && iconPosition === 'left' && icon}
      <Styled.Text
        className={`text-center ${textColor} ${fontWeight} ${textSize} ${extraTxtStyling}`}>
        {title}
      </Styled.Text>
      {icon && iconPosition === 'right' && icon}
    </Styled.TouchableOpacity>
  );
};

const Input = ({
  inputName,
  inputValue,
  handleInputChange,
  placeholder,
  error,
  icon = null,
  multiline = false,
  width = 'w-auto',
  height,
  padding = 'px-4',
  margin = 'mb-3',
  title = '',
  titleSize = 'text-xs',
  titleColor = 'text-zinc-400',
  titleFontWeight = 'font-regular',
  editable = true
}) => {
  return (
    <Styled.View className={`${width} relative ${margin} -z-10`}>
      {title && (
        <Styled.Text
          className={`${titleSize} ${titleColor} ${titleFontWeight} mb-1`}>
          {title}
        </Styled.Text>
      )}
      <Styled.TextInput
        editable={editable}
        style={{height: height ? height : 45}}
        multiline={multiline}
        value={inputValue}
        placeholder={placeholder}
        name={inputName}
        placeholderTextColor={error ? '#FF3115' : '#868782'}
        onChangeText={value =>
          handleInputChange(
            inputName,
            inputName === 'email' ? value.toLowerCase() : value,
          )
        }
        className={`border-[1px] shadow shadow-zinc-300 text-black font-poppins text-base placeholder:font-poppins ${
          error
            ? 'border-red-400 bg-red-50'
            : 'border-[#EDEFF3] bg-white focus:border-[#66B600]'
        } h-[45px] rounded-[8px] ${padding}`}
      />
      {icon && (
        <Styled.View className="absolute right-[10px] top-[10px]">
          {icon}
        </Styled.View>
      )}
      <Styled.Text
        className={`text-red-400 text-xs font-poppins mt-1 ${
          error && error !== 'ref' ? 'block' : 'hidden'
        }`}>
        {error}
      </Styled.Text>
    </Styled.View>
  );
};

const PasswordInput = ({
  inputName,
  inputValue,
  handleInputChange,
  placeholder,
  error,
  disabled
}) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  return (
    <Styled.View className="w-auto -z-10 relative mb-3">
      <Styled.TextInput
        value={inputValue}
        placeholder={placeholder}
        name={inputName}
        placeholderTextColor={error ? '#FF3115' : '#757575'}
        secureTextEntry={!isPasswordVisible}
        onChangeText={value => handleInputChange(inputName, value)}
        className={`border-[1px] shadow shadow-zinc-300 text-black py-[10px] font-poppins text-base placeholder:font-poppins ${
          error
            ? 'border-red-400 bg-red-50'
            : 'border-[#EDEFF3] bg-white focus:border-[#66B600]'
        } h-[45px] rounded-[8px] px-4`}
      />
      <Styled.View className={`absolute top-[10px] right-[10px]`}>
        <Styled.TouchableOpacity
          onPress={() => {
            setPasswordVisible(!isPasswordVisible);
          }}>
          {!isPasswordVisible ? <Icons.EyeOpen /> : <Icons.EyeClosed />}
        </Styled.TouchableOpacity>
      </Styled.View>

      <Styled.Text
        className={`text-red-400 text-xs font-poppins mt-1 ${
          error ? 'block' : 'hidden'
        }`}>
        {error}
      </Styled.Text>
    </Styled.View>
  );
};

const Link = ({
  title = 'Pass title prop',
  textColor = 'text-blue-600',
  textSize = 'text-sm',
  fontWeight = 'font-medium',
  margin = 'm-0',
  padding = 'p-0',
  textAlign = 'text-left',
  numberOfLines = null,
  linkAction = () => console.log('Link Clicked'),
}) => {
  return (
    <Styled.TouchableOpacity onPress={linkAction} className={`${margin}`}>
      <Styled.Text
        {...(numberOfLines ? {numberOfLines: numberOfLines} : {})}
        className={`${textColor} ${textSize} ${fontWeight} ${textAlign} ${padding}`}>
        {title}
      </Styled.Text>
    </Styled.TouchableOpacity>
  );
};

const Header = ({
  title,
  overlay = false,
  bgColor = 'bg-transparent',
  titleColor = 'text-black',
  navigationScreen = null,
  extraStyles,
  reset,
}) => {
  const navigation = useNavigation();

  return (
    <Styled.View
      className={`w-full ${bgColor} ${
        bgColor !== 'bg-transparent' && 'border-b-[1px] border-zinc-200'
      } items-center ${overlay && 'absolute top-0 z-50'} ${extraStyles}`}>
      <Styled.View className="w-11/12 items-center justify-center flex-row relative">
        {(navigationScreen || navigation.canGoBack()) && (
          <Styled.TouchableOpacity
            hitSlop={{top: 50, right: 50, bottom: 50, left: 50}}
            onPress={() => {
              navigationScreen
                ? navigation.navigate(navigationScreen)
                : navigation.goBack();
            }}
            className="absolute left-0">
            {titleColor === 'text-black' ? (
              <Icons.ArrowBlack />
            ) : (
              <Icons.ArrowWhite />
            )}
          </Styled.TouchableOpacity>
        )}
        <Styled.Text
          numberOfLines={1}
          className={`max-w-[240px] ${titleColor} font-poppins-medium text-[20px] pb-5 pt-6`}>
          {title}
        </Styled.Text>
      </Styled.View>
    </Styled.View>
  );
};

const Dropdown = ({
  inputName,
  disabled = false,
  width = 'w-auto',
  height = 'h-[44px]',
  items = [],
  selectedItem = null,
  setSelectedItem = () => {
    console.log('item selected');
  },
  placeholder = '---',
  margin,
  padding,
  textAlign = 'text-left',
  textColor,
  error,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [companyData, setCompanyData] = useState([]);
  const [companyTitle, setCompanyTitle] = useState('');

  const DropdownItem = ({item}) => {
    return (
      <Styled.TouchableOpacity
        className={`p-2 border-b-[1px] border-zinc-200 ${
          item.label === selectedItem?.label || item.label === companyTitle
            ? 'bg-[#76F5A4]'
            : 'bg-transparent'
        }`}
        key={item.value}
        onPress={() => {
          if (inputName === 'company') {
            setCompanyTitle(item.label);
            setSelectedItem(inputName, item.value);
          } else {
            setSelectedItem(item);
          }
          setDropdownOpen(false);
        }}>
        <Styled.Text className="text-[#868782] text-base font-poppins text-center">
          {item.label}
        </Styled.Text>
      </Styled.TouchableOpacity>
    );
  };

  useEffect(() => {
    const getCompanyData = async () => {
      const result = await fetchData({
        url: `${API_URL}/companies/`,
      });

      if (result?.success) {
        const formattedCompanyData = result?.data.results.map(company => ({
          label: company.name,
          value: company.id,
        }));

        setCompanyData(formattedCompanyData);
        setSelectedItem({
          label: selectedItem?.label,
          value: selectedItem?.value,
        });
      }
    };
    inputName === 'company' && getCompanyData();
  }, []);

  return (
    <Styled.TouchableOpacity
      disabled={disabled}
      onPress={() => {
        setDropdownOpen(prevState => !prevState);
      }}
      className={`${width} ${height} ${margin} ${
        error ? 'border-[1px] border-red-400 bg-red-50' : 'bg-white'
      }  shadow shadow-zinc-300 rounded-[8px]`}>
      <Styled.Text
        className={`w-full ${
          error ? 'text-[#FF3115]' : 'text-[#868782]'
        } text-base leading-[45px] px-3 font-poppins ${textAlign}`}>
        {companyTitle
          ? companyTitle
          : selectedItem?.label
          ? selectedItem.label
          : placeholder}
      </Styled.Text>
      <Styled.View className="absolute right-3 top-3">
        {!dropdownOpen ? <Icons.ArrowDown /> : <Icons.ArrowUp />}
      </Styled.View>

      {dropdownOpen && (
        <Styled.View className="z-10 absolute top-12 w-full h-[120px] bg-white rounded-b-[18px] overflow-hidden border-t-0 border-[1px] border-[#EDEFF3]">
          {/* <FlatList
            nestedScrollEnabled
            data={companyData.length ? companyData : items}
            renderItem={({item}) => <DropdownItem item={item} />}
          /> */}
          <ScrollView nestedScrollEnabled>
            {companyData.length
              ? companyData.map(item => <DropdownItem item={item} />)
              : items.map(item => <DropdownItem item={item} />)}
          </ScrollView>
        </Styled.View>
      )}
    </Styled.TouchableOpacity>
  );
};

const PhoneInput = ({handleInputChange, inputValue, error}) => {
  const [selectedPrefix, setSelectedPrefix] = useState({});
  const [phoneInputValue, setPhoneInputValue] = useState('');
  const [initialFormatDone,setInitialFormatDone] = useState(false);
  const {t} = useTranslation();

  const handlePhoneInputChange = (name, value) => {
    value.length <= 7 && setPhoneInputValue(value);
    handleInputChange(
      'phone_number',
      `+994${selectedPrefix.value}${phoneInputValue}`,
    );
  };

  useEffect(() => {

    initialFormatDone &&
      handleInputChange(
        'phone_number',
        `+994${selectedPrefix.value}${phoneInputValue}`,
      );
  }, [selectedPrefix, phoneInputValue]);

  useEffect(() => {
    if (inputValue && !initialFormatDone) {
      const formatted = {
        prefix: {
          label: '0' + inputValue.slice(4, 6),
          value: inputValue.slice(4, 6),
        },
        
        phoneInputValue: inputValue.slice(6),
      };

      setSelectedPrefix(formatted.prefix);
      setPhoneInputValue(formatted.phoneInputValue);
      setInitialFormatDone(true)
    }
  }, [inputValue]);

  return (
    <Styled.View className="z-30 w-full mb-3">
      <Styled.View className="flex-row justify-between items-center">
        <Dropdown
          items={prefixData}
          inputName="prefix"
          selectedItem={selectedPrefix}
          setSelectedItem={setSelectedPrefix}
          width="w-[29%]"
          placeholder={t('prefix')}
          error={error ? 'ref' : null}
        />
        <Input
          width="w-[69%]"
          margin="m-0"
          inputValue={phoneInputValue}
          handleInputChange={handlePhoneInputChange}
          placeholder={t('phoneNumber')}
          error={error ? 'ref' : null}
        />
      </Styled.View>

      <Styled.Text
        className={`-z-10 text-red-400 text-xs font-poppins mt-1 ${
          error ? 'block' : 'hidden'
        }`}>
        {error}
      </Styled.Text>
    </Styled.View>
  );
};

const CustomComponents = {
  Button: Button,
  Input: Input,
  PasswordInput: PasswordInput,
  Link: Link,
  Header: Header,
  PhoneInput: PhoneInput,
  Dropdown: Dropdown,
};

export default CustomComponents;
