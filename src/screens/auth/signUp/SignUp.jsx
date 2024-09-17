import Styled from '@common/StyledComponents';
import Images from '@images/images.js';
import CustomComponents from '@common/CustomComponents';
import {useState} from 'react';
import {Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('screen').width;

  const handleInputChange = (name, value) => {
    setFormData(prevState => ({...prevState, [name]: value}));
  };

  return (
    <KeyboardAwareScrollView style={{backgroundColor: '#FAFAFA'}}>
      <CustomComponents.Header overlay={true} />
      <Styled.Image
        style={{width: screenWidth}}
        className="h-[316px]"
        source={Images.SignInHeader}
      />
      <Styled.View className="px-5">
        <Styled.Text className="text-[#184639] text-[32px] font-semibold mb-4">
          Sign up
        </Styled.Text>

        <Styled.View className="flex-row justify-between items-center">
          <CustomComponents.Input
            width="w-[49%]"
            inputName="firstname"
            inputValue={formData?.firstname}
            handleInputChange={handleInputChange}
            placeholder="First name"
            error={errors?.firstname}
          />

          <CustomComponents.Input
            width="w-[49%]"
            inputName="lastname"
            inputValue={formData?.lastname}
            handleInputChange={handleInputChange}
            placeholder="Last name"
            error={errors?.lastname}
          />
        </Styled.View>

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

        <CustomComponents.PasswordInput
          inputName="repeat_password"
          inputValue={formData?.repeat_password}
          handleInputChange={handleInputChange}
          placeholder="Repeat password"
          error={errors?.repeat_password}
        />

        <CustomComponents.Link
          title="Already have an account?"
          margin="mb-4"
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
          title="Sign up"

          // buttonAction={() => {}}
        />
      </Styled.View>
    </KeyboardAwareScrollView>
  );
};

export default SignUp;
