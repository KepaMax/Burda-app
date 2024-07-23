/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

// @ts-nocheck
import 'react-native-gesture-handler';
import Navigation from '@stacks/Navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { StatusBar, PermissionsAndroid } from 'react-native';
import { useTranslation } from 'react-i18next';
import { storage } from './src/utils/MMKVStore';

function App(): JSX.Element {
  const { i18n } = useTranslation();

  useEffect(() => {
    // const getLocationRequest = async () => {
    //   try {
    //     const granted = await PermissionsAndroid.request(
    //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //       {
    //         title: '2School',
    //         message: '2School access to your location ',
    //       },
    //     );
    //   } catch (err) {
    //     console.warn(err);
    //   }
    // };
    // getLocationRequest();

  }, []);

  useEffect(() => {
    const requestImagePermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          {
            title: 'Cool Photo App Camera Permission',
            message:
              'Cool Photo App needs access to your camera ' +
              'so you can take awesome pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the camera');
        } else {
          console.log('Camera permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestImagePermission();
  }, [])

  useEffect(() => {
    const refreshTokens = async () => { };

    const currentLanguage = async () => {
      const selectedLanguage = storage.getString('selectedLanguage');
      if (selectedLanguage) {
        i18n.changeLanguage(selectedLanguage);
      }
    };
    currentLanguage();
  }, []);

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#7658F2' }}>
      <StatusBar backgroundColor="#7658F2" barStyle="light-content" />
      <Navigation />
    </SafeAreaProvider>
  );
}

export default App;
