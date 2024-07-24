import { Alert } from 'react-native';
import { useState } from 'react';
import {
  StyledView,
  StyledText,
  StyledTouchableOpacity,
} from '@common/StyledComponents';
import { useTranslation } from 'react-i18next';
import '@locales/index';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '@env';
import PasswordInput from '@screens/auth/components/PasswordInput';
import { storage } from '@utils/MMKVStore';
import { jwtDecode } from 'jwt-decode';

const ChangePassword = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    new_password_confirm: '',
  });

  const [errors, setErrors] = useState({
    old_password: '',
    new_password: '',
    new_password_confirm: '',
    noMatch: '',
  });

  const handleInputChange = (name, value) => {
    setFormData(prevValue => ({ ...prevValue, [name]: value }));
  };

  const validate = () => {
    setErrors({
      old_password: '',
      new_password: '',
      new_password_confirm: '',
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
      changePassword();
    }
  };

  const changePassword = async () => {
    if (formData.new_password === formData.new_password_confirm) {
      try {
        const accessToken = storage.getString('accessToken');
        const userType = jwtDecode(accessToken).user_type;
        const url = `${API_URL}/${userType == "nanny" ? "nannies" : "drivers"}/change-password/`;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(formData),
        });

        const jsonData = await response?.json();

        if (response.ok) {
          alert(
            t('attributes.success'),
            t('attributes.passwordChangedSuccessfully'),
            { onConfirm: () => navigation.goBack() },
          );
        } else {
          console.log(response);

          alert(t('attributes.error'), jsonData?.error[0]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    } else {
      alert(t("attributes.error"), t('attributes.passwordNoMatch'));
    }
  };

  return (
    <StyledView className="flex-1 bg-white p-4">
      <StyledText className="mb-4 text-base text-[#204F50] font-poppi-medium">
        {t('attributes.resetPasswordDescr')}
      </StyledText>

      <PasswordInput
        inputName="old_password"
        inputValue={formData.old_password}
        handleInputChange={handleInputChange}
        placeholder={t('attributes.oldPassword')}
        error={errors?.old_password}
      />

      <PasswordInput
        inputName="new_password"
        inputValue={formData.new_password}
        handleInputChange={handleInputChange}
        placeholder={t('attributes.newPassword')}
        error={errors?.new_password}
      />

      <PasswordInput
        inputName="new_password_confirm"
        inputValue={formData.new_password_confirm}
        handleInputChange={handleInputChange}
        placeholder={t('attributes.confirmNewPassword')}
        error={errors?.new_password_confirm}
      />

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

export default ChangePassword;
