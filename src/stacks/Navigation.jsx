import {NavigationContainer} from '@react-navigation/native';
import TabStack from '@stacks/TabStack';
import AuthStack from '@stacks/AuthStack';
import {useMMKVString} from 'react-native-mmkv';
import Layout from '@common/Layout';

const Navigation = () => {
  const [accessToken, setAccessToken] = useMMKVString('accessToken');

  const linking = {
    prefixes: ['burda://'],
    config: {
      initialRouteName: 'HomePage',
      screens: {
        HomePage: {
          path: 'home',
        },
        ResetPasswordSignIn: {
          path: 'reset/:uuid/:token',
        },
        Account: {
          path: 'profile/',
          screens: {
            SubscriptionStack: {
              path: 'subscription/',
              screens: {
                PaymentSuccess: 'success/',
                PaymentFail: 'fail/',
              },
            },
          },
        },
      },
    },
  };

  return (
    <NavigationContainer linking={linking}>
      <Layout>{accessToken ? <TabStack /> : <AuthStack />}</Layout>
    </NavigationContainer>
  );
};

export default Navigation;
