import { useEffect, useState, useContext } from "react";
import NetInfo from "@react-native-community/netinfo";
import AuthContext from "../TokenManager";
import { SafeAreaView } from "react-native-safe-area-context";
import MainPage from "../../mainpage/MainPage";
import Profile from "../../profile/Profile";
import HomeIcon from "../../../assets/icons/home-menu.svg";
import HomeActiveIcon from "../../../assets/icons/home-active-menu.svg";
import TrackingIcon from "../../../assets/icons/tracking-menu.svg";
import TrackingActiveIcon from "../../../assets/icons/tracking-active-menu.svg";
import UserActiveIcon from "../../../assets/icons/user-active-menu.svg";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import SignIn from "../../signIn/SignIn";
import SignUp from "../../signUp/SignUp";
import ForgotPassword from "../../signIn/ForgotPassword";
import "../../locales/index";
import { useTranslation } from "react-i18next";
import TermsAndConditions from "../../termsAndConditions/TermsAndConditions";
import Settings from "../../settings/Settings";
import Support from "../../support/Support";
import PrivacyPolicy from "../../privacyPolicy/PrivacyPolicy";
import PrivacyPolicySignup from "../../privacyPolicy/PrivacyPolicySignup";
import TermsAndConditionsSignup from "../../termsAndConditions/TermsAndConditionsSignup";
import NoInternet from "./NoInternet";
import Notifications from "../../notifications/Notifications";
import { StyledView, StyledText } from "./StyledComponents";
import Logo from "../../../assets/icons/logo-home.svg";
import Animated, { FadeOut } from "react-native-reanimated";
import { Platform, TouchableOpacity, Dimensions } from "react-native";
import Languages from "../../settings/components/Languages";
import ResetPassword from "../../resetPassword/ResetPassword"
import FAQ from "../../FAQ/FAQ";
import Payments from "../../profile/MyCards";
import SubscriptionHistory from "../../subscriptionHistory/SubscriptionHistory";
import RequesRide from "../../requestRide/RequesRide";
import UserIcon from "../../../assets/icons/user-menu.svg";
import HomeAddress from "../../requestRide/HomeAddress";
import ChildrenSubscription from "../../subscriptionPlan/ChildrenSubscription";
import SubscriptionPayment from "../../subscriptionPlan/SubscriptionPayment";
import AddCard from "../../payment/AddCard";
import ManageCards from "../../payment/ManageCards";
import Tracking from "../../tracking/Tracking";
import RegisterSuccess from "./RegisterSuccces";
import WelcomeBottomSheet from "../../startPage/WelcomeBottomSheet";
import ChooseLanguageBottomSheet from "../../startPage/ChooseLanguageBottomSheet";
import CustomHeader from "./CustomHeader";
import CancelSubscription from "../../subscriptionPlan/CancelSubscription";
import EditProfile from "../../editProfile/EditProfile";

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const RequestRideStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const MainStack = createStackNavigator();
const SubscriptionStack = createStackNavigator();
const TrackingStack = createStackNavigator();

