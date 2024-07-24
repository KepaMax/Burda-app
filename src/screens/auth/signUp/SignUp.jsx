import {TextInput, ActivityIndicator, Alert} from 'react-native';
import {useState, useEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import InfoIcon from '@icons/info.svg';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import '@locales/index';
import {useTranslation} from 'react-i18next';
import {
  StyledText,
  StyledView,
  StyledTouchableOpacity,
} from '@common/StyledComponents';
import CustomSelect from '@common/CustomSelect';
import Input from '../components/Input';
import PasswordInput from '../components/PasswordInput';
import {createAccount} from '@utils/authUtils';
import {prefixData} from '../utils/prefixData';
import AddPhoto from './components/AddPhoto';
import AcceptTermsAndConditions from './components/AcceptTermsAndConditions';

const SignUp = () => {
  const registerType = useRoute().params.registerType;
  const [errors, setErrors] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    mobile: '',
    password: '',
    password_confirm: '',
    photo: null,
    work_experience: '',
    reference_detail: '',
  });
  const [transformedData, setTransformedData] = useState(null);
  const [accepted, setAccepted] = useState(false);
  const navigation = useNavigation();
  const [selectedPrefix, setSelectedPrefix] = useState(null);
  const [loading, setLoading] = useState();
  const {t} = useTranslation();
  const [phoneNumValue, setPhoneNumValue] = useState();

  const handleInputChange = (name, value) => {
    // Check if the name is first_name or last_name
    if (name === 'name' || name === 'surname') {
      // Check if the value contains any numbers
      if (/\d/.test(value)) {
        // If the value contains numbers, do not update the state
        return;
      }
    }

    // Update the state only if the conditions are met
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const checkConditions = async () => {
    try {
      if (!accepted) {
        alert(t('attributes.warning'),t('attributes.readTermsConditionsAlert'));
        return;
      }

      if (!selectedPrefix) {
        setErrors(prevState => ({
          ...prevState,
          prefix: t('attributes.mustChoosePrefix'),
        }));
        throw new Error(t('attributes.mustChoosePrefix'));
      }

      if (
        formData.password &&
        formData.password_confirm !== formData.password
      ) {
        setErrors({
          ...errors,
          password_confirm: t('attributes.passwordNoMatch'),
        });
        setPasswordVisible(true);
        throw new Error(t('attributes.passwordNoMatch'));
      }

      const accountInfo = await createAccount(
        registerType,
        transformedData,
        setLoading,
      );

      if (!accountInfo?.status) {
        setErrors(accountInfo?.data);
      } else {
        setErrors(null);
        navigation.navigate('HomePage');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleNumberChange = value => {
    setPhoneNumValue(value);
    handleInputChange('mobile', `+994${selectedPrefix?.value}${value}`);
  };

  

  const transformData = data => {
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
      } else {
        form.append(key, data[key]);
      }
    });
    setTransformedData(form);
  };

  useEffect(() => {
    transformData(formData);
  }, [formData]);

  return (
    <StyledView className="flex-1 bg-white">
      <StyledView
        className={`${
          loading ? 'block pb-40' : 'hidden'
        } w-screen h-screen bg-black/20 z-50 absolute items-center justify-center`}>
        <ActivityIndicator size="large" color="#0079E9" />
      </StyledView>
      <KeyboardAwareScrollView
        style={{
          padding: 16,
        }}>
        <StyledText className="font-poppi-medium text-base text-[#C0C0BF] mb-3">
          {t('attributes.registerInfoParentTitle')}
        </StyledText>

        <Input
          inputName="name"
          inputValue={formData.name}
          handleInputChange={handleInputChange}
          placeholder={t('attributes.profileFirstname')}
          error={errors?.name}
        />

        <Input
          inputName="surname"
          inputValue={formData.surname}
          handleInputChange={handleInputChange}
          placeholder={t('attributes.profileLastname')}
          error={errors?.surname}
        />

        <StyledView className="w-auto mb-3">
          <StyledView className="flex-row">
            <CustomSelect
              items={prefixData}
              selectedItem={selectedPrefix}
              setSelectedItem={setSelectedPrefix}
              placeholder={t('attributes.profileSelect')}
              disabled={false}
              error={errors?.prefix}
            />
            <StyledView className="w-[70%]">
              <TextInput
                maxLength={7}
                keyboardType="numeric"
                value={phoneNumValue}
                placeholder={t('attributes.profileNumber')}
                name="mobile"
                placeholderTextColor={errors?.mobile ? '#FF3115' : '#757575'}
                onChangeText={value => handleNumberChange(value)}
                className={`border-[1px] h-[50px] text-black py-[8px] font-poppi text-base placeholder:font-poppi ${
                  errors?.mobile
                    ? 'border-red-400 bg-red-50'
                    : 'border-[#EDEFF3] bg-white focus:border-[#7658F2] focus:bg-[#F3F7FF]'
                } h-[45px]  rounded-[18px] rounded-l-none px-4`}
              />
            </StyledView>
          </StyledView>

          <StyledText
            className={`text-red-400 text-xs font-serrat mt-1 ${
              errors?.mobile || errors?.prefix ? 'block' : 'hidden'
            }`}>
            {errors?.mobile || errors?.prefix}
          </StyledText>
        </StyledView>

        <Input
          inputName="email"
          inputValue={formData.email}
          handleInputChange={handleInputChange}
          placeholder={t('attributes.registerParentEmail')}
          error={errors?.email}
        />

        <PasswordInput
          inputName="password"
          inputValue={formData.password}
          handleInputChange={handleInputChange}
          placeholder={t('attributes.registerParentPassword')}
          error={errors?.password}
        />

        <PasswordInput
          inputName="password_confirm"
          inputValue={formData.password_confirm}
          handleInputChange={handleInputChange}
          placeholder={t('attributes.confirmPassword')}
          error={errors?.password_confirm}
        />

        <AddPhoto
          data={formData.photo}
          setData={setFormData}
          error={errors?.photo}
        />

        <Input
          inputName="work_experience"
          inputValue={formData.work_experience}
          handleInputChange={handleInputChange}
          placeholder={t('attributes.workExperience')}
          error={errors?.work_experience}
          icon={<InfoIcon />}
          multiline={true}
          height={120}
        />

        <Input
          inputName="reference_detail"
          inputValue={formData.reference_detail}
          handleInputChange={handleInputChange}
          placeholder={t('attributes.reference')}
          error={errors?.reference_detail}
          icon={<InfoIcon />}
          multiline={true}
          height={75}
        />

        <StyledTouchableOpacity
          onPress={() => {
            navigation.navigate('SignIn');
          }}>
          <StyledText className="font-poppi text-sm text-[#204F50] ml-1 mb-4">
            {t('attributes.registerSignIn')}
          </StyledText>
        </StyledTouchableOpacity>

        <AcceptTermsAndConditions
          accepted={accepted}
          setAccepted={setAccepted}
        />

        <StyledTouchableOpacity
          className="bg-[#76F5A4] rounded-[18px] p-[10px] mt-5 mb-20"
          onPress={checkConditions}>
          <StyledText className="text-center text-[#204F50] text-base font-poppi-semibold">
            {t('attributes.verify')}
          </StyledText>
        </StyledTouchableOpacity>
      </KeyboardAwareScrollView>
    </StyledView>
  );
};

export default SignUp;
