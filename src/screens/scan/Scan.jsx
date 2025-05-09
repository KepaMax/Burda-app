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
import {useMMKVBoolean} from 'react-native-mmkv';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {fetchData} from '@utils/fetchData';
import Icons from '@icons/icons';
import {API_URL} from '@env';

const Scan = () => {
  const screenWidth = Dimensions.get('screen').width;
  const [cameraAccess, setCameraAccess] = useState(false);
  const [scannedOnce, setScannedOnce] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const {t} = useTranslation();
  const [basketVisible, setBasketVisible] = useMMKVBoolean('basketVisible');

  const device = useCameraDevice('back', {
    physicalDevices: [
      'ultra-wide-angle-camera',
      'wide-angle-camera',
      'telephoto-camera',
    ],
  });

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

  const incrementBasketItemCount = async ({basketItemId, itemQuantity}) => {
    await fetchData({
      url: `${API_URL}/basket-items/${basketItemId}/`,
      tokenRequired: true,
      method: 'PATCH',
      body: {
        quantity: itemQuantity + 1,
      },
    });
  };

  const setBasketItem = async mealId => {
    await fetchData({
      url: `${API_URL}/basket-items/`,
      tokenRequired: true,
      method: 'POST',
      body: {meal: mealId},
    });

    getBasketItems();
  };

  const getBasketItems = async () => {
    const result = await fetchData({
      url: `${API_URL}/basket-items/`,
      tokenRequired: true,
    });

    if (result?.success) {
      return result?.data?.basket_items;
    } else {
      return [];
    }
  };

  const checkForExistingItem = async (mealId, basketItems) => {
    if (basketItems.length) {
      basketItems.map(item => {
        if (item.meal.id === mealId) {
          incrementBasketItemCount({
            basketItemId: item.id,
            itemQuantity: item.quantity,
          });
        } else {
          setBasketItem(mealId);
        }
      });
    } else {
      setBasketItem(mealId);
    }
  };

  const getMealId = async barcode => {
    const result = await fetchData({
      url: `${API_URL}/meals/${barcode}/`,
      tokenRequired: true,
    });

    if (result?.success) {
      const data = await getBasketItems();
      if (data.length !== 0) {
        await checkForExistingItem(result.data.id, data);
      } else {
        await setBasketItem(result.data.id);
      }
      navigation.navigate('Home', {
        screen: 'Basket',
      });
    }
  };

  useEffect(() => {
    canUseCamera(setCameraAccess);
  }, []);

  useEffect(() => {
    if (isFocused) {
      setBasketVisible(false);
      setScannedOnce(false);
      setCameraActive(true);
    }
  }, [isFocused]);

  return (
    <Styled.View className="h-full mt-10">
      {/* Top Header */}
      <Styled.View className="w-full bg-transparent items-center">
        <Styled.View className="w-11/12 items-center justify-center flex-row relative">
          <Styled.TouchableOpacity
            hitSlop={{top: 50, right: 50, bottom: 50, left: 50}}
            onPress={() => {
              navigation.navigate('Home', {screen: 'HomeStack'});
            }}
            className="absolute left-0">
            <Icons.ArrowBlack />
          </Styled.TouchableOpacity>
        </Styled.View>
      </Styled.View>

      {/* Camera & Text */}
      {cameraAccess ? (
        <Styled.View className="h-full justify-center items-center">
          <Styled.Text className="text-black text-2xl font-poppins-semibold mt-10 text-center z-10">
            {t('scanFood')}
          </Styled.Text>

          {/* Absolute Camera View */}
          <Styled.View className="absolute top-0 left-0 w-full h-full">
            <Camera
              codeScanner={codeScanner}
              style={{width: screenWidth, height: screenWidth}}
              device={device}
              isActive={cameraActive && isFocused}
            />
          </Styled.View>
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
