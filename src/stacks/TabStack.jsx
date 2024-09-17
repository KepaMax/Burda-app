import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeStack from '@stacks/HomeStack';
import ProfileStack from '@stacks/ProfileStack';
import '@locales/index';
import TabBar from './components/TabBar';
import SubscriptionStack from '@stacks/SubscriptionStack';
import ScanStack from '@stacks/ScanStack';

const Tab = createBottomTabNavigator();

const TabStack = () => {
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
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Subscription" component={SubscriptionStack} />
      <Tab.Screen name="Scan" component={ScanStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default TabStack;
