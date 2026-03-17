import Styled from '@common/StyledComponents';
import '@locales/index';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {View, Text} from 'react-native';

const CHECKBOX_SIZE = 22;
const LINK_COLOR = '#66B600';

const AcceptTermsAndConditions = ({accepted, setAccepted}) => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  const openPrivacyPolicy = () => {
    navigation.navigate('WebViewScreen', {
      url: 'https://burda-staticfiles-storage.s3.eu-north-1.amazonaws.com/BURDA+Privacy+policy.pdf',
      title: t('privacyPolicy'),
    });
  };

  const openTermsOfService = () => {
    navigation.navigate('WebViewScreen', {
      url: 'https://burda-staticfiles-storage.s3.eu-north-1.amazonaws.com/BURDA+Terms+and+conditions.pdf',
      title: t('termsOfService'),
    });
  };

  return (
    <Styled.View className="flex-row items-start mb-4" style={{gap: 10}}>
      <Styled.TouchableOpacity
        onPress={() => setAccepted(!accepted)}
        style={{
          width: CHECKBOX_SIZE,
          height: CHECKBOX_SIZE,
          borderWidth: 2,
          borderColor: LINK_COLOR,
          borderRadius: 4,
          backgroundColor: accepted ? LINK_COLOR : 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {accepted && (
          <Text style={{color: 'white', fontSize: 14, fontWeight: '700'}}>✓</Text>
        )}
      </Styled.TouchableOpacity>

      <View style={{flex: 1, paddingTop: 2}}>
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
            fontSize: 14,
            color: '#374151',
          }}>
          {t('iAgreeToThe')}{' '}
          <Text
            onPress={openPrivacyPolicy}
            style={{fontFamily: 'Poppins-Regular', fontSize: 14, color: LINK_COLOR}}>
            {t('privacyPolicy')}
          </Text>
          {t('and')}
          <Text
            onPress={openTermsOfService}
            style={{fontFamily: 'Poppins-Regular', fontSize: 14, color: LINK_COLOR}}>
            {t('termsOfService')}
          </Text>
        </Text>
      </View>
    </Styled.View>
  );
};

export default AcceptTermsAndConditions;
