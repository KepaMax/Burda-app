import {useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {SafeAreaView} from 'react-native-safe-area-context';
import NoInternet from '@common/NoInternet';
import {StyledView} from '@common/StyledComponents';
import Logo from '@icons/logo-home.svg';
import Animated, {FadeOut} from 'react-native-reanimated';
import {NavigationContainer} from '@react-navigation/native';
import TabStack from '@stacks/TabStack';
import AuthStack from '@stacks/AuthStack';
import {useMMKVString} from 'react-native-mmkv';

const Navigation = () => {
  const [connected, setConnected] = useState();
  const [accessToken, setAccessToken] = useMMKVString('accessToken');

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
      {true ? (
        <>
          {connected === true ? (
            <NavigationContainer>
              {accessToken ? <TabStack /> : <AuthStack />}
            </NavigationContainer>
          ) : connected === false ? (
            <NoInternet />
          ) : null}
        </>
      ) : (
        <Animated.View exiting={FadeOut}>
          <StyledView className="bg-[#7658F2] w-screen h-screen items-center justify-center">
            <Logo />
          </StyledView>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

export default Navigation;
