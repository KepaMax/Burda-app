import {request, PERMISSIONS} from 'react-native-permissions';
import {launchImageLibrary} from 'react-native-image-picker';
import {Platform, Linking} from 'react-native';

export const handlePhotoSelect = (setSelectedImage, setSelectedImageUrl) => {
  request(
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.PHOTO_LIBRARY
      : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
  ).then(result => {
    result === 'granted'
      ? launchImageLibrary(
          {
            mediaType: 'photo',
            includeBase64: true,
          },
          response => {
            if (!response.didCancel && !response.error) {
              const imgData = response.assets[0];
              setSelectedImage(imgData.base64);
              setSelectedImageUrl(imgData.uri);
            }
          },
        )
      : handlePermissionDenied();
  });
};

export const handlePermissionDenied = () => {
  alert(
    t('attributes.error'),
    t('attributes.galleryErrorMessage'),

    {
      textConfirm: t('attributes.Settings'),
      textCancel: t('attributes.profileDeleteNo'),
      onConfirm: () => Linking.openSettings(),
    },
  );
};
