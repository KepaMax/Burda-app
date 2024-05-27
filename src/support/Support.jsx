import { Text, View, Linking, TouchableOpacity } from 'react-native';
import { useContext, useState, useEffect } from 'react';
import AuthContext from '../common/TokenManager';
import { styled } from 'nativewind';
import '../locales/index';
import PhoneIcon from "../../assets/icons/phone-icon.svg"
import { useTranslation } from 'react-i18next';
import { StyledTouchableOpacity } from '../common/components/StyledComponents';

const StyledText = styled(Text);
const StyledView = styled(View);

const Support = () => {
  const { getLanguage } = useContext(AuthContext);
  const [activeLang, setActiveLang] = useState();
  const { t } = useTranslation();

  const sendEmail = () => {
    // Replace the email address and subject with your desired values
    const email = 'support@tredu.io';
    const subject = 'Support';

    const mailtoLink = `mailto:${email}?subject=${subject}`;

    Linking.openURL(mailtoLink).catch(err =>
      console.error('An error occurred', err),
    );
  };

  const callPhoneNumber = () => {
    // Replace the phone number with the desired number
    const phoneNumber = '*7788';

    const telLink = `tel:${phoneNumber}`;

    Linking.openURL(telLink).catch(err =>
      console.error('An error occurred', err),
    );
  };

  useEffect(() => {
    const currentLanguage = async () => {
      lang = await getLanguage();
      if (lang) {
        if (lang === 'az') {
          setActiveLang('az');
        } else {
          setActiveLang('en');
        }
      }
    };
    currentLanguage();
  }, []);

  return (
    <StyledView className="flex-1 bg-white p-4 gap-2">
      <StyledText className='font-poppi-bold text-lg text-[#204F50]'>{t("attributes.haveQuestions")}</StyledText>
      <StyledText className='text-sm text-[#868782] font-poppi'>{t("attributes.reachUs")}</StyledText>
      <StyledTouchableOpacity onPress={()=>Linking.openURL("tel:+994000000000")} className='px-2 py-3 flex-row border-[1px] border-[#EDEFF3] items-center rounded-[18px]'>
        <PhoneIcon />
        <StyledText className='text-black font-poppi-medium text-[17px] ml-2'>+994.......</StyledText>
      </StyledTouchableOpacity>
    </StyledView>
  );
};

export default Support;
