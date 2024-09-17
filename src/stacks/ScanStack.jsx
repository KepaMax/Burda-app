import {createStackNavigator} from '@react-navigation/stack';
import Scan from '@screens/scan/Scan';

const Stack = createStackNavigator();

const ScanStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ScanScreen" component={Scan} />
    </Stack.Navigator>
  );
};

export default ScanStack;
