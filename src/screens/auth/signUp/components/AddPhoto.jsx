import Styled from '@common/StyledComponents';
import Icons from '@icons/icons.js';
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
      t('error'),
      t('galleryErrorMessage'),

      {
        textConfirm: t('Settings'),
        textCancel: t('profileDeleteNo'),
        onConfirm: () => Linking.openSettings(),
      },
    );
  };

  return (
    <Styled.View className="w-auto mb-3">
      <Styled.TouchableOpacity
        onPress={handlePhotoSelect}
        className={`w-auto border-[1px] py-[10px] ${
          error
            ? 'border-red-400 bg-red-50'
            : 'border-[#EDEFF3] bg-white focus:border-[#7658F2]'
        } focus:bg-[#F3F7FF] h-[45px] rounded-[18px] px-4`}>
        <Styled.Text
          className={`text-base font-poppins  ${
            error ? 'text-[#FF3115]' : 'text-[#757575]'
          }`}>
          {fileName ? `${fileName.slice(0, 20)}...` : t('profileAddPhoto')}
        </Styled.Text>
        <Styled.View className={`absolute top-[12px] right-[12px]`}>
          <Icons.PhotoIcon />
        </Styled.View>
      </Styled.TouchableOpacity>

      <Styled.Text
        className={`text-red-400 text-xs font-poppins mt-1 ${
          error ? 'block' : 'hidden'
        }`}>
        {error}
      </Styled.Text>
    </Styled.View>
  );
};

export default AddPhoto;
