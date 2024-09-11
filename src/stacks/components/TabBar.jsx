import HomeIcon from '@icons/home-menu.svg';
import HomeActiveIcon from '@icons/home-active-menu.svg';
import TrackingIcon from '@icons/tracking-menu.svg';
import TrackingActiveIcon from '@icons/tracking-active-menu.svg';
import ProfileIcon from '@icons/user-menu.svg';
import ProfileActiveIcon from '@icons/user-active-menu.svg';
import '@locales/index';
import {useTranslation} from 'react-i18next';
import {Dimensions, Vibration} from 'react-native';
import {
  StyledView,
  StyledTouchableOpacity,
  StyledText,
} from '@common/StyledComponents';

const TabBar = ({state, descriptors, navigation}) => {
  const {t} = useTranslation();
  const width = Dimensions.get('screen').width;

  return (
    <StyledView
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

        if (label === t('attributes.menuHome')) {
          icon = isFocused ? <HomeActiveIcon /> : <HomeIcon />;
        } else if (label === t('attributes.menuTracking')) {
          icon = isFocused ? <TrackingActiveIcon /> : <TrackingIcon />;
        } else if (label === t('attributes.menuProfile')) {
          icon = isFocused ? <ProfileActiveIcon /> : <ProfileIcon />;
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
          <StyledTouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}>
            <StyledView className="items-center">
              {icon}
              <StyledText
                className={`${
                  isFocused ? 'text-[#204F50]' : 'text-[#204F504D]'
                } mt-1 text-xs font-serrat-medium`}>
                {label}
              </StyledText>
            </StyledView>
          </StyledTouchableOpacity>
        );
      })}
    </StyledView>
  );
};

export default TabBar;
