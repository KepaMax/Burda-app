import Styled from '@common/StyledComponents';
import CustomComponents from '@common/CustomComponents';
import {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {fetchData} from '@utils/fetchData';
import {API_URL} from '@env';

const EditProfile = () => {
  const [formData, setFormData] = useState({});
  const [userId, setUserId] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const {t} = useTranslation();

  const handleInputChange = (name, value) => {
    setFormData(prevState => ({...prevState, [name]: value}));
    console.log(formData);
  };

  const getUserData = async () => {
    setLoadError(false);
    const result = await fetchData({
      url: `${API_URL}/users/me/`,
      tokenRequired: true,
    });

    if (result?.success) {
      setUserId(result.data.id);
      setFormData({
        company: result.data.company,
        email: result.data.email,
        phone_number: result.data.phone_number,
        first_name: result.data.first_name,
        last_name: result.data.last_name,
      });
    } else {
      setLoadError(true);
    }
  };

  const editProfile = async () => {
    if (
      formData.company !== null &&
      typeof formData.company === 'object' &&
      !Array.isArray(formData.company)
    ) {
      console.log("asdasdasda")
      const result = await fetchData({
        url: `${API_URL}/users/${userId}/`,
        tokenRequired: true,
        method: 'PATCH',
        body: {...formData, company: formData.company.id},
      });

      result?.success && alert(t('userSuccessfullyUpdated'));
    }
    const result = await fetchData({
      url: `${API_URL}/users/${userId}/`,
      tokenRequired: true,
      method: 'PATCH',
      body: {...formData, company: formData.company},
    });

    result?.success && alert(t('userSuccessfullyUpdated'));
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      <CustomComponents.Header bgColor="bg-white" title={t('editProfile')} />
      <Styled.ScrollView className="bg-[#F8F8F8] h-full px-4 pt-5">
        {loadError && (
          <Styled.View className="bg-red-50 p-4 rounded-lg mb-4">
            <Styled.Text className="text-red-600 text-center font-poppins-medium mb-2">
              {t('somethingWentWrong')}
            </Styled.Text>
            <Styled.TouchableOpacity
              onPress={getUserData}
              className="bg-red-500 py-2 px-4 rounded-lg self-center">
              <Styled.Text className="text-white font-poppins-medium">
                {t('resend')}
              </Styled.Text>
            </Styled.TouchableOpacity>
          </Styled.View>
        )}
        <Styled.View className="flex-row justify-between">
          <CustomComponents.Input
            inputName="first_name"
            inputValue={formData?.first_name}
            placeholder={t('firstname')}
            width="w-[49%]"
            handleInputChange={handleInputChange}
          />
          <CustomComponents.Input
            inputName="last_name"
            inputValue={formData?.last_name}
            placeholder={t('lastname')}
            width="w-[49%]"
            handleInputChange={handleInputChange}
          />
        </Styled.View>

        <CustomComponents.PhoneInput
          inputValue={formData?.phone_number}
          handleInputChange={handleInputChange}
        />

        <CustomComponents.Dropdown
          margin="mb-3"
          inputName="company"
          placeholder={t('companyName')}
          selectedItem={{
            label: formData?.company?.name,
            value: formData?.company?.id,
          }}
          setSelectedItem={handleInputChange}
        />

        <CustomComponents.Input
          inputName="email"
          inputValue={formData?.email}
          placeholder={t('email')}
          handleInputChange={handleInputChange}
          editable={false}
        />

        <CustomComponents.Button
          bgColor="bg-[#66B600]"
          borderRadius="rounded-[24px]"
          padding="py-3"
          margin="mt-4"
          title={t('save')}
          buttonAction={editProfile}
        />
      </Styled.ScrollView>
    </>
  );
};

export default EditProfile;
