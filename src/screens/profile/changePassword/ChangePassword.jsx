import Styled from '@common/StyledComponents';
import CustomComponents from '@common/CustomComponents';
import {useTranslation} from 'react-i18next';
import {useState} from 'react';
import {API_URL} from '@env';
import {fetchData} from '../../../utils/fetchData';
import {useNavigation} from '@react-navigation/native';

const ChangePassword = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [formData, setFormData] = useState({});

  const handleInputChange = (name, value) => {
    setFormData(prevState => ({...prevState, [name]: value}));
  };

  const changePassword = async () => {
    const result = await fetchData({
      url: `${API_URL}/users/set-password/`,
      tokenRequired: true,
      method: 'POST',
      body: {...formData},
      returnsData: false,
    });

    if (result.success) {
      alert(t('success'), t('passwordUpdated'), {
        textConfirm: t('Ok'),
        onConfirm: () => navigation.navigate('ProfileScreen'),
      });
    }
    else{
      alert(t('error'), t('changePasswordError'), {
        textConfirm: t('Ok'),
      });
    }
  };

  return (
    <>
      <CustomComponents.Header title={t('changePassword')} bgColor="bg-white" />

      <Styled.View className="px-4">
        <Styled.Text className="font-poppins-medium text-base text-black my-4">
          {t('changePasswordInfo')}
        </Styled.Text>

        <CustomComponents.PasswordInput
          inputValue={formData?.current_password}
          inputName="current_password"
          handleInputChange={handleInputChange}
          placeholder={t('oldPassword')}
        />

        <CustomComponents.PasswordInput
          inputValue={formData?.new_password}
          inputName="new_password"
          placeholder={t('newPassword')}
          handleInputChange={handleInputChange}
        />

        <CustomComponents.Button
          title={t('confirm')}
          borderRadius="rounded-[24px]"
          textSize="text-lg"
          buttonAction={() => changePassword()}
          bgColor="bg-[#66B600]"
          padding="py-2"
          margin="mt-2"
        />
      </Styled.View>
    </>
  );
};

export default ChangePassword;
