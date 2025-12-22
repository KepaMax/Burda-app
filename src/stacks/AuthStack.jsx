import {createStackNavigator} from '@react-navigation/stack';
import SignIn from '@screens/auth/signIn/SignIn';
import SignUp from '@screens/auth/signUp/SignUp';
import ForgotPassword from '@screens/auth/forgotPassword/ForgotPassword';
import ForgotPin from '@screens/auth/forgotPin/ForgotPin';
import PinLogin from '@screens/auth/pinLogin/PinLogin';
import OtpLogin from '@screens/auth/otpLogin/OtpLogin';
import SetupPhone from '@screens/auth/setupPhone/SetupPhone';
import '@locales/index';
import WebViewScreen from '@common/WebViewScreen';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="PinLogin" component={PinLogin} />
      <Stack.Screen name="OtpLogin" component={OtpLogin} />
      <Stack.Screen name="SetupPhone" component={SetupPhone} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ForgotPin" component={ForgotPin} />
      <Stack.Screen name="WebViewScreen" component={WebViewScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
