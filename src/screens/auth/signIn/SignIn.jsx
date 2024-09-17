import Styled from '@common/StyledComponents';
import Images from '@images/images.js';
import CustomComponents from '@common/CustomComponents';
import {useState} from 'react';
import {Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const SignIn = () => {
  const [formData, setFormData] = useState({});
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
        <Styled.Text className="text-[#184639] text-[32px] font-semibold mb-4">
          Sign in
        </Styled.Text>

        <CustomComponents.Input
          inputName="email"
          inputValue={formData?.email}
          handleInputChange={handleInputChange}
          placeholder="Email"
          error={errors?.email}
        />

        <CustomComponents.PasswordInput
          inputName="password"
          inputValue={formData?.password}
          handleInputChange={handleInputChange}
          placeholder="Password"
          error={errors?.password}
        />

        <CustomComponents.Link
          title="Forgot password?"
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
          title="Sign in"
          // buttonAction={() => {}}
        />

        <CustomComponents.Link
          textAlign="text-center"
          title="Don't have an account?"
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
