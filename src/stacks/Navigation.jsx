import {NavigationContainer} from '@react-navigation/native';
import TabStack from '@stacks/TabStack';
import AuthStack from '@stacks/AuthStack';
import {useMMKVString, useMMKVBoolean} from 'react-native-mmkv';
import Layout from '@common/Layout';
import {useEffect, useRef} from 'react';
import storage from '@utils/MMKVStore';
import PinLogin from '@screens/auth/pinLogin/PinLogin';
import ForgotPin from '@screens/auth/forgotPin/ForgotPin';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

const Navigation = () => {
  const [accessToken, setAccessToken] = useMMKVString('accessToken');
  const [isPinVerified, setIsPinVerified] = useMMKVBoolean('isPinVerified');
  const hasInitialized = useRef(false);

  // Uygulama ilk açıldığında (kill edildikten sonra) PIN doğrulamasını sıfırla
  useEffect(() => {
    // Sadece ilk mount'ta çalış (uygulama kill edildikten sonra açıldığında)
    if (!hasInitialized.current && accessToken) {
      setIsPinVerified(false);
      hasInitialized.current = true;
    }
  }, []); // Boş dependency array - sadece component mount olduğunda çalış

  // accessToken silindiğinde isPinVerified'ı da temizle
  useEffect(() => {
    if (!accessToken || accessToken.trim() === '') {
      setIsPinVerified(false);
    }
  }, [accessToken, setIsPinVerified]);

  const linking = {
    prefixes: ['burda://'],
    config: {
      screens: {
        Home: {
          screens: {
            HomePage: 'home',
          },
        },
        Profile: {
          screens: {
            PaymentMethods: 'payment-methods',
          },
        },
        Subscription: {
          screens: {
            PaymentSuccess: 'subscription/success',
            PaymentFail: 'subscription/fail',
          },
        },
      },
    },
  };

  // PIN doğrulama gerekiyorsa PinLogin göster
  // accessToken varsa ve boş string değilse ve PIN doğrulanmamışsa
  if (accessToken && accessToken.trim() !== '' && !isPinVerified) {
    return (
      <NavigationContainer linking={linking}>
        <Layout>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="PinLogin" component={PinLogin} />
            <Stack.Screen name="ForgotPin" component={ForgotPin} />
          </Stack.Navigator>
        </Layout>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer linking={linking}>
      <Layout>{accessToken ? <TabStack /> : <AuthStack />}</Layout>
    </NavigationContainer>
  );
};

export default Navigation;
