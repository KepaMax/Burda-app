import {createStackNavigator} from '@react-navigation/stack';
import Profile from '@screens/profile/profile/Profile';
import Settings from '@screens/profile/settings/Settings';
import Support from '@screens/profile/support/Support';
import '@locales/index';
import ChangePassword from '@screens/profile/changePassword/ChangePassword';
import ChangeLanguage from '@screens/profile/settings/ChangeLanguage';
import WebViewScreen from '@common/WebViewScreen';
import EditProfile from '@screens/profile/editProfile/EditProfile';

const Stack = createStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ProfileScreen" component={Profile} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="ChangeLanguage" component={ChangeLanguage} />
      <Stack.Screen name="WebViewScreen" component={WebViewScreen} />
      <Stack.Screen name="Support" component={Support} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
