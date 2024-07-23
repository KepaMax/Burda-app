import {
  StyledView,
  StyledTextInput,
  StyledText,
  StyledTouchableOpacity,
} from '@common/StyledComponents';
import {useState} from 'react';
import EyeIcon from '@icons/eye.svg';
import EyeOpenIcon from '@icons/eyeOpen.svg';

const PasswordInput = ({
  inputName,
  inputValue,
  handleInputChange,
  placeholder,
  error,
}) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  return (
    <StyledView className="w-auto relative mb-3">
      <StyledTextInput
        value={inputValue}
        placeholder={placeholder}
        name={inputName}
        placeholderTextColor={error ? '#FF3115' : '#757575'}
        secureTextEntry={!isPasswordVisible}
        onChangeText={value => handleInputChange(inputName, value)}
        className={`border-[1px] text-black py-[10px]  font-poppi text-base placeholder:font-poppi ${
          error
            ? 'border-red-400 bg-red-50'
            : 'border-[#EDEFF3] bg-white focus:border-[#7658F2] focus:bg-[#F3F7FF]'
        } h-[45px] rounded-[18px] px-4`}
      />
      <StyledView className={`absolute top-[10px] right-[10px]`}>
        <StyledTouchableOpacity
          onPress={() => {
            setPasswordVisible(!isPasswordVisible);
          }}>
          {isPasswordVisible ? <EyeOpenIcon /> : <EyeIcon />}
        </StyledTouchableOpacity>
      </StyledView>

      <StyledText
        className={`text-red-400 text-xs font-serrat mt-1 ${
          error ? 'block' : 'hidden'
        }`}>
        {error}
      </StyledText>
    </StyledView>
  );
};

export default PasswordInput;
