/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

// @ts-nocheck
import "react-native-gesture-handler";
import NavigationMenu from "./src/common/components/NavigationMenu";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Settings } from "react-native-fbsdk-next";
import { useEffect, useContext, useState } from "react";
import AuthContext from "./src/common/TokenManager";
import { StatusBar, Platform } from "react-native";
import { useTranslation } from "react-i18next";
import firebase from "@react-native-firebase/app";
import messaging from "@react-native-firebase/messaging";
import { request, PERMISSIONS } from "react-native-permissions";
import CalendarBottomSheet from "./src/common/components/CalendarBottomSheet";
import { StyledTouchableOpacity, StyledView } from "./src/common/components/StyledComponents";
import RequesRide from "./src/requestRide/RequesRide";
import AddChild from "./src/addChild/AddChild";
import Success from "./src/addChild/Success";
import SubscriptionPlan from "./src/subscriptionPlan/SubscriptionPlan";
import SubscriptionInfo from "./src/subscriptionPlan/SubscriptionInfo";
import ChildrenSubscription from "./src/subscriptionPlan/ChildrenSubscription";
import SubscriptionPayment from "./src/subscriptionPlan/SubscriptionPayment";
import TransferDetails from "./src/payment/components/TransferDetails";
import AddCard from "./src/payment/AddCard";
import MyCards from "./src/profile/MyCards";
import ManageCards from "./src/payment/ManageCards";
import OTP from "./src/otp/OTP";
import RegisterSuccess from "./src/common/components/RegisterSuccces";
import ChooseLanguageBottomSheet from "./src/startPage/ChooseLanguageBottomSheet";
import WelcomeBottomSheet from "./src/startPage/WelcomeBottomSheet";

function App(): JSX.Element {
  const {
    getStudentAccessTokenFromMemory,
    getSupervisorAccessTokenFromMemory,
    refreshStudentTokens,
    refreshSupervisorTokens,
    getLanguage,
  } = useContext(AuthContext);
  const { i18n } = useTranslation();

  const androidConfig = {
    apiKey: "AIzaSyCFFG2rW4LO0POL0CZJAu3_xRD5hAYnG_k",
    projectId: "tredu-app",
    storageBucket: "tredu-app.appspot.com",
    databaseURL:
      "https://tredu-app-default-rtdb.europe-west1.firebasedatabase.app/",
    messagingSenderId: "22012870552",
    appId: "1:22012870552:android:d58ef8fe21e1f7311eb5ed",
  };

  const iosConfig = {
    apiKey: "AIzaSyCFFG2rW4LO0POL0CZJAu3_xRD5hAYnG_k",
    projectId: "tredu-app",
    storageBucket: "tredu-app.appspot.com",
    databaseURL:
      "https://tredu-app-default-rtdb.europe-west1.firebasedatabase.app/",
    messagingSenderId: "22012870552",
    appId: "1:22012870552:ios:530c3796a6ffc5281eb5ed",
  };

  if (firebase.apps.length === 0) {
    firebase.initializeApp(Platform.OS === "ios" ? iosConfig : androidConfig);
  }

  const getMessagingToken = async () => {
    let currentToken = "";
    if (!messaging) return;
    try {
      currentToken = await messaging.getToken({
        vapidKey: process.env.REACT_APP_FIREBASE_FCM_VAPID_KEY, // already hard-coded in test code
      });
      console.log("FCM registration token", currentToken);
    } catch (error) {
      console.log("An error occurred while retrieving token. ", error);
    }
    return currentToken;
  };

  getMessagingToken();

  async function requestUserPermission() {
    await messaging().requestPermission();
  }

  useEffect(() => {
    request(
      Platform.OS === "android" ? PERMISSIONS.ANDROID.POST_NOTIFICATIONS : null
    ).then((result) => {
      console.log(result)
      if (result === "granted") {
        requestUserPermission();
      }
    });

    if (Platform.OS === "ios") {
      requestUserPermission();
    }
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    messaging().subscribeToTopic("all");

    const unsubscribe = messaging().setBackgroundMessageHandler(
      async (remoteMessage) => {
        console.log(
          "A new FCM message arrived!",
          JSON.stringify(remoteMessage)
        );
      }
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onNotificationOpenedApp(() => {
      // navigation.navigate("Notifications");
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const linking = {
    prefixes: ["treduapp://"],
    config: {
      initialRouteName: "MainstackTab",
      screens: {
        MainstackTab: {
          screens: {
            Home: {
              path: "homepage/",
              screens: {
                CourseDetails: {
                  path: "courses/:id",
                },
                CourseClassDetails: {
                  path: "course-classes/:id",
                },
                InstructorDetails: {
                  path: "instructors/:id",
                },
                PartnerNetwork: {
                  path: "partner-networks/:id",
                },
                LastClasses: {
                  path: "limited-offers/",
                },
                Checkout: {
                  path: "checkout/:params",
                },
                PopularCourses: {
                  path: "popular-courses/:category?",
                },
                TopInstructors: {
                  path: "top-instructors/",
                },
                TopPartnerNetworks: {
                  path: "top-partner-networks/",
                },
              },
            },
            Activities: {
              path: "activities/",
            },
            QR: {
              path: "qr/",
            },
            Account: {
              path: "account/",
            },
            Search: {
              path: "search/",
            },
          },
        },
      },
    },
  };

  useEffect(() => {
    Settings.setAdvertiserTrackingEnabled(true);
  }, []);

  useEffect(() => {
    const getAndRefreshTokens = async () => {
      const studentToken = await getStudentAccessTokenFromMemory();
      const supervisorToken = await getSupervisorAccessTokenFromMemory();

      studentToken
        ? refreshStudentTokens()
        : supervisorToken
          ? refreshSupervisorTokens()
          : null;
    };

    getAndRefreshTokens();

    const currentLanguage = async () => {
      lang = await getLanguage();
      if (lang) {
        i18n.changeLanguage(lang);
      }
    };
    currentLanguage();
  }, []);

  const [showCalendar, setShowCalendar] = useState(false);
  const [date, setDate] = useState(null)

  const data = [
    { name: "Mikael", surname: "David" },
    { name: "Mikael", surname: "David" },
    { name: "Mikael", surname: "David" },
    { name: "Mikael", surname: "David" },
  ]
  return (
    <SafeAreaProvider style={{ backgroundColor: "#7658F2" }}>
      <StatusBar backgroundColor="#7658F2" barStyle="light-content" />
      <NavigationContainer linking={linking}>
        <NavigationMenu />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
