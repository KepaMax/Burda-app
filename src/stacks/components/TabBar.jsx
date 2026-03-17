import Icons from '@icons/icons.js';
import {Dimensions, Platform, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Styled from '@common/StyledComponents';

const TAB_BAR_HEIGHT = 56;
const CENTER_BUTTON_SIZE = 56;
const CENTER_WIDTH = 80;
/** Tam yarım daire kubbe: yükseklik = genişliğin yarısı, border radius aynı */
const DOME_HEIGHT = CENTER_WIDTH / 2;

const TabBar = ({state, descriptors, navigation}) => {
  const insets = useSafeAreaInsets();
  // Navigation/gesture bar altında kalmaması için: iOS'ta inset, Android'de en az 24 (gesture bar)
  const safeBottom =
    Platform.OS === 'ios'
      ? insets.bottom
      : Math.max(insets.bottom, 24);
  const width = Dimensions.get('screen').width;
  const sideWidth = (width - CENTER_WIDTH) / 2;

  const renderTab = (route, index) => {
    const {options} = descriptors[route.key];
    const visibleLabel = options.tabBarLabel;
    const label = route.name;
    const isFocused = state.index === index;

    let icon;
    if (label === 'Home') {
      icon = isFocused ? <Icons.TabHomeActive /> : <Icons.TabHome />;
    } else if (label === 'Subscription') {
      icon = isFocused ? (
        <Icons.TabSubscriptionActive />
      ) : (
        <Icons.TabSubscription />
      );
    } else if (label === 'Profile') {
      icon = isFocused ? <Icons.TabProfileActive /> : <Icons.TabProfile />;
    } else if (label === 'Scan') {
      icon = isFocused ? <Icons.TabScanActive /> : <Icons.TabScan />;
    } else if (label === 'Branches') {
      icon = (
        <Icons.Map color={isFocused ? '#66B600' : '#757575'} />
      );
    }

    const onPress = () => {
      navigation.reset({
        index: 0,
        routes: [{name: route.name}],
      });
      navigation.emit({
        type: 'tabPress',
        target: route.key,
      });
    };

    const onLongPress = () => {
      navigation.emit({
        type: 'tabLongPress',
        target: route.key,
      });
    };

    return (
      <Styled.TouchableOpacity
        key={route.key}
        accessibilityRole="button"
        accessibilityState={isFocused ? {selected: true} : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={options.tabBarTestID}
        onPress={onPress}
        onLongPress={onLongPress}
        className="flex-1 items-center justify-center">
        <Styled.View className="items-center">
          {icon}
          <Styled.Text
            className={`${
              isFocused ? 'text-[#66B600]' : 'text-[#757575]'
            } mt-1 text-xs font-poppins-medium`}
            numberOfLines={1}>
            {visibleLabel}
          </Styled.Text>
        </Styled.View>
      </Styled.TouchableOpacity>
    );
  };

  const scanIndex = state.routes.findIndex(r => r.name === 'Scan');
  const isScanFocused = state.index === scanIndex;

  const onScanPress = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Scan'}],
    });
    navigation.emit({
      type: 'tabPress',
      target: state.routes[scanIndex].key,
    });
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingBottom: safeBottom,
        backgroundColor: '#FFFFFF',
      }}>
      {/* Sol bölüm: Ana səhifə, Abunəlik */}
      <View
        style={{
          width: sideWidth,
          height: TAB_BAR_HEIGHT,
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 0,
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: 6,
          borderTopWidth: 1,
          borderColor: '#f4f4f5',
        }}>
        {state.routes.slice(0, 2).map((route, i) => renderTab(route, i))}
      </View>

      {/* Orta: Dışa doğru kubbe + Skan butonu */}
      <View
        style={{
          width: CENTER_WIDTH,
          minHeight: TAB_BAR_HEIGHT,
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: '#FFFFFF',
          overflow: 'visible',
        }}>
        {/* Tam yarım daire kubbe (dışa bakan çentik) */}
        <View
          style={{
            position: 'absolute',
            top: -DOME_HEIGHT + 18,
            left: 0,
            width: CENTER_WIDTH,
            height: CENTER_WIDTH,
            borderRadius: 100,
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: '#FFFFFF',
          }}
        />
        <Styled.TouchableOpacity
          onPress={onScanPress}
          onLongPress={() =>
            navigation.emit({
              type: 'tabLongPress',
              target: state.routes[scanIndex].key,
            })
          }
          accessibilityRole="button"
          accessibilityState={isScanFocused ? {selected: true} : {}}
          style={{
            width: CENTER_BUTTON_SIZE,
            height: CENTER_BUTTON_SIZE,
            borderRadius: CENTER_BUTTON_SIZE / 2,
            backgroundColor: '#66B600',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: -DOME_HEIGHT + 30,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.12,
            shadowRadius: 6,
            elevation: 6,
          }}>
          <Icons.TabScanWhite />
        </Styled.TouchableOpacity>
      </View>

      {/* Sağ bölüm: Branches, Hesabım */}
      <View
        style={{
          width: sideWidth,
          height: TAB_BAR_HEIGHT,
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: 0,
          borderTopRightRadius: 20,
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: 6,
          borderTopWidth: 1,
          borderColor: '#f4f4f5',
        }}>
        {state.routes.slice(3, 5).map((route, i) => renderTab(route, i + 3))}
      </View>
    </View>
  );
};

export default TabBar;
