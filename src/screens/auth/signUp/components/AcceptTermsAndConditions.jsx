import {
  StyledView,
  StyledText,
  StyledTouchableOpacity,
} from '@common/StyledComponents';
import TermsConditions from '@icons/termsConditions.svg';
import TermsConditionsFill from '@icons/termsConditionsFill.svg';
import '@locales/index';
import {useTranslation} from 'react-i18next';
import storage from '@utils/MMKVStore';
import {useNavigation} from '@react-navigation/native';

const AcceptTermsAndConditions = ({accepted, setAccepted}) => {
  const {t} = useTranslation();
  const selectedLanguage = storage.getString('selectedLanguage');
  const navigation = useNavigation();

  return (
    <StyledView className="w-auto flex-row px-1 mb-3">
      <StyledTouchableOpacity
        onPress={() => {
          setAccepted(!accepted);
        }}>
        {accepted ? <TermsConditionsFill /> : <TermsConditions />}
      </StyledTouchableOpacity>

      {selectedLanguage === 'az' ? (
        <StyledView className="flex-row px-2 items-center w-full">
          <StyledTouchableOpacity
            onPress={() => {
              navigation.navigate('WebViewScreen', {
                url: 'http://2school.app/open/az/terms_and_conditions/',
                title: 'İstifadəçi qaydaları və şərtləri',
              });
            }}>
            <StyledText className="font-poppi text-xs text-[#204F50] mr-1">
              {t('attributes.termsOfUse')}
            </StyledText>
          </StyledTouchableOpacity>

          <StyledText className="font-poppi text-xs text-[#91919F]">
            {t('attributes.and')}
          </StyledText>

          <StyledTouchableOpacity
            onPress={() => {
              navigation.navigate('WebViewScreen', {
                url: 'https://2school.app/open/az/privacy_policy/',
                title: 'Məxfilik Siyasəti',
              });
            }}>
            <StyledText className="font-poppi text-xs text-[#204F50]">
              {' '}
              {t('attributes.privacyPolicySignUp')}{' '}
            </StyledText>
          </StyledTouchableOpacity>

          <StyledText className="font-poppi text-xs text-[#91919F]">
            {t('attributes.readAndAgreed')}
          </StyledText>
        </StyledView>
      ) : (
        <StyledView className="flex-row px-2 items-center flex-wrap w-full">
          <StyledText className="font-poppi text-xs text-[#91919F]">
            {t('attributes.readAndAgreed')}
          </StyledText>

          <StyledTouchableOpacity
            onPress={() => {
              navigation.navigate('WebViewScreen', {
                url: 'http://2school.app/open/en/terms_and_conditions/',
                title: 'Terms of use',
              });
            }}>
            <StyledText className="font-poppi text-xs text-[#204F50] mr-1">
              {t('attributes.termsOfUse')}
            </StyledText>
          </StyledTouchableOpacity>

          <StyledText className="font-poppi text-xs text-[#91919F]">
            {t('attributes.and')}
          </StyledText>

          <StyledTouchableOpacity
            onPress={() => {
              navigation.navigate('WebViewScreen', {
                url: 'https://2school.app/open/en/privacy_policy/',
                title: 'Privacy Policy',
              });
            }}>
            <StyledText className="font-poppi text-xs text-[#204F50]">
              {t('attributes.privacyPolicySignUp')}
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      )}
    </StyledView>
  );
};

export default AcceptTermsAndConditions;
