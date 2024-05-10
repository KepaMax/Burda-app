import { useState } from 'react';
import { StyledTextInput, StyledTouchableOpacity, StyledView } from './StyledComponents'
import EyeIcon from "../../../assets/icons/eye.svg"
import EyeOffIcon from "../../../assets/icons/eye-off.svg"

const CustomPasswordInput = ({ placeholderColor, editable, classname, value, setValue, placeholder }) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const onChangeText = (text) => {

        setValue(text);
    }

    return (
        <StyledView className={classname}>
            <StyledTextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                editable={editable}
                placeholderTextColor={placeholderColor}
                secureTextEntry={!showPassword}
                className="w-[90%] font-poppi text-base text-black"
            />
            <StyledTouchableOpacity className='w-[10%]' onPress={toggleShowPassword}>
                {showPassword ? <EyeIcon /> : <EyeOffIcon />}
            </StyledTouchableOpacity>
        </StyledView>
    )
}

export default CustomPasswordInput