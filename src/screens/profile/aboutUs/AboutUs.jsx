import '@locales/index';
import {useTranslation} from 'react-i18next';

const AboutUs = () => {
  const {t} = useTranslation();
  return (
    <StyledView className="flex-1 bg-[#f6f6f6]">
      <StyledText className="bg-white p-4 mx-5 w-auto mt-5 text-[#414141] font-serrat text-base">
        {t('attributes.aboutUsTxt')}
      </StyledText>
    </StyledView>
  );
};

export default AboutUs;
