import Styled from '@common/StyledComponents';
import { useTranslation } from 'react-i18next';
import CustomComponents from '@common/CustomComponents';
import { Linking } from 'react-native';

const Support = () => {
  const { t } = useTranslation();

  const handleCallPress = () => {
    Linking.openURL('tel:0771878836');
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:info@myburda.com');
  };

  return (
    <>
      <CustomComponents.Header title={t('help')} bgColor="bg-white" />
      <Styled.View className="flex-1 bg-white p-4">
        <Styled.Text className="text-[#184639] text-xl font-poppins-medium">
          {t('contactInformtation')}
        </Styled.Text>

        <Styled.View className="mt-2">
          <Styled.Text className="text-[#184639] text-base">
            {t('mobileNumber')}
          </Styled.Text>
          <Styled.TouchableOpacity
            onPress={handleCallPress}
            className="border-[1px] mt-1 p-2 border-[#184639] rounded-[6px]">
            <Styled.Text className="text-[#184639] text-sm">
              0771878836
            </Styled.Text>
          </Styled.TouchableOpacity>

          <Styled.Text className="text-[#184639] mt-2 text-base">
            {t('mailAddress')}
          </Styled.Text>
          <Styled.TouchableOpacity
            onPress={handleEmailPress}
            className="border-[1px] mt-1 p-2 border-[#184639] rounded-[6px]">
            <Styled.Text className="text-[#184639] text-sm">
              info@myburda.com
            </Styled.Text>
          </Styled.TouchableOpacity>
        </Styled.View>
      </Styled.View>
    </>
  );
};

export default Support;
