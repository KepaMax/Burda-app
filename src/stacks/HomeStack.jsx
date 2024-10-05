import {createStackNavigator} from '@react-navigation/stack';
import HomePage from '@screens/home/HomePage';
import FoodDetails from '@screens/home/FoodDetails';
import FoodMenu from '@screens/home/FoodMenu';
import FoodList from '@screens/home/FoodList';
import Basket from '@screens/basket/Basket';

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomePage" component={HomePage} />
      <Stack.Screen name="FoodDetails" component={FoodDetails} />
      <Stack.Screen name="FoodMenu" component={FoodMenu} />
      <Stack.Screen name="FoodList" component={FoodList} />
      <Stack.Screen name="Basket" component={Basket} />
    </Stack.Navigator>
  );
};

export default HomeStack;
