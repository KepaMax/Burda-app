import Styled from '@common/StyledComponents';
import CustomComponents from '@common/CustomComponents';
import {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {fetchData} from '@utils/fetchData';
import storage from '@utils/MMKVStore';

const EditProfile = () => {
  const [formData, setFormData] = useState({});
  const [userId, setUserId] = useState(null);
  const {t} = useTranslation();

  const handleInputChange = (name, value) => {
    setFormData(prevState => ({...prevState, [name]: value}));
  };

  const getUserData = async () => {
    const result = await fetchData({
      url: 'https://api.myburda.com/api/v1/users/me/',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${storage.getString('accessToken')}`,
      },
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
    }
  };

  const editProfile = async () => {
    const result = await fetchData({
      url: `https://api.myburda.com/api/v1/users/${userId}/`,
      headers: {
        Authorization: `Bearer ${storage.getString('accessToken')}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: formData,
    });

    result?.success && alert('User successfully updated');
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      <CustomComponents.Header bgColor="bg-white" title={t('editProfile')} />
      <Styled.ScrollView className="bg-[#F8F8F8] h-full px-4 pt-5">
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
          inputValue={formData?.company}
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