const NavigationMenu = () => {
  const [connected, setConnected] = useState();
  const { getUserType, trigger, getInitialLogin, setInitialLogin } =
    useContext(AuthContext);
  const [userType, setUserType] = useState(null);
  const [renderCompleted, setRenderCompleted] = useState(false);
  const [loggedInBefore, setLoggedInBefore] = useState();
  const { t } = useTranslation();
  const [deviceWidth, setDeviceWidth] = useState(
    Dimensions.get("window").width
  );

  useEffect(() => {
    const getType = async () => {
      const type = await getUserType();
      setUserType(type);
      setRenderCompleted(true);
    };
    getType();
  }, [trigger]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const getLogin = async () => {
      let loginState = await getInitialLogin();
      setLoggedInBefore(loginState);
    };

    getLogin();
  }, [trigger]);

  // useEffect(() => {
  //   const getLogin = async () => {
  //     setInitialLogin(false);
  //   };

  //   getLogin();
  // }, []);

  const SubscriptionStackScreen = () => (
    <SubscriptionStack.Navigator>
      <SubscriptionStack.Screen
        options={{
          header: () => (
            <CustomHeader title={t("attributes.subscriptionPlan")} />
          ),
        }}
        name="ChildrenSubscription"
        component={ChildrenSubscription}
      />
      <SubscriptionStack.Screen
        options={{
          header: () => (
            <CustomHeader title={t("attributes.subscriptionPlan")} />
          ),
        }}
        name="CancelSubscription"
        component={CancelSubscription}
      />
      <SubscriptionStack.Screen
        options={{
          header: () => (
            <CustomHeader title={t("attributes.subscriptionPlan")} />
          ),
        }}
        name="SubscriptionPayment"
        component={SubscriptionPayment}
      />
      <SubscriptionStack.Screen
        options={{
          header: () => <CustomHeader title={t("attributes.payments")} />,
        }}
        name="AddCard"
        component={AddCard}
      />
      <SubscriptionStack.Screen
        options={{
          header: () => <CustomHeader title={t("Payment")} />,
        }}
        name="ManageCards"
        component={ManageCards}
      />
    </SubscriptionStack.Navigator>
  );

  const RequestRideStackScreen = () => (
    <RequestRideStack.Navigator>
      <RequestRideStack.Screen
        options={{
          header: () => <CustomHeader title={t("attributes.requestRide")} />,
        }}
        name="RequestRide"
        component={RequesRide}
      />
      <RequestRideStack.Screen
        options={{
          header: () => <CustomHeader title={t("attributes.homeAddress")} />,
        }}
        name="HomeAddress"
        component={HomeAddress}
      />
    </RequestRideStack.Navigator>
  );

  const HomeTabScreen = () => {
    return (
      <Tab.Navigator
        tabBar={({ state, descriptors, navigation }) => (
          <StyledView
            className={`flex-row bg-white justify-between items-center px-[30px] py-[5px] ${Platform.OS === "ios" && deviceWidth > 375 ? "pb-[25px]" : ""
              }`}
          >
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const label =
                options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                    ? options.title
                    : route.name;

              const isFocused = state.index === index;

              let icon;

              if (label === t("attributes.menuHome")) {
                icon = isFocused ? <HomeActiveIcon /> : <HomeIcon />;
              } else if (label === t("attributes.menuTracking")) {
                icon = isFocused ? <TrackingActiveIcon /> : <TrackingIcon />;
              } else if (label === t("attributes.menuProfile")) {
                icon = isFocused ? <UserActiveIcon /> : <UserIcon />;
              }

              const onPress = () => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };

              const onLongPress = () => {
                navigation.emit({
                  type: "tabLongPress",
                  target: route.key,
                });
              };

              return (
                <TouchableOpacity
                  key={index}
                  accessibilityRole="button"
                  accessibilityStates={isFocused ? ["selected"] : []}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  onLongPress={onLongPress}
                >
                  <StyledView className="items-center">
                    {icon}
                    <StyledText
                      className={`${isFocused ? "text-[#204F50]" : "text-[#204F504D]"
                        } mt-1 text-xs font-serrat-medium`}
                    >
                      {label}
                    </StyledText>
                  </StyledView>
                </TouchableOpacity>
              );
            })}
          </StyledView>
        )}
      >
        <Tab.Screen
          options={{ headerShown: false, title: t("attributes.menuHome") }}
          name="Home"
          component={HomeStackScreen}
        />
        <Tab.Screen
          options={{ headerShown: false, title: t("attributes.menuTracking") }}
          name="Tracking"
          component={TrackingStackScreen}
        />
        <Tab.Screen
          options={{
            headerShown: false,
            title: t("attributes.menuProfile"),
          }}
          name="Account"
          component={ProfileStackScreen}
        />
      </Tab.Navigator>
    );
  };

  const HomeStackScreen = () => {
    return (
      <HomeStack.Navigator>
        <HomeStack.Screen
          options={{ headerShown: false }}
          name="Home Page"
          component={MainPage}
        />
        <HomeStack.Screen
          options={{
            headerShown: false,
          }}
          name="Notifications"
          component={Notifications}
        />
        <HomeStack.Screen
          options={{
            headerShown: false,
          }}
          name="RequestRide"
          component={RequestRideStackScreen}
        />

        <HomeStack.Screen
          options={{
            headerShown: false,
          }}
          name="Success"
          component={RegisterSuccess}
        />
        <HomeStack.Screen
          options={{
            header: () => (
              <CustomHeader title={t("attributes.subscriptionPlan")} />
            ),
          }}
          name="CancelSubscription"
          component={CancelSubscription}
        />
      </HomeStack.Navigator>
    );
  };

  const ProfileStackScreen = () => {
    return (
      <ProfileStack.Navigator>
        <ProfileStack.Screen
          options={{ headerShown: false }}
          name="Profile Page"
          component={Profile}
        />
        <ProfileStack.Screen
          options={{
            header: () => <CustomHeader title={t("attributes.payments")} />,
          }}
          name="Payment"
          component={Payments}
        />
        <ProfileStack.Screen
          options={{
            header: () => (
              <CustomHeader title={t("attributes.subscriptionHistory")} />
            ),
          }}
          name="SubscriptionHistory"
          component={SubscriptionHistory}
        />
        <ProfileStack.Screen
          options={{
            headerShown: false,
          }}
          name="SubscriptionStack"
          component={SubscriptionStackScreen}
        />
        <ProfileStack.Screen
          options={{
            header: () => <CustomHeader title="FAQ" />,
          }}
          name="FAQ"
          component={FAQ}
        />
         <ProfileStack.Screen
          options={{
            header: () => <CustomHeader title={t("attributes.profile")} />,
          }}
          name="EditProfile"
          component={EditProfile}
        />
        <ProfileStack.Screen
          options={{
            header: () => (
              <CustomHeader bg={"bg-white"} title={t("attributes.Settings")} />
            ),
          }}
          name="Settings"
          component={Settings}
        />
        <ProfileStack.Screen
          options={{
            header: () => <CustomHeader title={t("attributes.Settings")} />,
          }}
          name="Languages"
          component={Languages}
        />
        <ProfileStack.Screen
          options={{
            header: () => (
              <CustomHeader title={t("attributes.termsAndConditions")} />
            ),
          }}
          name="TermsAndConditions"
          component={TermsAndConditions}
        />
        <ProfileStack.Screen
          options={{
            header: () => (
              <CustomHeader title={t("attributes.privacyPolicy")} />
            ),
          }}
          name="PrivacyPolicy"
          component={PrivacyPolicy}
        />
        <ProfileStack.Screen
          options={{
            header: () => <CustomHeader title={t("attributes.help")} />,
          }}
          name="Support"
          component={Support}
        />
        <ProfileStack.Screen
          options={{
            header: () => (
              <CustomHeader
                bg="bg-white"
                title={t("attributes.resetPasswordTitle")}
              />
            ),
          }}
          name="ResetPassword"
          component={ResetPassword}
        />
      </ProfileStack.Navigator>
    );
  };

  const TrackingStackScreen = () => (
    <TrackingStack.Navigator>
      <TrackingStack.Screen
        options={{ headerShown: false }}
        name="Tracking"
        component={Tracking}
      />
    </TrackingStack.Navigator>
  );

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["right", "top", "left"]}>
      {renderCompleted ? (
        <>
          {connected === true ? (
            <MainStack.Navigator initialRouteName="MainstackTab">
              <MainStack.Screen
                options={{ headerShown: false, animationEnabled: false }}
                name="MainstackTab"
                component={HomeTabScreen}
              />
              <MainStack.Screen
                options={{ headerShown: false, animationEnabled: false }}
                name="TrackingScreen"
                component={TrackingStackScreen}
              />
              <MainStack.Screen
                options={{
                  header: () => <CustomHeader title={t("attributes.registerSignin")} />,
                }}
                name="SignIn"
                component={SignIn}
              />
              <MainStack.Screen
                options={{
                  header: () => (
                    <CustomHeader title={t("attributes.Settings")} />
                  ),
                }}
                name="SettingsSignIn"
                component={Settings}
              />
              <MainStack.Screen
                options={{
                  headerShown: false,
                }}
                name="LanguagesSignIn"
                component={ChooseLanguageBottomSheet}
              />
              <MainStack.Screen
                options={{
                  headerShown: false,
                }}
                name="Welcome"
                component={WelcomeBottomSheet}
              />
              <MainStack.Screen
                options={{
                  header: () => (
                    <CustomHeader title={t("attributes.termsAndConditions")} />
                  ),
                }}
                name="TermsAndConditionsSignup"
                component={TermsAndConditionsSignup}
              />
              <MainStack.Screen
                options={{
                  header: () => (
                    <CustomHeader title={t("attributes.privacyPolicy")} />
                  ),
                }}
                name="PrivacyPolicySignup"
                component={PrivacyPolicySignup}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="ForgotPassword"
                component={ForgotPassword}
              />
              <MainStack.Screen
                options={{
                  header: () => <CustomHeader title={t("attributes.signUp")} />,
                }}
                name="SignUp"
                component={SignUp}
              />
            </MainStack.Navigator>
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

export default NavigationMenu;
