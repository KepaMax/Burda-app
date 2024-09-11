import {useState} from 'react';
import {
  StyledView,
  StyledText,
  StyledTouchableOpacity,
} from '@common/StyledComponents';
import {useTranslation} from 'react-i18next';
import '@locales/index';
import {useNavigation, useRoute} from '@react-navigation/native';
import {API_URL} from '@env';
import storage from '@utils/MMKVStore';
import {fetchData} from '@utils/fetchData';
import PasswordInput from '../components/PasswordInput';

const ResetPasswordSignIn = () => {
  const route = useRoute();
  const {uuid, token} = route.params;
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [formData, setFormData] = useState({
    password: '',
    password_confirm: '',
  });
  const [errors, setErrors] = useState({
    password: '',
    password_confirm: '',
    noMatch: '',
  });

  const handleChange = (name, value) => {
    setFormData(prevValue => ({...prevValue, [name]: value}));
  };

  const validate = () => {
    setErrors({
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
    if (formData.password === formData.password_confirm) {
      const userType = storage.getString('userType');

      const result = await fetchData({
        url: `${API_URL}/${userType}/reset/complete/${uuid}/${token}/`,
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': storage.getString('selectedLanguage'),
          Authorization: `Bearer ${storage.getString('accessToken')}`,
        },
        method: 'POST',
        body: formData,
        setLoading,
      });

      result?.success
        ? alert(
            t('attributes.success'),
            t('attributes.passwordChangedSuccessfully'),
            {
              onConfirm: () => navigation.goBack(),
            },
          )
        : alert(t('attributes.error'), result.error);
    } else {
      setErrors(prevErrors => ({
        ...prevErrors,
        noMatch: t('attributes.passwordNoMatch'),
      }));
    }
  };

  return (
    <StyledView className="flex-1 bg-white p-4">
      <StyledText className="text-base text-[#204F50] font-medium mb-4">
        {t('attributes.resetPasswordDescr')}
      </StyledText>

      <PasswordInput
        inputName="password"
        inputValue={formData.password}
        handleInputChange={handleChange}
        placeholder={t('attributes.newPassword')}
        error={errors?.password ? errors?.password : errors?.noMatch}
      />

      <PasswordInput
        inputName="password_confirm"
        inputValue={formData.password_confirm}
        handleInputChange={handleChange}
        placeholder={t('attributes.confirmNewPassword')}
        error={
          errors?.password_confirm ? errors?.password_confirm : errors?.noMatch
        }
      />

      <StyledTouchableOpacity
        className="py-3 bg-[#76F5A4] rounded-[18px] mt-2"
        onPress={() => {
          validate();
        }}>
        <StyledText className="text-center text-[#204F50] text-base font-poppi-semibold">
          {t('attributes.recoverAccountButton')}
        </StyledText>
      </StyledTouchableOpacity>
    </StyledView>
  );
};

export default ResetPasswordSignIn;
