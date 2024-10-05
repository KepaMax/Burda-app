import Styled from '@common/StyledComponents';
import Images from '@images/images.js';
import CustomComponents from '@common/CustomComponents';
import {useState} from 'react';
import {Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
import {login} from '@utils/authUtils';
import {useMMKVBoolean} from 'react-native-mmkv';

const SignIn = () => {
  const {t} = useTranslation();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useMMKVBoolean('loading');
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('screen').width;

  const handleInputChange = (name, value) => {
    setFormData(prevState => ({...prevState, [name]: value}));
  };

  return (
    <KeyboardAwareScrollView style={{backgroundColor: '#FAFAFA'}}>
      <Styled.Image
        style={{width: screenWidth}}
        className="h-[316px]"
        source={Images.SignInHeader}
      />
      <Styled.View className="px-5">
        <Styled.Text className="text-[#184639] text-[32px] font-poppins-semibold mb-4">
          {t('signIn')}
        </Styled.Text>

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

        <CustomComponents.Link
          title={t('forgotPassword')}
          margin="mb-4"
          textColor="text-[#184639]"
          fontWeight="font-regular"
          linkAction={() => {
            navigation.navigate('ForgotPassword');
          }}
        />

        <CustomComponents.Button
          borderRadius="rounded-[24px]"
          padding="p-2.5"
          bgColor="bg-[#66B600]"
          textSize="text-lg"
          title={t('enter')}
          buttonAction={() => {
            login({
              formData,
              setErrors,
              setLoading,
            });
          }}
        />

        <CustomComponents.Link
          textAlign="text-center"
          title={t('noAccount')}
          margin="mb-4 mt-6"
          textColor="text-[#184639]"
          fontWeight="font-regular"
          linkAction={() => {
            navigation.navigate('SignUp');
          }}
        />
      </Styled.View>
    </KeyboardAwareScrollView>
  );
};

export default SignIn;
