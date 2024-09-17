import {createStackNavigator} from '@react-navigation/stack';
import SignIn from '@screens/auth/signIn/SignIn';
import SignUp from '@screens/auth/signUp/SignUp';
import ForgotPassword from '@screens/auth/forgotPassword/ForgotPassword';
import '@locales/index';
import WebViewScreen from '@common/WebViewScreen';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="WebViewScreen" component={WebViewScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
