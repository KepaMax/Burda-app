import {NavigationContainer} from '@react-navigation/native';
import TabStack from '@stacks/TabStack';
import AuthStack from '@stacks/AuthStack';
import {useMMKVString, useMMKVBoolean} from 'react-native-mmkv';
import Layout from '@common/Layout';
import {useEffect, useRef, useState} from 'react';
import storage from '@utils/MMKVStore';
import PinLogin from '@screens/auth/pinLogin/PinLogin';
import ForgotPin from '@screens/auth/forgotPin/ForgotPin';
import {createStackNavigator} from '@react-navigation/stack';
import {decodeJWT} from '@utils/authUtils';
import {fetchData} from '@utils/fetchData';
import {API_URL} from '@env';
import LoadingScreen from '@common/LoadingScreen';

const Stack = createStackNavigator();

const Navigation = () => {
  const [accessToken, setAccessToken] = useMMKVString('accessToken');
  const [isPinVerified, setIsPinVerified] = useMMKVBoolean('isPinVerified');
  const [shouldShowSignIn, setShouldShowSignIn] = useState(false);
  const [isCheckingPinStatus, setIsCheckingPinStatus] = useState(false);
  const hasInitialized = useRef(false);

  // Uygulama ilk açıldığında (kill edildikten sonra) PIN doğrulamasını sıfırla ve PIN durumunu kontrol et
  useEffect(() => {
    // Sadece ilk mount'ta çalış (uygulama kill edildikten sonra açıldığında)
    if (!hasInitialized.current && accessToken && accessToken.trim() !== '') {
      setIsPinVerified(false);
      hasInitialized.current = true;
      
      // JWT token'dan user_id'yi al ve check-status endpoint'ine gönder
      const checkPinStatus = async () => {
        setIsCheckingPinStatus(true);
        try {
          const decoded = decodeJWT(accessToken);
          if (decoded && decoded.user_id) {
            const result = await fetchData({
              url: `${API_URL}/check-status/`,
              method: 'POST',
              tokenRequired: false,
              body: {
                identifier: decoded.user_id.toString(),
              },
            });
            console.log('Check status resultTTT:', result);
            if (result?.success && result?.data) {
              const {is_pin_set} = result.data;
              // Eğer is_pin_set false ise SignIn göster, true ise PinLogin göster
              setShouldShowSignIn(!is_pin_set);
            } else {
              // API hatası durumunda varsayılan olarak PinLogin göster
              setShouldShowSignIn(false);
            }
          } else {
            // JWT decode başarısız, varsayılan olarak PinLogin göster
            setShouldShowSignIn(false);
          }
        } catch (error) {
          console.error('Error checking PIN status:', error);
          // Hata durumunda varsayılan olarak PinLogin göster
          setShouldShowSignIn(false);
        } finally {
          setIsCheckingPinStatus(false);
        }
      };

      checkPinStatus();
    }
  }, []); // Boş dependency array - sadece component mount olduğunda çalış

  // accessToken silindiğinde isPinVerified'ı da temizle
  useEffect(() => {
    if (!accessToken || accessToken.trim() === '') {
      setIsPinVerified(false);
      setShouldShowSignIn(false);
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

  // PIN durumu kontrol edilirken loading göster
  if (isCheckingPinStatus) {
    return (
      <NavigationContainer linking={linking}>
        <Layout>
          <LoadingScreen />
        </Layout>
      </NavigationContainer>
    );
  }

  // PIN doğrulama gerekiyorsa PinLogin veya SignIn göster
  // accessToken varsa ve boş string değilse ve PIN doğrulanmamışsa
  if (accessToken && accessToken.trim() !== '' && !isPinVerified) {
    // Local storage'da user yoksa veya is_pin_set false ise SignIn göster
    const userString = storage.getString('user');
    if (!userString || userString.trim() === '' || shouldShowSignIn) {
      return (
        <NavigationContainer linking={linking}>
          <Layout>
            <AuthStack />
          </Layout>
        </NavigationContainer>
      );
    }
    
    // User var ve is_pin_set true ise PinLogin göster
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
