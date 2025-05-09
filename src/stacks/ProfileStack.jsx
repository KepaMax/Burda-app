import {createStackNavigator} from '@react-navigation/stack';
import Profile from '@screens/profile/profile/Profile';
import Settings from '@screens/profile/settings/Settings';
import Support from '@screens/profile/support/Support';
import ChangePassword from '@screens/profile/changePassword/ChangePassword';
import ChangeLanguage from '@screens/profile/settings/ChangeLanguage';
import WebViewScreen from '@common/WebViewScreen';
import EditProfile from '@screens/profile/editProfile/EditProfile';
import PaymentMethods from '@screens/profile/paymentMethods/PaymentMethods';
import AddNewCard from '@screens/profile/paymentMethods/components/AddNewCard';
import Receipt from '@screens/profile/paymentMethods/Receipt';
import PaymentHistory from '@screens/profile/paymentMethods/PaymentHistory';

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
      <Stack.Screen name="PaymentMethods" component={PaymentMethods} />
      <Stack.Screen name="AddNewCard" component={AddNewCard} />
      <Stack.Screen name="Receipt" component={Receipt} />
      <Stack.Screen name="PaymentHistory" component={PaymentHistory} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
