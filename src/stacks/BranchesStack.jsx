import {createStackNavigator} from '@react-navigation/stack';
import Branches from '@screens/branches/Branches';

const Stack = createStackNavigator();

const BranchesStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="BranchesScreen" component={Branches} />
    </Stack.Navigator>
  );
};

export default BranchesStack;
