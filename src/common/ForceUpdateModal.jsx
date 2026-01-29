import React from 'react';
import {Modal, Linking, Platform} from 'react-native';
import Styled from '@common/StyledComponents';
import {useTranslation} from 'react-i18next';

const ForceUpdateModal = ({visible, latestVersion, releaseNotes, deepLink, isForceUpdate = true, onClose}) => {
  const {t} = useTranslation();

  const handleUpdate = () => {
    if (deepLink) {
      Linking.openURL(deepLink);
    } else {
      // App Store veya Play Store'a yönlendir
      const appStoreUrl = Platform.OS === 'ios' 
        ? 'https://apps.apple.com/az/app/burda-food/id6737226531' // iOS App Store URL'i
        : 'https://play.google.com/store/apps/details?id=com.myburda.burda'; // Android Play Store URL'i
      
      Linking.openURL(appStoreUrl);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={isForceUpdate ? () => {} : onClose} // Force update'te kapatma butonu yok
    >
      <Styled.View className="flex-1 bg-black/70 justify-center items-center px-5">
        <Styled.View className="bg-white rounded-[16px] py-6 px-5 w-full max-w-[340px]">
          {/* Title */}
          <Styled.Text className="text-[#184639] text-xl font-poppins-bold text-center mb-3">
            {t('updateRequired')}
          </Styled.Text>

          {/* Message */}
          <Styled.Text className="text-[#414141] text-base font-poppins-regular text-center mb-4">
            {t('updateRequiredMessage')}
          </Styled.Text>

          {/* Version Info */}
          {latestVersion && (
            <Styled.Text className="text-[#868782] text-sm font-poppins-regular text-center mb-4">
              {t('latestVersion')}: {latestVersion}
            </Styled.Text>
          )}

          {/* Release Notes */}
          {releaseNotes && (
            <Styled.View className="bg-[#F8F8F8] rounded-[8px] p-3 mb-4">
              <Styled.Text className="text-[#414141] text-sm font-poppins-regular">
                {releaseNotes}
              </Styled.Text>
            </Styled.View>
          )}

          {/* Buttons */}
          <Styled.View className="flex-row gap-3">
            {!isForceUpdate && onClose && (
              <Styled.TouchableOpacity
                onPress={onClose}
                className="flex-1 bg-white border-[1px] border-[#868782] rounded-[24px] py-3 px-6 items-center">
                <Styled.Text className="text-[#868782] text-base font-poppins-semibold">
                  {t('later')}
                </Styled.Text>
              </Styled.TouchableOpacity>
            )}
            <Styled.TouchableOpacity
              onPress={handleUpdate}
              className={`${isForceUpdate ? 'w-full' : 'flex-1'} bg-[#66B600] rounded-[24px] py-3 px-6 items-center`}>
              <Styled.Text className="text-white text-base font-poppins-semibold">
                {t('updateApp')}
              </Styled.Text>
            </Styled.TouchableOpacity>
          </Styled.View>
        </Styled.View>
      </Styled.View>
    </Modal>
  );
};

export default ForceUpdateModal;
