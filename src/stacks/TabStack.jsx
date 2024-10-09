import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeStack from '@stacks/HomeStack';
import ProfileStack from '@stacks/ProfileStack';
import '@locales/index';
import TabBar from './components/TabBar';
import SubscriptionStack from '@stacks/SubscriptionStack';
import ScanStack from '@stacks/ScanStack';
import {useTranslation} from 'react-i18next';

const Tab = createBottomTabNavigator();

const TabStack = () => {
  const {t} = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{headerShown: false}}
      tabBar={({state, descriptors, navigation}) => (
        <TabBar
          state={state}
          descriptors={descriptors}
          navigation={navigation}
        />
      )}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{tabBarLabel: t('home')}}
      />
      <Tab.Screen
        name="Subscription"
        component={SubscriptionStack}
        options={{tabBarLabel: t('subscription')}}
      />
      <Tab.Screen
        name="Scan"
        component={ScanStack}
        options={{tabBarLabel: t('scan')}}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{tabBarLabel: t('menu')}}
      />
    </Tab.Navigator>
  );
};

export default TabStack;
