/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

// @ts-nocheck
import 'react-native-gesture-handler';
import Navigation from '@stacks/Navigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useEffect} from 'react';
import {StatusBar, PermissionsAndroid} from 'react-native';
import {useTranslation} from 'react-i18next';
import {storage} from './src/utils/MMKVStore';

function App(): JSX.Element {
  const {i18n} = useTranslation();

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

  const linking = {
    prefixes: ['treduapp://'],
    config: {
      initialRouteName: 'MainstackTab',
      screens: {
        MainstackTab: {
          screens: {
            Home: {
              path: 'homepage/',
              screens: {
                CourseDetails: {
                  path: 'courses/:id',
                },
                CourseClassDetails: {
                  path: 'course-classes/:id',
                },
                InstructorDetails: {
                  path: 'instructors/:id',
                },
                PartnerNetwork: {
                  path: 'partner-networks/:id',
                },
                LastClasses: {
                  path: 'limited-offers/',
                },
                Checkout: {
                  path: 'checkout/:params',
                },
                PopularCourses: {
                  path: 'popular-courses/:category?',
                },
                TopInstructors: {
                  path: 'top-instructors/',
                },
                TopPartnerNetworks: {
                  path: 'top-partner-networks/',
                },
              },
            },
            Activities: {
              path: 'activities/',
            },
            QR: {
              path: 'qr/',
            },
            Account: {
              path: 'account/',
            },
            Search: {
              path: 'search/',
            },
          },
        },
      },
    },
  };

  useEffect(() => {
    const refreshTokens = async () => {};

    const currentLanguage = async () => {
      const selectedLanguage = storage.getString('selectedLanguage');
      if (selectedLanguage) {
        i18n.changeLanguage(selectedLanguage);
      }
    };
    currentLanguage();
  }, []);

  return (
    <SafeAreaProvider style={{flex: 1, backgroundColor: '#7658F2'}}>
      <StatusBar backgroundColor="#7658F2" barStyle="light-content" />
      <Navigation />
    </SafeAreaProvider>
  );
}

export default App;
