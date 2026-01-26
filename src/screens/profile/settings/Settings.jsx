import Styled from '@common/StyledComponents';
import Icons from '@icons/icons.js';
import {FlatList, Alert} from 'react-native';
import {useTranslation} from 'react-i18next';
import CustomComponents from '@common/CustomComponents';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {useState, useEffect, useCallback} from 'react';
import storage from '@utils/MMKVStore';
import ReactNativeBiometrics from 'react-native-biometrics';
import Images from '@images/images.js';

const Settings = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  // Biyometrik kimlik doğrulama durumunu yükle (sayfa her focus olduğunda)
  useFocusEffect(
    useCallback(() => {
      const isEnabled = storage.getBoolean('biometricEnabled') || false;
      setBiometricEnabled(isEnabled);
    }, [])
  );

  const handleBiometricToggle = async (value) => {
    if (value) {
      // Parmak izi etkinleştirilmek isteniyor
      try {
        if (!ReactNativeBiometrics) {
          Alert.alert(t('error'), t('biometricNotAvailable'));
          setBiometricEnabled(false);
          return;
        }

        const rnBiometrics = new ReactNativeBiometrics({
          allowDeviceCredentials: true,
        });

        if (!rnBiometrics || !rnBiometrics.isSensorAvailable) {
          Alert.alert(t('error'), t('biometricNotAvailable'));
          setBiometricEnabled(false);
          return;
        }

        // Biyometrik kimlik doğrulama mevcut mu kontrol et
        const resultObject = await rnBiometrics.isSensorAvailable();
        
        if (!resultObject || !resultObject.available) {
          Alert.alert(
            t('error'),
            t('biometricNotAvailable'),
          );
          setBiometricEnabled(false);
          return;
        }

        // Önce PIN kontrolü yap - eğer PIN yoksa PinLogin sayfasına yönlendir
        const savedPin = storage.getString('biometricPin');
        if (!savedPin) {
          // PIN yoksa, kullanıcıdan PIN girmesini iste (parmak izi modalı açmadan)
          const userString = storage.getString('user');
          if (userString) {
            const user = JSON.parse(userString);
            navigation.navigate('PinLogin', {
              userId: user.id || user.user_id,
              setupPin: false,
              enableBiometric: true, // Biyometrik etkinleştirme modu
            });
            // Toggle'ı false yap çünkü henüz etkinleştirilmedi
            setBiometricEnabled(false);
          } else {
            Alert.alert(
              t('error'),
              t('biometricPinNotSet'),
            );
            setBiometricEnabled(false);
          }
          return;
        }
        
        // PIN varsa, şimdi parmak izi modalını aç
        const promptResult = await rnBiometrics.simplePrompt({
          promptMessage: t('biometricPrompt'),
          cancelButtonText: t('cancel'),
        });
        
        if (promptResult?.success) {
          // Parmak izi doğrulandı, biyometrik kimlik doğrulamayı etkinleştir
          storage.set('biometricEnabled', true);
          setBiometricEnabled(true);
        } else {
          // Kullanıcı iptal etti veya başarısız oldu
          setBiometricEnabled(false);
        }
      } catch (error) {
        console.error('Biometric enable error:', error);
        Alert.alert(
          t('error'),
          t('biometricError'),
        );
        setBiometricEnabled(false);
      }
    } else {
      // Parmak izi kapatılmak isteniyor
      Alert.alert(
        t('disableBiometric'),
        t('disableBiometricMessage'),
        [
          {
            text: t('cancel'),
            style: 'cancel',
            onPress: () => {
              // İptal edildi, toggle'ı geri al
              setBiometricEnabled(true);
            },
          },
          {
            text: t('confirm'),
            onPress: () => {
              storage.set('biometricEnabled', false);
              storage.delete('biometricPin');
              setBiometricEnabled(false);
            },
          },
        ],
      );
    }
  };

  const settingItems = [
    {
      logo: <Icons.PersonalInformation />,
      title: t('changeLanguage'),
      route: 'ChangeLanguage',
      type: 'navigation',
    },
    {
      logo: <Icons.ResetPassword />,
      title: t('changePin'),
      route: 'ForgotPin',
      type: 'navigation',
    },
    {
      logo: (
        <Styled.Image
          source={Images.FingerPrint}
          style={{width: 24, height: 24, resizeMode: 'contain'}}
        />
      ),
      title: t('biometricLogin'),
      type: 'toggle',
      value: biometricEnabled,
      onToggle: handleBiometricToggle,
    },
  ];

  const SettingItem = ({item}) => {
    if (item.type === 'toggle') {
      return (
        <Styled.View
          className={`flex-row items-center justify-between shadow shadow-zinc-300 my-[8px] mx-5 px-6 py-5 bg-white rounded-[8px]`}>
          <Styled.View className="flex-row items-center">
            <Styled.View className="bg-white h-[40px] w-[40px] items-center justify-center rounded-full">
              {item.logo}
            </Styled.View>

            <Styled.Text
              className={`text-[#292B2D] text-base font-poppins-medium ml-2`}>
              {item.title}
            </Styled.Text>
          </Styled.View>
          <CustomComponents.Switch
            value={item.value}
            onValueChange={item.onToggle}
            activeColor="#66B600"
            inactiveColor="#E5E7EB"
            thumbColor="#FFFFFF"
          />
        </Styled.View>
      );
    }

    return (
      <Styled.TouchableOpacity
        className={`flex-row items-center justify-between shadow shadow-zinc-300 my-[8px] mx-5 px-6 py-5 bg-white rounded-[8px]`}
        onPress={() => {
          if (item.route === 'ForgotPin') {
            navigation.navigate(item.route, {fromProfile: true});
          } else {
            navigation.navigate(item.route);
          }
        }}>
        <Styled.View className="flex-row items-center">
          <Styled.View className="bg-white h-[40px] w-[40px] items-center justify-center rounded-full">
            {item.logo}
          </Styled.View>

          <Styled.Text
            className={`text-[#292B2D] text-base font-poppins-medium ml-2`}>
            {item.title}
          </Styled.Text>
        </Styled.View>
        <Icons.ChevronRightBlack />
      </Styled.TouchableOpacity>
    );
  };

  return (
    <>
      <CustomComponents.Header title={t('settings')} bgColor="bg-white" />
      <Styled.ScrollView className="bg-[#F8F8F8] h-full">
        <FlatList
          contentContainerStyle={{paddingTop: 10}}
          scrollEnabled={false}
          data={settingItems}
          renderItem={({item}) => <SettingItem item={item} />}
        />
        <Styled.Text className="text-zinc-500 text-sm text-center">
          Version: 1.1
        </Styled.Text>
      </Styled.ScrollView>
    </>
  );
};

export default Settings;
