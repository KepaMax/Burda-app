import {createStackNavigator} from '@react-navigation/stack';
import Subscription from '@screens/subscription/Subscription';

const Stack = createStackNavigator();

const SubscriptionStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="SubscriptionScreen" component={Subscription} />
    </Stack.Navigator>
  );
};

export default SubscriptionStack;
