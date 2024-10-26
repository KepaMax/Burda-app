/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

// @ts-nocheck
import 'react-native-gesture-handler';
import Navigation from '@stacks/Navigation';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {useEffect, useState} from 'react';
import {Dimensions, StatusBar} from 'react-native';
import {useTranslation} from 'react-i18next';
import storage from '@utils/MMKVStore';
import {refreshTokens} from '@utils/authUtils';
import SuperAlert from 'react-native-super-alert';
import NetInfo from '@react-native-community/netinfo';
import NoInternet from '@common/NoInternet';
import {useMMKVString} from 'react-native-mmkv';
import {useMMKVBoolean} from 'react-native-mmkv';
import {fetchData} from '@utils/fetchData';
import {API_URL} from '@env';

function App(): JSX.Element {
  const [selectedLanguage, setSelectedLanguage] =
    useMMKVString('selectedLanguage');
  const [connected, setConnected] = useState();
  const {i18n} = useTranslation();
  const screenWidth = Dimensions.get('screen').width;
  const [buttonType, setButtonType] = useMMKVString('buttonType');
  const [basketVisible, setBasketVisible] = useMMKVBoolean('basketVisible');

  const getBasketItems = async () => {
    const result = await fetchData({
      url: `${API_URL}/basket-items/`,
      tokenRequired: true,
    });

    if (result.success && result.data.basket_items.length) {
      setBasketVisible(true);
    }
  };

  const alertStyle = {
    container: {
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      paddingHorizontal: 46,
      width: screenWidth - 56,
    },
    buttonCancel: {
      backgroundColor: '#FFFFFF',
      paddingVertical: 8,
      width: (screenWidth - 110) / 2,
    },
    buttonConfirm: {
      backgroundColor: buttonType,
      borderRadius: 6,
      paddingVertical: 8,
      width: (screenWidth - 110) / 2,
    },
    textButtonCancel: {
      color: '#757575',
      fontFamily: 'Poppins-Medium',
      fontSize: 18,
    },
    textButtonConfirm: {
      color: '#fff',
      fontFamily: 'Poppins-Medium',
      fontSize: 18,
    },
    title: {
      color: '#000',
      fontSize: 16,
      fontFamily: 'Poppins-SemiBold',
    },
    message: {
      color: '#414141',
      fontSize: 14,
      fontFamily: 'Poppins-Regular',
      marginBottom: 14,
    },
  };

  useEffect(() => {
    storage.set('buttonType', '#FF8C03');
    refreshTokens();

    const unsubscribe = NetInfo.addEventListener(state => {
      setConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (selectedLanguage) {
      i18n.changeLanguage(selectedLanguage);
    }
  }, [selectedLanguage]);

  useEffect(() => {
    getBasketItems();
  }, []);

  return (
    <>
      <SafeAreaProvider style={{flex: 1, backgroundColor: '#F8F8F8'}}>
        {/* <StatusBar backgroundColor="#7658F2" barStyle="light-content" /> */}
        <SafeAreaView style={{flex: 1}} edges={['right', 'top', 'left']}>
          {connected ? <Navigation /> : <NoInternet />}
        </SafeAreaView>
      </SafeAreaProvider>

      <SuperAlert customStyle={alertStyle} />
    </>
  );
}

export default App;
