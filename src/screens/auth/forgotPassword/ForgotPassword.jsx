import Styled from '@common/StyledComponents';
import Images from '@images/images';
import {Dimensions} from 'react-native';
import CustomComponents from '@common/CustomComponents';
import {useState} from 'react';
import {openInbox} from 'react-native-email-link';
import {useTranslation} from 'react-i18next';
import {fetchData} from '@utils/fetchData';
import {API_URL} from '@env';

const ForgotPassword = () => {
  const {t} = useTranslation();
  const [formData, setFormData] = useState({});
  const [emailSent, setEmailSent] = useState(false);
  const [errors, setErrors] = useState({});
  const screenWidth = Dimensions.get('screen').width;

  const handleInputChange = (name, value) => {
    setFormData(prevState => ({...prevState, [name]: value}));
  };

  const handleForgotPassword = async () => {
    const result = await fetchData({
      url: `${API_URL}/users/reset-password/`,
      body: formData,
      method: 'POST',
      tokenRequired: true,
      returnsData: false,
    });

    result?.success && setEmailSent(true);
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
        <Styled.Text className="text-[#184639] text-[24px] font-poppins-semibold mb-4 text-center mt-[70px]">
          {t(!emailSent ? 'forgotPassword' : 'checkEmail')}
        </Styled.Text>

        <Styled.Text className="text-black text-base font-poppins-medium mb-4">
          {t(!emailSent ? 'enterRegisteredEmail' : 'emailSent')}
        </Styled.Text>

        {!emailSent && (
          <CustomComponents.Input
            inputName="email"
            inputValue={formData?.email}
            handleInputChange={handleInputChange}
            placeholder={t('email')}
            error={errors?.email}
          />
        )}

        <CustomComponents.Button
          borderRadius="rounded-[24px]"
          padding="p-2.5"
          margin="mt-2"
          bgColor="bg-[#66B600]"
          textSize="text-lg"
          title={t(!emailSent ? 'confirm' : 'openEmail')}
          buttonAction={() => {
            !emailSent ? handleForgotPassword() : openInbox();
          }}
        />
      </Styled.View>
    </Styled.View>
  );
};

export default ForgotPassword;
