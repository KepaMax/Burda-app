import {createStackNavigator} from '@react-navigation/stack';
import Tracking from '@screens/tracking/tracking/Tracking';
import CustomHeader from '@common/CustomHeader';
import '@locales/index';
import {useTranslation} from 'react-i18next';

const Stack = createStackNavigator();

const TrackingStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      options={{headerShown: false}}
      name="TrackingPage"
      component={Tracking}
    />
  </Stack.Navigator>
);

export default TrackingStack;
