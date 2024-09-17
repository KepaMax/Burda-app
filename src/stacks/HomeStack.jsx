import {createStackNavigator} from '@react-navigation/stack';
import HomePage from '@screens/home/HomePage';
import '@locales/index';
import {useTranslation} from 'react-i18next';
import FoodDetails from '../screens/home/FoodDetails';

const Stack = createStackNavigator();

const HomeStack = () => {
  const {t} = useTranslation();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomePage" component={HomePage} />
      <Stack.Screen name="FoodDetails" component={FoodDetails} />
    </Stack.Navigator>
  );
};

export default HomeStack;
