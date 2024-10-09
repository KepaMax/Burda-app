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
                url: 'https://burda-staticfiles-storage.s3.eu-north-1.amazonaws.com/BURDA+Terms+and+conditions.pdf',
                title: 'İstifadəçi qaydaları və şərtləri',
              });
            }}>
            <Styled.Text className="font-poppins text-xs text-[#204F50] mr-1">
              {t('termsOfUse')}
            </Styled.Text>
          </Styled.TouchableOpacity>

          <Styled.Text className="font-poppins text-xs text-[#91919F]">
            {t('and')}
          </Styled.Text>

          <Styled.TouchableOpacity
            onPress={() => {
              navigation.navigate('WebViewScreen', {
                url: 'https://burda-staticfiles-storage.s3.eu-north-1.amazonaws.com/BURDA+Privacy+policy.pdf',
                title: 'Məxfilik Siyasəti',
              });
            }}>
            <Styled.Text className="font-poppins text-xs text-[#204F50]">
              {' '}
              {t('privacyPolicySignUp')}{' '}
            </Styled.Text>
          </Styled.TouchableOpacity>

          <Styled.Text className="font-poppins text-xs text-[#91919F]">
            {t('readAndAgreed')}
          </Styled.Text>
        </Styled.View>
      ) : (
        <Styled.View className="flex-row px-2 items-center flex-wrap w-full">
          <Styled.Text className="font-poppins text-xs text-[#91919F]">
            {t('readAndAgreed')}
          </Styled.Text>

          <Styled.TouchableOpacity
            onPress={() => {
              navigation.navigate('WebViewScreen', {
                url: 'https://burda-staticfiles-storage.s3.eu-north-1.amazonaws.com/BURDA+Terms+and+conditions.pdf',
                title: 'Terms of use',
              });
            }}>
            <Styled.Text className="font-poppins text-xs text-[#204F50] mr-1">
              {t('termsOfUse')}
            </Styled.Text>
          </Styled.TouchableOpacity>

          <Styled.Text className="font-poppins text-xs text-[#91919F]">
            {t('and')}
          </Styled.Text>

          <Styled.TouchableOpacity
            onPress={() => {
              navigation.navigate('WebViewScreen', {
                url: 'https://burda-staticfiles-storage.s3.eu-north-1.amazonaws.com/BURDA+Privacy+policy.pdf',
                title: 'Privacy Policy',
              });
            }}>
            <Styled.Text className="font-poppins text-xs text-[#204F50]">
              {t('privacyPolicySignUp')}
            </Styled.Text>
          </Styled.TouchableOpacity>
        </Styled.View>
      )}
    </Styled.View>
  );
};

export default AcceptTermsAndConditions;
