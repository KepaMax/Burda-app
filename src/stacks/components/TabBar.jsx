import Icons from '@icons/icons.js';
import {Dimensions} from 'react-native';
import Styled from '@common/StyledComponents';
import ViewBasket from '@common/ViewBasket';
import {useMMKVBoolean} from 'react-native-mmkv';

const TabBar = ({state, descriptors, navigation}) => {
  const width = Dimensions.get('screen').width;
  const [basketVisible, setBasketVisible] = useMMKVBoolean('basketVisible');

  return (
    <Styled.View
      className={`border-t-[1px] border-zinc-100 flex-row bg-white justify-between items-center px-[30px] py-[5px] ${
        Platform.OS === 'ios' && width > 375 ? 'pb-[25px]' : ''
      }`}>
      {state.routes.map((route, index) => {
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
        }

        const onPress = () => {
          // Control ViewBasket visibility based on the selected tab
          if (label === 'Scan') {
            setBasketVisible(false);
          } else {
            setBasketVisible(true);
          }

          // Logic for resetting Home tab to initial screen when "Basket" is focused
          if (label === 'Home' && isFocused) {
            navigation.reset({
              index: 0,
              routes: [{name: 'Home'}],
            });
          }

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          // Handle default navigation to the selected tab if not focused
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <Styled.TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            // disabled={label === 'Subscription'}
          >
            <Styled.View className="items-center">
              {icon}
              <Styled.Text
                className={`${
                  isFocused ? 'text-[#66B600]' : 'text-[#757575]'
                } mt-1 text-xs font-poppins-medium`}>
                {visibleLabel}
              </Styled.Text>
            </Styled.View>
          </Styled.TouchableOpacity>
        );
      })}

      {Boolean(basketVisible) && <ViewBasket navigation={navigation} />}
    </Styled.View>
  );
};

export default TabBar;
