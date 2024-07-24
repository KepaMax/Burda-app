import {
  StyledText,
  StyledTextInput,
  StyledTouchableOpacity,
  StyledView,
} from '@common/StyledComponents';
import FastImage from 'react-native-fast-image';
import EditProfileIcon from '@icons/edit-profile.svg';
import {useEffect, useState} from 'react';
import CustomSelect from '@common/CustomSelect';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {API_URL} from '@env';
import {Alert} from 'react-native';
import Input from '@screens/auth/components/Input';
import {prefixData} from '@screens/auth/utils/prefixData';
import InfoIcon from '@icons/info.svg';
import {useNavigation, useRoute} from '@react-navigation/native';
import {request, PERMISSIONS} from 'react-native-permissions';
import {launchImageLibrary} from 'react-native-image-picker';
import {storage} from '@utils/MMKVStore';

const EditProfile = () => {
  const router = useRoute();
  const navigation = useNavigation();
  const {profileData, userType} = router.params;
  const {t} = useTranslation();
  const [selectedPrefix, setSelectedPrefix] = useState(null);
  const [phoneNumValue, setPhoneNumValue] = useState();
  const [formData, setFormData] = useState({});
  const [transformedData, setTransformedData] = useState(null);
  const [errors, setErrors] = useState(null);

  const handleInputChange = (name, value) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleNumberChange = value => {
    setPhoneNumValue(value);
    handleInputChange('mobile', `+994${selectedPrefix?.value}${value}`);
  };

  const handlePhotoSelect = () => {
    request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
    ).then(result => {
      result === 'granted'
        ? launchImageLibrary(
            {
              mediaType: 'photo',
            },
            response => {
              if (!response.didCancel && !response.error) {
                const imgData = response.assets[0];
                setFormData(prevValue => ({
                  ...prevValue,
                  photo: imgData,
                }));
              }
            },
          )
        : alert(
            t('attributes.error'),
            t('attributes.galleryErrorMessage'),
          );
    });
  };

  const transformData = data => {
    console.log('transformData', data);
    const form = new FormData();
    Object.keys(formData).forEach(key => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach(value => {
          form.append(key, value);
        });
      } else if (formData[key] instanceof Object && formData[key].uri) {
        // Handle file upload
        form.append(key, {
          uri: data[key].uri,
          name: data[key].fileName,
          type: data[key].type,
        });
      } else if (key !== 'photo') {
        form.append(key, data[key]);
      }
    });

    setTransformedData(form);
  };

  const updateAccount = async () => {
    const url = `${API_URL}/${
      userType === 'driver' ? 'drivers' : 'nannies'
    }/profile/`;
    const accessToken = storage.getString('accessToken');

    try {
      console.log(transformedData);
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
        body: transformedData,
      });

      if (response.ok) {
        alert(t('attributes.success'));
        navigation.goBack();
      } else {
        alert(t("attributes.error"),t('attributes.errorOccurred'));
      }
    } catch (error) {
      console.error('Error:', error);
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

  useEffect(() => {
    handleInputChange('mobile', `+994${selectedPrefix?.value}${phoneNumValue}`);
  }, [selectedPrefix]);

  useEffect(() => {
    transformData(formData);
  }, [formData]);

  return (
    <StyledView className="flex-1 justify-between bg-white">
      <KeyboardAwareScrollView contentContainerStyle={{padding: 16}}>
        <StyledView className="w-full relative justify-center items-center">
          <StyledView>
            <FastImage
              style={{width: 120, height: 120, borderRadius: 9999}}
              source={{
                uri: formData?.photo,
                priority: FastImage.priority.normal,
              }}
            />

            <StyledTouchableOpacity
              onPress={handlePhotoSelect}
              className="absolute border-[1px] border-[#EDEFF3] rounded-full right-1 bottom-0 z-50">
              <EditProfileIcon />
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>

        <StyledView className="gap-4">
          <StyledView>
            <StyledText className="text-[15px] mb-2 text-[#C0C0BF] font-poppi-medium">
              First name
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
              Last name
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
              Email
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
              Phone number
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
                  onChangeText={value => handleNumberChange(value)}
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
              Work experience
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
              Reference person
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
    </StyledView>
  );
};

export default EditProfile;
