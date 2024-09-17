import Styled from '@common/StyledComponents';
import Images from '@images/images';
import {Dimensions} from 'react-native';
import CustomComponents from '@common/CustomComponents';
import {useState} from 'react';
import {openInbox} from 'react-native-email-link';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({});
  const [emailSent, setEmailSent] = useState(false);
  const [errors, setErrors] = useState({});
  const screenWidth = Dimensions.get('screen').width;

  const handleInputChange = (name, value) => {
    setFormData(prevState => ({...prevState, [name]: value}));
  };

  return (
    <Styled.View className="h-full bg-[#FAFAFA]">
      <CustomComponents.Header overlay={true} />
      <Styled.Image
        className="h-[120px]"
        style={{width: screenWidth}}
        source={Images.ForgotPasswordHeader}
      />
      <Styled.View className="px-5">
        <Styled.Text className="text-[#184639] text-[24px] font-semibold mb-4 text-center mt-[70px]">
          {!emailSent ? 'Forgot Password?' : 'Check your email'}
        </Styled.Text>

        <Styled.Text className="text-black text-base font-medium mb-4">
          {!emailSent
            ? 'Enter your registered e-mail and click recover account.'
            : 'We have sent a password recover instructions to your email'}
        </Styled.Text>

        {!emailSent && (
          <CustomComponents.Input
            inputName="email"
            inputValue={formData?.email}
            handleInputChange={handleInputChange}
            placeholder="Email"
            error={errors?.email}
          />
        )}

        <CustomComponents.Button
          borderRadius="rounded-[24px]"
          padding="p-2.5"
          margin="mt-2"
          bgColor="bg-[#66B600]"
          textSize="text-lg"
          title={!emailSent ? 'Confirm' : 'Open email app'}
          buttonAction={() => {
            !emailSent ? setEmailSent(true) : openInbox();
          }}
        />
      </Styled.View>
    </Styled.View>
  );
};

export default ForgotPassword;
