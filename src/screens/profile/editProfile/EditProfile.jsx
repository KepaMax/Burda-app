import {
  StyledText,
  StyledTextInput,
  StyledTouchableOpacity,
  StyledView,
  StyledImage,
} from '@common/StyledComponents';
import EditProfileIcon from '@icons/edit-profile.svg';
import {useEffect, useState} from 'react';
import CustomSelect from '@common/CustomSelect';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {API_URL} from '@env';
import Input from '@screens/auth/components/Input';
import {prefixData} from '@screens/auth/utils/prefixData';
import InfoIcon from '@icons/info.svg';
import {useNavigation, useRoute} from '@react-navigation/native';
import {handlePhotoSelect} from '@utils/photoUtils';
import storage from '@utils/MMKVStore';
import {ActivityIndicator} from 'react-native';
import {fetchData} from '@utils/fetchData';

const EditProfile = () => {
  const router = useRoute();
  const navigation = useNavigation();
  const {profileData} = router.params;
  const {t} = useTranslation();
  const [selectedPrefix, setSelectedPrefix] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [phoneNumValue, setPhoneNumValue] = useState();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const updateAccount = async () => {
    const userType = storage.getString('userType');

    delete formData.photo;

    const result = await fetchData({
      url: `${API_URL}/${userType}/profile/`,
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': storage.getString('selectedLanguage'),
        Authorization: `Bearer ${storage.getString('accessToken')}`,
      },
      method: 'PATCH',
      body: {
        ...formData,
        mobile: `+994${selectedPrefix.value}${phoneNumValue}`,
        ...(selectedImage
          ? {photo: `data:image/jpeg;base64,${selectedImage}`}
          : {}),
      },
      setLoading,
    });

    if (result?.success) {
      alert(t('attributes.success'));
      navigation.goBack();
    }
  };

  useEffect(() => {
    setFormData(profileData);
    setPhoneNumValue(profileData.mobile.slice(-7));
    setSelectedPrefix({
      label: `0${profileData.mobile.slice(4, 6)}`,
      value: profileData.mobile.slice(4, 6),
    });
  }, []);

  return (
    <StyledView className="flex-1 justify-between bg-white">
      <KeyboardAwareScrollView contentContainerStyle={{padding: 16}}>
        <StyledView className="w-full relative justify-center items-center">
          <StyledView>
            <StyledImage
              style={{width: 120, height: 120, borderRadius: 100}}
              source={
                selectedImageUrl !== null
                  ? {uri: selectedImageUrl}
                  : profileData.photo !== null
                  ? {uri: profileData.photo}
                  : {
                      uri: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',
                    }
              }
            />

            <StyledTouchableOpacity
              onPress={() => {
                handlePhotoSelect(setSelectedImage, setSelectedImageUrl);
              }}
              className="absolute border-[1px] border-[#EDEFF3] rounded-full right-1 bottom-0 z-50">
              <EditProfileIcon />
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>

        <StyledView className="gap-4">
          <StyledView>
            <StyledText className="text-[15px] mb-2 text-[#C0C0BF] font-poppi-medium">
              {t('attributes.registerParentName')}
            </StyledText>
            <Input
              inputName="name"
              inputValue={formData?.name}
              handleInputChange={handleInputChange}
              placeholder={t('attributes.profileFirstname')}
              error={errors?.name}
            />
          </StyledView>

          <StyledView>
            <StyledText className="text-[15px] mb-2 text-[#C0C0BF] font-poppi-medium">
              {t('attributes.registerParentSurname')}
            </StyledText>
            <Input
              inputName="surname"
              inputValue={formData?.surname}
              handleInputChange={handleInputChange}
              placeholder={t('attributes.profileLastname')}
              error={errors?.surname}
            />
          </StyledView>

          <StyledView>
            <StyledText className="text-[15px] mb-2 text-[#C0C0BF] font-poppi-medium">
              {t('attributes.registerParentEmail')}
            </StyledText>
            <Input
              inputName="email"
              inputValue={formData?.email}
              handleInputChange={handleInputChange}
              placeholder={t('attributes.registerParentEmail')}
              error={errors?.email}
            />
          </StyledView>

          <StyledView>
            <StyledText className="text-[15px] mb-2 text-[#C0C0BF] font-poppi-medium">
              {t('attributes.registerParentNumber')}
            </StyledText>
            <StyledView className="flex-row w-max">
              <CustomSelect
                disabled={false}
                items={prefixData}
                placeholder={'Select'}
                selectedItem={selectedPrefix}
                setSelectedItem={setSelectedPrefix}
              />

              <StyledView className="w-[70%]">
                <StyledTextInput
                  onChangeText={value => setPhoneNumValue(value)}
                  value={phoneNumValue}
                  maxLength={7}
                  keyboardType="numeric"
                  placeholder="Phone number"
                  placeholderTextColor={'#7A7A7A'}
                  editable={true}
                  className={`border-[1px] h-[45px] text-base font-poppi text-black border-[#EDEFF3] rounded-r-[18px] px-4 py-[10px]`}
                />
              </StyledView>
            </StyledView>
          </StyledView>

          <StyledView>
            <StyledText className="text-[15px] mb-2 text-[#C0C0BF] font-poppi-medium">
              {t('attributes.workExperienceTitle')}
            </StyledText>
            <Input
              inputName="work_experience"
              inputValue={formData?.work_experience}
              handleInputChange={handleInputChange}
              placeholder={t('attributes.workExperience')}
              error={errors?.work_experience}
              icon={<InfoIcon />}
              multiline={true}
              height={120}
            />
          </StyledView>

          <StyledView>
            <StyledText className="text-[15px] mb-2 text-[#C0C0BF] font-poppi-medium">
              {t('attributes.referenceTitle')}
            </StyledText>
            <Input
              inputName="reference_detail"
              inputValue={formData?.reference_detail}
              handleInputChange={handleInputChange}
              placeholder={t('attributes.reference')}
              error={errors?.reference_detail}
              icon={<InfoIcon />}
              multiline={true}
              height={75}
            />
          </StyledView>
        </StyledView>
      </KeyboardAwareScrollView>

      <StyledTouchableOpacity
        onPress={updateAccount}
        className="p-[10px] m-4  items-center justify-center rounded-[18px] w-auto bg-[#76F5A4]">
        <StyledText className="font-poppi-semibold text-base text-[#204F50]">
          Save
        </StyledText>
      </StyledTouchableOpacity>

      {loading && (
        <StyledView className="bg-black/20 h-screen z-50 w-screen absolute items-center justify-center pb-32">
          <ActivityIndicator size="large" color="#7658F2" />
        </StyledView>
      )}
    </StyledView>
  );
};

export default EditProfile;
