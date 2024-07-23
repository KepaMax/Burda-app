import {createStackNavigator} from '@react-navigation/stack';
import HomePage from '@screens/home/homepage/HomePage';
import CustomHeader from '@common/CustomHeader';
import '@locales/index';
import {useTranslation} from 'react-i18next';
import ChildProfile from '../screens/profile/ChildProfile/ChildProfile';

const Stack = createStackNavigator();

const HomeStack = () => {
  const {t} = useTranslation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{headerShown: false}}
        name="HomePage"
        component={HomePage}
      />
      <Stack.Screen
        options={{
          header: () => (
            <CustomHeader title={t('attributes.studentInformation')} />
          ),
        }}
        name="ChildProfile"
        component={ChildProfile}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
