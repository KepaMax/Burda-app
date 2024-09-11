import {useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {SafeAreaView} from 'react-native-safe-area-context';
import NoInternet from '@common/NoInternet';
import {NavigationContainer} from '@react-navigation/native';
import TabStack from '@stacks/TabStack';
import AuthStack from '@stacks/AuthStack';
import {useMMKVString} from 'react-native-mmkv';

const Navigation = () => {
  const [connected, setConnected] = useState();
  const [accessToken, setAccessToken] = useMMKVString('accessToken');

  const linking = {
    prefixes: ['twoschooldriver://'],
    config: {
      initialRouteName: 'ResetPasswordSignIn',
      screens: {
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

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <SafeAreaView style={{flex: 1}} edges={['right', 'top', 'left']}>
      {connected === true ? (
        <NavigationContainer linking={linking}>
          {accessToken ? <TabStack /> : <AuthStack />}
        </NavigationContainer>
      ) : connected === false ? (
        <NoInternet />
      ) : null}
    </SafeAreaView>
  );
};

export default Navigation;
