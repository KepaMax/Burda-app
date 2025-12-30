import {Dimensions, Platform} from 'react-native';
import {useTranslation} from 'react-i18next';
import Styled from './StyledComponents';
import {useState, useEffect} from 'react';
import {fetchData} from '@utils/fetchData';
import {useIsFocused} from '@react-navigation/native';
import {API_URL} from '@env';
import {useMMKVNumber} from 'react-native-mmkv';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Icons from '@icons/icons';

const BUTTON_SIZE = 60;
const EDGE_PADDING = 20;

const ViewBasket = ({navigation}) => {
  const {t} = useTranslation();
  // iOS için 'window' kullan, Android için 'screen'
  const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
  const [totalPrice, setTotalPrice] = useState(null);
  const [itemCount, setItemCount] = useState(0);
  const isFocused = useIsFocused();
  const [basketUpdateTrigger] = useMMKVNumber('basketUpdateTrigger');

  // Initial position - bottom right (iOS tab bar daha yüksek)
  const bottomOffset = Platform.OS === 'ios' ? 260 : 200;
  const translateX = useSharedValue(screenWidth - BUTTON_SIZE - EDGE_PADDING);
  const translateY = useSharedValue(screenHeight - bottomOffset);
  const context = useSharedValue({x: 0, y: 0});

  const getBasketItems = async () => {
    const result = await fetchData({
      url: `${API_URL}/basket-items/`,
      tokenRequired: true,
    });

    if (result?.success) {
      setTotalPrice(result.data.total_price);
      // Toplam quantity hesapla (best practice)
      const totalQuantity = result.data.basket_items?.reduce(
        (sum, item) => sum + item.quantity, 0
      ) || 0;
      setItemCount(totalQuantity);
    }
  };

  useEffect(() => {
    getBasketItems();
  }, [isFocused, basketUpdateTrigger]);

  // Snap to nearest edge
  const snapToEdge = (x, y) => {
    'worklet';
    const leftDistance = x;
    const rightDistance = screenWidth - x - BUTTON_SIZE;

    // Snap to left or right edge
    const newX =
      leftDistance < rightDistance
        ? EDGE_PADDING
        : screenWidth - BUTTON_SIZE - EDGE_PADDING;

    // Keep Y within bounds
    const minY = 100;
    const maxY = screenHeight - bottomOffset;
    const newY = Math.max(minY, Math.min(maxY, y));

    return {x: newX, y: newY};
  };

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = {x: translateX.value, y: translateY.value};
    })
    .onUpdate(event => {
      translateX.value = context.value.x + event.translationX;
      translateY.value = context.value.y + event.translationY;
    })
    .onEnd(() => {
      const snapped = snapToEdge(translateX.value, translateY.value);
      translateX.value = withSpring(snapped.x, {damping: 20, stiffness: 200});
      translateY.value = withSpring(snapped.y, {damping: 20, stiffness: 200});
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
      ],
    };
  });

  const handlePress = () => {
    navigation.navigate('Home', {
      screen: 'Basket',
    });
  };

  if (itemCount === 0) {
    return null;
  }

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: 0,
            top: 0,
            width: BUTTON_SIZE,
            height: BUTTON_SIZE,
            borderRadius: BUTTON_SIZE / 2,
            backgroundColor: '#FF8C03',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 4},
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 8,
            zIndex: 999,
          },
          animatedStyle,
        ]}>
        <Styled.TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.8}
          className="w-full h-full items-center justify-center">
          <Icons.Basket width={28} height={28} />
          {itemCount > 0 && (
            <Styled.View
              className="absolute -top-1 -right-1 bg-[#66B600] rounded-full min-w-[20px] h-[20px] items-center justify-center px-1">
              <Styled.Text className="text-white text-xs font-poppins-bold">
                {itemCount}
              </Styled.Text>
            </Styled.View>
          )}
        </Styled.TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
};

export default ViewBasket;
