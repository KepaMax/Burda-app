import {
  StyledView,
  StyledText,
  StyledTouchableOpacity,
} from '@common/StyledComponents';
import TermsConditions from '@icons/termsConditions.svg';
import TermsConditionsFill from '@icons/termsConditionsFill.svg';
import '@locales/index';
import { useTranslation } from 'react-i18next';
import { storage } from '../../../../utils/MMKVStore';

const AcceptTermsAndConditions = ({ accepted, setAccepted }) => {
  const { t } = useTranslation();
  const lang = storage.getString("selectedLanguage")

  return (
    <StyledView className="w-auto flex-row px-1 mb-3">
      {lang === "az" ? <>
        <StyledTouchableOpacity
          onPress={() => {
            setAccepted(!accepted);
          }}>
          {accepted ? <TermsConditionsFill /> : <TermsConditions />}
        </StyledTouchableOpacity>

        <StyledView className="flex-row px-2 items-center flex-wrap w-full">


          <StyledTouchableOpacity
            onPress={() => {
              navigation.navigate('TermsAndConditions');
            }}>
            <StyledText className="font-poppi text-sm text-[#204F50] mr-1">
              {t('attributes.termsOfUse')}
            </StyledText>
          </StyledTouchableOpacity>

          <StyledText className="font-poppi text-sm text-[#91919F]">
            {t('attributes.and')}
          </StyledText>

          <StyledTouchableOpacity
            onPress={() => {
              navigation.navigate('PrivacyPolicy');
            }}>
            <StyledText className="font-poppi  text-sm text-[#204F50]">
              {' '}{t('attributes.privacyPolicySignUp')}
            </StyledText>
          </StyledTouchableOpacity>

          <StyledTouchableOpacity
            onPress={() => {
              navigation.navigate('TermsAndConditionsSignup');
            }}></StyledTouchableOpacity>

          <StyledText className="font-poppi text-sm text-[#91919F]">
            {t('attributes.readAndAgreed')}
          </StyledText>
        </StyledView>
      </> :
        <>
          <StyledTouchableOpacity
            onPress={() => {
              setAccepted(!accepted);
            }}>
            {accepted ? <TermsConditionsFill /> : <TermsConditions />}
          </StyledTouchableOpacity>

          <StyledView className="flex-row px-2 items-center flex-wrap w-full">
            <StyledText className="font-poppi text-sm text-[#91919F]">
              {t('attributes.readAndAgreed')}
            </StyledText>

            <StyledTouchableOpacity
              onPress={() => {
                navigation.navigate('TermsAndConditions');
              }}>
              <StyledText className="font-poppi text-sm text-[#204F50] mr-1">
                {t('attributes.termsOfUse')}
              </StyledText>
            </StyledTouchableOpacity>

            <StyledText className="font-poppi text-sm text-[#91919F]">
              {t('attributes.and')}
            </StyledText>

            <StyledTouchableOpacity
              onPress={() => {
                navigation.navigate('PrivacyPolicy');
              }}>
              <StyledText className="font-poppi  text-sm text-[#204F50]">
                {t('attributes.privacyPolicySignUp')}
              </StyledText>
            </StyledTouchableOpacity>

            <StyledTouchableOpacity
              onPress={() => {
                navigation.navigate('TermsAndConditionsSignup');
              }}></StyledTouchableOpacity>
          </StyledView>
        </>}
    </StyledView>
  );
};

export default AcceptTermsAndConditions;
