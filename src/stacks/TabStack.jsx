import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeStack from '@stacks/HomeStack';
import ProfileStack from '@stacks/ProfileStack';
import '@locales/index';
import TabBar from './components/TabBar';
import SubscriptionStack from '@stacks/SubscriptionStack';
import ScanStack from '@stacks/ScanStack';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {View} from 'react-native';
import ViewBasket from '@common/ViewBasket';
import {useState} from 'react';

const Tab = createBottomTabNavigator();

const TabStack = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [currentTab, setCurrentTab] = useState('Home');

  return (
    <View style={{flex: 1, position: 'relative'}}>
      <Tab.Navigator
        screenOptions={{headerShown: false}}
        screenListeners={{
          state: (e) => {
            const routeName = e.data.state.routes[e.data.state.index].name;
            setCurrentTab(routeName);
          },
        }}
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
      {currentTab === 'Home' && <ViewBasket navigation={navigation} />}
    </View>
  );
};

export default TabStack;
