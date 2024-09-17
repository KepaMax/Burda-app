import Icons from '@icons/icons.js';
import {useTranslation} from 'react-i18next';
import {Dimensions} from 'react-native';
import Styled from '@common/StyledComponents';

const TabBar = ({state, descriptors, navigation}) => {
  const {t} = useTranslation();
  const width = Dimensions.get('screen').width;

  return (
    <Styled.View
      className={`border-t-[1px] border-zinc-100 flex-row bg-white justify-between items-center px-[30px] py-[5px] ${
        Platform.OS === 'ios' && width > 375 ? 'pb-[25px]' : ''
      }`}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

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
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

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
            disabled={label === 'Subscription'}>
            <Styled.View className="items-center">
              {icon}
              <Styled.Text
                className={`${
                  isFocused ? 'text-[#66B600]' : 'text-[#757575]'
                } mt-1 text-xs font-serrat-medium`}>
                {label}
              </Styled.Text>
            </Styled.View>
          </Styled.TouchableOpacity>
        );
      })}
    </Styled.View>
  );
};

export default TabBar;
