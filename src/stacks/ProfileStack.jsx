import {createStackNavigator} from '@react-navigation/stack';
import Profile from '@screens/profile/profile/Profile';
import Settings from '@screens/profile/settings/Settings';
import Support from '@screens/profile/support/Support';
import CustomHeader from '@common/CustomHeader';
import '@locales/index';
import {useTranslation} from 'react-i18next';
import ChangePassword from '@screens/profile/changePassword/ChangePassword';
import ChangeLanguage from '@screens/profile/settings/ChangeLanguage';
import WebViewGeneral from '@common/WebViewGeneral';
import EditProfile from '@screens/profile/editProfile/EditProfile';

const Stack = createStackNavigator();

const ProfileStack = () => {
  const {t} = useTranslation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          header: () => (
            <CustomHeader noBackBtn title={t('attributes.profile')} />
          ),
        }}
        name="ProfileScreen"
        component={Profile}
      />
      <Stack.Screen
        options={{
          header: () => <CustomHeader title={t('attributes.Settings')} />,
        }}
        name="Settings"
        component={Settings}
      />
      <Stack.Screen
        options={{
          header: () => <CustomHeader title={t('attributes.changeLanguage')} />,
        }}
        name="ChangeLanguage"
        component={ChangeLanguage}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="WebView"
        component={WebViewGeneral}
      />
      <Stack.Screen
        options={{
          header: () => <CustomHeader title={t('attributes.help')} />,
        }}
        name="Support"
        component={Support}
      />
      <Stack.Screen
        options={{
          header: () => (
            <CustomHeader title={t('attributes.resetPasswordTitle')} />
          ),
        }}
        name="ChangePassword"
        component={ChangePassword}
      />
      <Stack.Screen
        options={{
          header: () => (
            <CustomHeader title={t('attributes.resetPasswordTitle')} />
          ),
        }}
        name="EditProfile"
        component={EditProfile}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
