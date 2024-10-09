import Styled from '@common/StyledComponents';
import {canUseCamera} from '@utils/photoUtils';
import {useState, useEffect} from 'react';
import {Dimensions} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import {codeTypes} from '@utils/staticData';
import {useTranslation} from 'react-i18next';
import {useMMKVString} from 'react-native-mmkv';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {fetchData} from '@utils/fetchData';
import storage from '@utils/MMKVStore';
import CustomComponents from '@common/CustomComponents';

const Scan = () => {
  const screenWidth = Dimensions.get('screen').width;
  const [cameraAccess, setCameraAccess] = useState(false);
  const device = useCameraDevice('back', {
    physicalDevices: [
      'ultra-wide-angle-camera',
      'wide-angle-camera',
      'telephoto-camera',
    ],
  });
  const [scannedItems, setScannedItems] = useMMKVString('scannedItems');
  const [scannedOnce, setScannedOnce] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const {t} = useTranslation();

  const codeScanner = useCodeScanner({
    codeTypes: codeTypes,
    onCodeScanned: codes => {
      if (!scannedOnce) {
        const barcode = codes[0].value;
        getMealId(barcode);
        setScannedOnce(true);
        setCameraActive(false);
      }
    },
  });

  const getMealId = async barcode => {
    const result = await fetchData({
      url: `https://api.myburda.com/api/v1/meals/${barcode}/`,
    });

    result?.success &&
      navigation.navigate('HomeStack', {
        screen: 'Basket',
        params: {mealId: result.data.id},
      });
  };

  useEffect(() => {
    canUseCamera(setCameraAccess);
  }, []);

  useEffect(() => {
    if (isFocused) {
      setScannedOnce(false);
      setCameraActive(true);
    }
  }, [isFocused]);

  return (
    <Styled.View className="h-full">
      <CustomComponents.Header overlay />
      {cameraAccess ? (
        <Styled.View className="h-full">
          <Styled.Text className="text-black text-2xl font-poppins-semibold mt-10 text-center">
            {t('scanFood')}
          </Styled.Text>
          <Camera
            codeScanner={codeScanner}
            style={{width: screenWidth, height: screenWidth}}
            device={device}
            isActive={cameraActive && isFocused}
          />
        </Styled.View>
      ) : (
        <Styled.Text className="font-poppins-medium text-base">
          {t('noCameraAccess')}
        </Styled.Text>
      )}
    </Styled.View>
  );
};

export default Scan;
