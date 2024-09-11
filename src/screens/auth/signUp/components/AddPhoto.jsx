import {
  StyledTouchableOpacity,
  StyledView,
  StyledText,
} from '@common/StyledComponents';
import PhotoIcon from '@icons/add-image.svg';
import {request, PERMISSIONS} from 'react-native-permissions';
import {launchImageLibrary} from 'react-native-image-picker';
import {Linking, Platform} from 'react-native';
import '@locales/index';
import {useTranslation} from 'react-i18next';
import {useState} from 'react';

const AddPhoto = ({setData, error}) => {
  const [fileName, setFileName] = useState('');
  const {t} = useTranslation();

  const handlePhotoSelect = () => {
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
                setData(prevValue => ({
                  ...prevValue,
                  photo: `data:image/jpeg;base64,${response.assets[0].base64}`,
                }));

                setFileName(response.assets[0].fileName);
              }
            },
          )
        : handlePermissionDenied();
    });
  };

  const handlePermissionDenied = () => {
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

  return (
    <StyledView className="w-auto mb-3">
      <StyledTouchableOpacity
        onPress={handlePhotoSelect}
        className={`w-auto border-[1px] py-[10px] ${
          error
            ? 'border-red-400 bg-red-50'
            : 'border-[#EDEFF3] bg-white focus:border-[#7658F2]'
        } focus:bg-[#F3F7FF] h-[45px] rounded-[18px] px-4`}>
        <StyledText
          className={`text-base font-poppi  ${
            error ? 'text-[#FF3115]' : 'text-[#757575]'
          }`}>
          {fileName
            ? `${fileName.slice(0, 20)}...`
            : t('attributes.profileAddPhoto')}
        </StyledText>
        <StyledView className={`absolute top-[12px] right-[12px]`}>
          <PhotoIcon />
        </StyledView>
      </StyledTouchableOpacity>

      <StyledText
        className={`text-red-400 text-xs font-serrat mt-1 ${
          error ? 'block' : 'hidden'
        }`}>
        {error}
      </StyledText>
    </StyledView>
  );
};

export default AddPhoto;
