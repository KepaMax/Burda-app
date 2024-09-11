import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeStack from '@stacks/HomeStack';
import TrackingStack from '@stacks/TrackingStack';
import ProfileStack from '@stacks/ProfileStack';
import '@locales/index';
import {useTranslation} from 'react-i18next';
import TabBar from './components/TabBar';

const Tab = createBottomTabNavigator();

const TabStack = () => {
  const {t} = useTranslation();

  return (
    <Tab.Navigator
      tabBar={({state, descriptors, navigation}) => (
        <TabBar
          state={state}
          descriptors={descriptors}
          navigation={navigation}
        />
      )}>
      <Tab.Screen
        options={{headerShown: false, title: t('attributes.menuHome')}}
        name="Home"
        component={HomeStack}
      />
      <Tab.Screen
        options={{headerShown: false, title: t('attributes.menuTracking')}}
        name="Tracking"
        component={TrackingStack}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          title: t('attributes.menuProfile'),
        }}
        name="Profile"
        component={ProfileStack}
      />
    </Tab.Navigator>
  );
};

export default TabStack;
