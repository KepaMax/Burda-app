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
    'Error',
    'Error occurred',
    // t('attributes.error'),
    // t('attributes.galleryErrorMessage'),

    {
      textConfirm: 'Settings',
      textCancel: 'No',
      onConfirm: () => Linking.openSettings(),
    },
  );
};

export const canUseCamera = setCameraAccess => {
  request(
    Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA,
  ).then(result => {
    if (result === 'granted') {
      setCameraAccess(true);
    } else {
      handlePermissionDenied();
    }
  });
};
