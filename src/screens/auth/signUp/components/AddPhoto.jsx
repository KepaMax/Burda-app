import {
  StyledTouchableOpacity,
  StyledView,
  StyledText,
} from '@common/StyledComponents';
import PhotoIcon from '@icons/add-image.svg';
import {request, PERMISSIONS} from 'react-native-permissions';
import {launchImageLibrary} from 'react-native-image-picker';
import {Alert, Platform} from 'react-native';
import '@locales/index';
import {useTranslation} from 'react-i18next';

const AddPhoto = ({data, setData, error}) => {
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
            },
            response => {
              if (!response.didCancel && !response.error) {
                const imgData = response.assets[0];
                setData(prevValue => ({
                  ...prevValue,
                  photo: imgData,
                }));
              }
            },
          )
        : Alert.alert(
            t('attributes.error'),
            t('attributes.galleryErrorMessage'),
          );
    });
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
          {data
            ? `${data.fileName.slice(0, 20)}...`
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
