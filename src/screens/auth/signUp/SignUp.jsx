import Styled from '@common/StyledComponents';
import Images from '@images/images.js';
import CustomComponents from '@common/CustomComponents';
import {useState} from 'react';
import {Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
import {createAccount} from '@utils/authUtils';
import {useMMKVBoolean} from 'react-native-mmkv';

const SignUp = () => {
  const {t} = useTranslation();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useMMKVBoolean('loading');
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('screen').width;

  const handleInputChange = (name, value) => {
    setFormData(prevState => ({...prevState, [name]: value}));
  };
  const navigate = () => {
    navigation.navigate('SignIn');
  };

  return (
    <KeyboardAwareScrollView
      nestedScrollEnabled={true}
      style={{backgroundColor: '#FAFAFA'}}>
      <CustomComponents.Header overlay={true} />
      <Styled.Image
        style={{width: screenWidth}}
        className="h-[316px]"
        source={Images.SignInHeader}
      />
      <Styled.View className="px-5 pb-14">
        <Styled.Text className="text-[#184639] text-[32px] font-poppins-semibold mb-4">
          {t('signUp')}
        </Styled.Text>

        <Styled.View className="flex-row justify-between items-center">
          <CustomComponents.Input
            width="w-[49%]"
            inputName="first_name"
            inputValue={formData?.first_name}
            handleInputChange={handleInputChange}
            placeholder={t('firstname')}
            error={errors?.first_name}
          />

          <CustomComponents.Input
            width="w-[49%]"
            inputName="last_name"
            inputValue={formData?.last_name}
            handleInputChange={handleInputChange}
            placeholder={t('lastname')}
            error={errors?.last_name}
          />
        </Styled.View>

        <CustomComponents.PhoneInput
          handleInputChange={handleInputChange}
          error={errors?.phone_number}
        />

        <CustomComponents.Dropdown
          margin="mb-3"
          inputName="company"
          placeholder={t('companyName')}
          selectedItem={formData?.company}
          setSelectedItem={handleInputChange}
          error={errors?.company}
        />

        <CustomComponents.Input
          inputName="email"
          inputValue={formData?.email}
          handleInputChange={handleInputChange}
          placeholder={t('email')}
          error={errors?.email}
        />

        <CustomComponents.PasswordInput
          inputName="password"
          inputValue={formData?.password}
          handleInputChange={handleInputChange}
          placeholder={t('password')}
          error={errors?.password}
        />

        <CustomComponents.PasswordInput
          inputName="repeat_password"
          inputValue={formData?.repeat_password}
          handleInputChange={handleInputChange}
          placeholder={t('repeatPassword')}
          error={errors?.repeat_password}
        />

        <CustomComponents.Link
          title={t('alreadyHaveAccount')}
          margin="mb-4 mt-2"
          textColor="text-[#184639]"
          fontWeight="font-regular"
          linkAction={() => {
            navigation.navigate('SignIn');
          }}
        />

        <CustomComponents.Button
          borderRadius="rounded-[24px]"
          padding="p-2.5"
          bgColor="bg-[#66B600]"
          textSize="text-lg"
          title={t('completeSignup')}
          buttonAction={() => {
            createAccount({
              formData,
              setErrors,
              setLoading,
              navigate
            });
          }}
        />
      </Styled.View>
    </KeyboardAwareScrollView>
  );
};

export default SignUp;
