import {createStackNavigator} from '@react-navigation/stack';
import SignIn from '@screens/auth/signIn/SignIn';
import SignUp from '@screens/auth/signUp/SignUp';
import ForgotPassword from '@screens/auth/forgotPassword/ForgotPassword';
import WelcomeBottomSheet from '@screens/auth/startPage/WelcomeBottomSheet';
import ChooseLanguageBottomSheet from '@screens/auth/startPage/ChooseLanguageBottomSheet';
import ResetPasswordSignIn from '@screens/auth/resetPassword/ResetPasswordSignIn';
import CustomHeader from '@common/CustomHeader';
import '@locales/index';
import {useTranslation} from 'react-i18next';
import WebViewScreen from '@common/WebViewScreen';

const Stack = createStackNavigator();

const AuthStack = () => {
  const {t} = useTranslation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{headerShown: false}}
        name="ChooseLanguageBottomSheet"
        component={ChooseLanguageBottomSheet}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="WelcomeBottomSheet"
        component={WelcomeBottomSheet}
      />
      <Stack.Screen
        options={{
          header: () => <CustomHeader title={t('attributes.registerSignin')} />,
        }}
        name="SignIn"
        component={SignIn}
      />

      <Stack.Screen
        options={{
          header: () => (
            <CustomHeader
              title={t('attributes.resetPasswordTitle')}
              navigationScreen="SignIn"
            />
          ),
        }}
        name="ResetPasswordSignIn"
        component={ResetPasswordSignIn}
      />
      <Stack.Screen
        options={{
          header: () => <CustomHeader title={t('attributes.signUp')} />,
        }}
        name="SignUp"
        component={SignUp}
      />

      <Stack.Screen
        options={{
          header: () => (
            <CustomHeader title={t('attributes.forgotPaswwordTitle')} />
          ),
        }}
        name="ForgotPassword"
        component={ForgotPassword}
      />

      <Stack.Screen
        options={{headerShown: false}}
        name="WebViewScreen"
        component={WebViewScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
