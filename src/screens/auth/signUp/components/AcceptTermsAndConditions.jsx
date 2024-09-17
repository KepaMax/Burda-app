import Styled from '@common/StyledComponents';
import Icons from '@icons/icons.js';
import '@locales/index';
import {useTranslation} from 'react-i18next';
import storage from '@utils/MMKVStore';
import {useNavigation} from '@react-navigation/native';

const AcceptTermsAndConditions = ({accepted, setAccepted}) => {
  const {t} = useTranslation();
  const selectedLanguage = storage.getString('selectedLanguage');
  const navigation = useNavigation();

  return (
    <Styled.View className="w-auto flex-row px-1 mb-3">
      <Styled.TouchableOpacity
        onPress={() => {
          setAccepted(!accepted);
        }}>
        {accepted ? <Icons.TermsConditionsFill /> : <Icons.TermsConditions />}
      </Styled.TouchableOpacity>

      {selectedLanguage === 'az' ? (
        <Styled.View className="flex-row px-2 items-center w-full">
          <Styled.TouchableOpacity
            onPress={() => {
              navigation.navigate('WebViewScreen', {
                url: 'http://2school.app/open/az/terms_and_conditions/',
                title: 'İstifadəçi qaydaları və şərtləri',
              });
            }}>
            <Styled.Text className="font-poppi text-xs text-[#204F50] mr-1">
              {t('attributes.termsOfUse')}
            </Styled.Text>
          </Styled.TouchableOpacity>

          <Styled.Text className="font-poppi text-xs text-[#91919F]">
            {t('attributes.and')}
          </Styled.Text>

          <Styled.TouchableOpacity
            onPress={() => {
              navigation.navigate('WebViewScreen', {
                url: 'https://2school.app/open/az/privacy_policy/',
                title: 'Məxfilik Siyasəti',
              });
            }}>
            <Styled.Text className="font-poppi text-xs text-[#204F50]">
              {' '}
              {t('attributes.privacyPolicySignUp')}{' '}
            </Styled.Text>
          </Styled.TouchableOpacity>

          <Styled.Text className="font-poppi text-xs text-[#91919F]">
            {t('attributes.readAndAgreed')}
          </Styled.Text>
        </Styled.View>
      ) : (
        <Styled.View className="flex-row px-2 items-center flex-wrap w-full">
          <Styled.Text className="font-poppi text-xs text-[#91919F]">
            {t('attributes.readAndAgreed')}
          </Styled.Text>

          <Styled.TouchableOpacity
            onPress={() => {
              navigation.navigate('WebViewScreen', {
                url: 'http://2school.app/open/en/terms_and_conditions/',
                title: 'Terms of use',
              });
            }}>
            <Styled.Text className="font-poppi text-xs text-[#204F50] mr-1">
              {t('attributes.termsOfUse')}
            </Styled.Text>
          </Styled.TouchableOpacity>

          <Styled.Text className="font-poppi text-xs text-[#91919F]">
            {t('attributes.and')}
          </Styled.Text>

          <Styled.TouchableOpacity
            onPress={() => {
              navigation.navigate('WebViewScreen', {
                url: 'https://2school.app/open/en/privacy_policy/',
                title: 'Privacy Policy',
              });
            }}>
            <Styled.Text className="font-poppi text-xs text-[#204F50]">
              {t('attributes.privacyPolicySignUp')}
            </Styled.Text>
          </Styled.TouchableOpacity>
        </Styled.View>
      )}
    </Styled.View>
  );
};

export default AcceptTermsAndConditions;
