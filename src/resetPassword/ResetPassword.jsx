import { TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { useState } from 'react';
import { StyledView, StyledText, StyledTextInput, StyledTouchableOpacity } from '../common/components/StyledComponents';
import { useTranslation } from 'react-i18next';
import '../locales/index';
import EyeIcon from '../assets/icons/eye.svg';
import EyeOpenIcon from '../assets/icons/eyeOpen.svg';
import { useContext } from 'react';
import AuthContext from '../common/TokenManager';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '@env';

const ResetPassword = () => {
  const { getSupervisorAccessTokenFromMemory, getStudentAccessTokenFromMemory } =
    useContext(AuthContext);
  const navigation = useNavigation();
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setNewPasswordVisible] = useState(false);
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    password: '',
    newPassword: '',
    newPasswordCheck: '',
  });

  const [errors, setErrors] = useState({
    password: '',
    newPassword: '',
    newPasswordCheck: '',
    noMatch: '',
  });

  const handleChange = (name, value) => {
    setFormData(prevValue => ({ ...prevValue, [name]: value }));
  };

  const validate = () => {
    setErrors({
      password: '',
      newPassword: '',
      newPasswordCheck: '',
      noMatch: '',
    });

    let errObj = {};
    const formDataEntries = Object.entries(formData);

    formDataEntries.map(([key, value]) => {
      if (!value.trim()) {
        errObj = {
          ...errObj,
          [key]: t('attributes.fieldEmptyAlert'),
        };
      }
    });

    setErrors(errObj);

    const errorEntries = Object.entries(errObj);

    if (!errorEntries.length) {
      resetPassword();
    }
  };

  const resetPassword = async () => {
    if (formData.newPassword === formData.newPasswordCheck) {
      try {
        const supervisorToken = await getSupervisorAccessTokenFromMemory();
        const studentToken = await getStudentAccessTokenFromMemory();
        const token = studentToken ? studentToken : supervisorToken;
        const url = `${API_URL}users/set_password/`;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            new_password: formData.newPassword,
            current_password: formData.password,
          }),
        });

        if (response.ok) {
          Alert.alert(
            t('attributes.success'),
            t('attributes.passwordChangedSuccessfully'),
            [{ text: 'OK', onPress: () => navigation.goBack() }],
          );
        } else {
          const jsonData = await response?.json();
          Alert.alert(t('attributes.error'), jsonData?.errors[0].detail);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    } else {
      setErrors(prevErrors => ({
        ...prevErrors,
        noMatch: t('attributes.passwordNoMatch'),
      }));
    }
  };

  return (
    <StyledView className="flex-1 bg-white p-4 gap-4">
      <StyledText className="text-base text-[#204F50] font-poppi-medium">
        {t('attributes.resetPasswordDescr')}
      </StyledText>

      <StyledView className="flex-row border-[1px] border-[#EDEFF3] rounded-[18px] justify-center items-center">
        <StyledTextInput
          value={formData.password}
          placeholder={t('attributes.registerParentPassword')}
          placeholderTextColor={"#868782"}
          onChangeText={value => handleChange('password', value)}
          secureTextEntry={!isPasswordVisible}
          className="w-[90%] font-poppi text-base text-black pl-4"
        />
        <StyledTouchableOpacity className='w-[10%]' onPress={() => setPasswordVisible(!isPasswordVisible)}>
          {isPasswordVisible ? <EyeIcon /> : <EyeOpenIcon />}
        </StyledTouchableOpacity>
      </StyledView>
      <StyledText
        className={` text-red-400 ${errors?.password ? 'block' : 'hidden'
          }`}>
        {errors?.password}
      </StyledText>


      <StyledView className="flex-row border-[1px] border-[#EDEFF3] rounded-[18px] justify-center items-center">
        <StyledTextInput
          value={formData.newPassword}
          onChangeText={value => handleChange('newPassword', value)}
          placeholder={t('attributes.newPassword')}
          placeholderTextColor={"#868782"}
          secureTextEntry={!isNewPasswordVisible}
          className="w-[90%] font-poppi text-base text-black pl-4"
        />
        <StyledTouchableOpacity className='w-[10%]' onPress={() => setNewPasswordVisible(!isNewPasswordVisible)}>
          {isNewPasswordVisible ? <EyeIcon /> : <EyeOpenIcon />}
        </StyledTouchableOpacity>
      </StyledView>
      <StyledText
        className={` text-red-400 ${errors?.newPasswordCheck || errors?.noMatch ? 'block' : 'hidden'
          }`}>
        {errors?.newPasswordCheck || errors?.noMatch}
      </StyledText>


      <StyledView className="flex-row border-[1px] border-[#EDEFF3] rounded-[18px] justify-center items-center">
        <StyledTextInput
          value={formData.newPasswordCheck}
          placeholder={t('attributes.confirmNewPassword')}
          placeholderTextColor={"#868782"}
          onChangeText={value => handleChange('newPasswordCheck', value)}
          secureTextEntry={!isNewPasswordVisible}
          className="w-[90%] font-poppi text-base text-black pl-4"
        />
        <StyledTouchableOpacity className='w-[10%]' onPress={() => setPasswordVisible(!isPasswordVisible)}>
          {isNewPasswordVisible ? <EyeIcon /> : <EyeOpenIcon />}
        </StyledTouchableOpacity>
      </StyledView>
      <StyledText
        className={` text-red-400 ${errors?.newPasswordCheck || errors?.noMatch ? 'block' : 'hidden'
          }`}>
        {errors?.newPasswordCheck || errors?.noMatch}
      </StyledText>

      <StyledTouchableOpacity
        onPress={() => {
          validate();
        }}>
        <StyledView className="py-2 bg-[#76F5A4] rounded-[18px]">
          <StyledText className="text-center text-[#204F50] text-base font-poppi-semibold">
            {t('attributes.recoverAccountButton')}
          </StyledText>
        </StyledView>
      </StyledTouchableOpacity>
    </StyledView>
  );
};

export default ResetPassword;
