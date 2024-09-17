import Styled from '@common/StyledComponents';
import {useState} from 'react';
import Icons from '@icons/icons.js';
import {useNavigation} from '@react-navigation/native';

const StyledButton = ({
  bgColor = 'bg-slate-400',
  borderRadius = 'rounded-lg',
  buttonAction = () => console.log('Button Clicked'),
  padding = 'p-4',
  margin = 'm-0',
  title = 'Click',
  textColor = 'text-white',
  fontWeight = 'font-medium',
  textSize = 'text-base',
}) => {
  return (
    <Styled.TouchableOpacity
      onPress={buttonAction}
      className={`${bgColor} ${borderRadius} ${padding} ${margin}`}>
      <Styled.Text
        className={`text-center ${textColor} ${fontWeight} ${textSize}`}>
        {title}
      </Styled.Text>
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
}) => (
  <Styled.View className={`${width} relative mb-3`}>
    <Styled.TextInput
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
      className={`border-[1px] shadow shadow-zinc-300 text-black font-poppi text-base placeholder:font-poppi ${
        error
          ? 'border-red-400 bg-red-50'
          : 'border-[#EDEFF3] bg-white focus:border-[#66B600]'
      } h-[45px] rounded-[8px] px-4`}
    />
    {icon && (
      <Styled.View className="absolute right-[10px] top-[10px]">
        {icon}
      </Styled.View>
    )}
    <Styled.Text
      className={`text-red-400 text-xs font-serrat mt-1 ${
        error ? 'block' : 'hidden'
      }`}>
      {error}
    </Styled.Text>
  </Styled.View>
);

const PasswordInput = ({
  inputName,
  inputValue,
  handleInputChange,
  placeholder,
  error,
}) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  return (
    <Styled.View className="w-auto relative mb-3">
      <Styled.TextInput
        value={inputValue}
        placeholder={placeholder}
        name={inputName}
        placeholderTextColor={error ? '#FF3115' : '#757575'}
        secureTextEntry={!isPasswordVisible}
        onChangeText={value => handleInputChange(inputName, value)}
        className={`border-[1px] shadow shadow-zinc-300 text-black py-[10px]  font-poppi text-base placeholder:font-poppi ${
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
          {isPasswordVisible ? <Icons.EyeOpen /> : <Icons.EyeClosed />}
        </Styled.TouchableOpacity>
      </Styled.View>

      <Styled.Text
        className={`text-red-400 text-xs font-serrat mt-1 ${
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
  textAlign = 'text-left',
  linkAction = () => console.log('Link Clicked'),
}) => {
  return (
    <Styled.TouchableOpacity onPress={linkAction} className={`${margin}`}>
      <Styled.Text
        className={`${textColor} ${textSize} ${fontWeight} ${textAlign}`}>
        {title}
      </Styled.Text>
    </Styled.TouchableOpacity>
  );
};

const CustomHeader = ({
  title,
  overlay = false,
  bgColor = 'bg-transparent',
  titleColor = 'text-black',
  navigationScreen = null,
}) => {
  const navigation = useNavigation();

  return (
    <Styled.View
      className={`w-full ${bgColor} items-center ${
        overlay && 'absolute top-0 z-50'
      }`}>
      <Styled.View className="w-11/12 items-center justify-center flex-row relative">
        {navigation.canGoBack() && (
          <Styled.TouchableOpacity
            hitSlop={{top: 50, right: 50, bottom: 50, left: 50}}
            onPress={() =>
              navigationScreen
                ? navigation.navigate(navigationScreen)
                : navigation.goBack()
            }
            className="absolute left-0">
            {titleColor === 'text-black' ? (
              <Icons.ArrowBlack />
            ) : (
              <Icons.ArrowWhite />
            )}
          </Styled.TouchableOpacity>
        )}
        <Styled.Text
          className={`${titleColor} font-medium text-[20px] pb-5 pt-6`}>
          {title}
        </Styled.Text>
      </Styled.View>
    </Styled.View>
  );
};

const CustomComponents = {
  Button: StyledButton,
  Input: Input,
  PasswordInput: PasswordInput,
  Link: Link,
  Header: CustomHeader,
};

export default CustomComponents;
