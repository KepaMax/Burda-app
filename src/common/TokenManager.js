import {
  setInternetCredentials,
  getInternetCredentials,
  resetInternetCredentials,
} from "react-native-keychain";
import { Alert } from "react-native";
import { useEffect, createContext, useState } from "react";
import "../locales/index";
import { useTranslation } from "react-i18next";
const AuthContext = createContext();
import { API_URL } from "@env";

export default AuthContext;

export const TokenManager = ({ children }) => {
  const [trigger, setTrigger] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedOutAsGuest, setLoggedOutAsGuest] = useState(false);
  const [addStudent, setAddStudent] = useState(false);
  const { t } = useTranslation();

  // async function checkIfValid() {
  //   const studentToken = await getStudentAccessTokenFromMemory();
  //   const supervisorToken = await getSupervisorAccessTokenFromMemory();
  //   const url = 'https://api.tredu.io/api/jwt/verify/';

  //   const postData = {
  //     token: studentToken ? studentToken : supervisorToken,
  //   };

  //   try {
  //     const response = await fetch(url, {
  //       method: 'POST',
  //       headers: {
  //         Accept: 'application/json',
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(postData),
  //     });

  //     const data = await response.json();
  //     if (data.type === 'client_error') {
  //       studentToken ? refreshStudentTokens() : refreshSupervisorTokens();
  //     } else {
  //       studentToken || supervisorToken ? setIsLoggedIn(true) : null;
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // }

  const getGuestMode = async () => {
    const studentCredentials = await getInternetCredentials(
      "student_access_token"
    );
    const studentToken = studentCredentials.password;
    const supervisorCredentials = await getInternetCredentials(
      "supervisor_access_token"
    );
    const supervisorToken = supervisorCredentials.password;
    const guestMode = !supervisorToken && !studentToken ? true : false;

    return guestMode;
  };

  const setUserType = async (userType) => {
    await setInternetCredentials("userType", "userType", userType);
  };

  const getUserType = async () => {
    const credentials = await getInternetCredentials("userType");
    const user = credentials.password;
    return user;
  };

  const setLanguage = async (lang) => {
    await setInternetCredentials("language", "language", lang);
  };

  const getLanguage = async () => {
    const credentials = await getInternetCredentials("language");
    const language = credentials.password;
    return language ? language : "en";
  };

  const setInitialLogin = async (prop) => {
    await setInternetCredentials(
      "initialLogin",
      "initialLogin",
      JSON.stringify(prop)
    );
  };

  const getInitialLogin = async () => {
    const credentials = await getInternetCredentials("initialLogin");
    const initialLogin = credentials.password;
    return JSON.parse(initialLogin);
  };

  const getStudentAccessTokenFromMemory = async () => {
    const credentials = await getInternetCredentials("student_access_token");
    const token = credentials.password;
    return token;
  };

  const getSupervisorAccessTokenFromMemory = async () => {
    const credentials = await getInternetCredentials("supervisor_access_token");
    const token = credentials.password;
    return token;
  };

  async function refreshStudentTokens() {
    const url = `${API_URL}jwt/refresh/`;
    const accessToken = await getStudentAccessTokenFromMemory();
    const refreshT = await getInternetCredentials("student_refresh_token");
    const refreshToken = refreshT.password;

    const postData = {
      refresh: refreshToken,
    };

    if (accessToken) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });

        const data = await response.json();
        if (data.type !== "client_error") {
          await setInternetCredentials(
            "student_access_token",
            "student_access_token",
            data.access
          );

          await setInternetCredentials(
            "student_refresh_token",
            "student_refresh_token",
            data.refresh
          );
          setIsLoggedIn(true);
        } else {
          Alert.alert(
            t("attributes.error"),
            t("attributes.sessionExpired"),
            [
              {
                text: "OK",
                onPress: () => {
                  logOut();
                  setTrigger(!trigger);
                },
              },
            ],
            { cancelable: false }
          );
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error(error);
        setIsLoggedIn(false);
      }
    }
  }

  async function refreshSupervisorTokens() {
    const url = `${API_URL}jwt/refresh/`;
    const accessToken = await getSupervisorAccessTokenFromMemory();
    const refreshT = await getInternetCredentials("supervisor_refresh_token");
    const refreshToken = refreshT.password;

    const postData = {
      refresh: refreshToken,
    };

    if (accessToken) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });

        const data = await response.json();
        if (data.type !== "client_error") {
          await setInternetCredentials(
            "supervisor_access_token",
            "supervisor_access_token",
            data.access
          );
          await setInternetCredentials(
            "supervisor_refresh_token",
            "supervisor_refresh_token",
            data.refresh
          );
          setIsLoggedIn(true);
        } else {
          Alert.alert(
            t("attributes.error"),
            t("attributes.sessionExpired"),
            [
              {
                text: "OK",
                onPress: () => {
                  logOut();
                  setTrigger(!trigger);
                },
              },
            ],
            { cancelable: false }
          );
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error(error);
        setIsLoggedIn(false);
      }
    }
  }

  async function logOut() {
    resetInternetCredentials("student_access_token");
    resetInternetCredentials("student_refresh_token");
    resetInternetCredentials("supervisor_access_token");
    resetInternetCredentials("supervisor_refresh_token");
    resetInternetCredentials("userType");
    resetInternetCredentials("guestMode");
    setIsLoggedIn(false);
    setTrigger(!trigger);
  }

  async function getNewStudentTokens(username, password) {
    const url = `${API_URL}jwt/create/students/`;

    const postData = {
      username: username,
      password: password,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();
      if (response.ok) {
        setUserType("student");
        setTrigger(!trigger);
        setInitialLogin("false");
        const access = data.access;
        const refresh = data.refresh;
        await setInternetCredentials(
          "student_access_token",
          "student_access_token",
          access
        );
        await setInternetCredentials(
          "student_refresh_token",
          "student_refresh_token",
          refresh
        );
        setIsLoggedIn(true);
        return true;
      } else {
        Alert.alert("Login failed, please try again");
        return false;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function getNewSupervisorTokens(username, password) {
    const url = `${API_URL}jwt/create/supervisors/`;

    const postData = {
      username: username,
      password: password,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (response.ok) {
        setUserType("supervisor");
        setTrigger(!trigger);
        setInitialLogin("false");
        const access = data.access;
        const refresh = data.refresh;
        if (access) {
          await setInternetCredentials(
            "supervisor_access_token",
            "supervisor_access_token",
            access
          );
        }
        if (refresh) {
          await setInternetCredentials(
            "supervisor_refresh_token",
            "supervisor_refresh_token",
            refresh
          );
        }
        setIsLoggedIn(true);
        return true;
      } else {
        Alert.alert("Login failed, please try again");
        return false;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const studentToken = await getStudentAccessTokenFromMemory();
      const supervisorToken = await getSupervisorAccessTokenFromMemory();

      if (studentToken) {
        refreshStudentTokens();
      }

      if (supervisorToken) {
        refreshSupervisorTokens();
      }
    }, 4 * 60 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  let contextData = {
    getStudentAccessTokenFromMemory: getStudentAccessTokenFromMemory,
    getSupervisorAccessTokenFromMemory: getSupervisorAccessTokenFromMemory,
    getNewStudentTokens: getNewStudentTokens,
    getNewSupervisorTokens: getNewSupervisorTokens,
    logOut: logOut,
    setTrigger: setTrigger,
    trigger: trigger,
    refreshStudentTokens: refreshStudentTokens,
    refreshSupervisorTokens: refreshSupervisorTokens,
    isLoggedIn: isLoggedIn,
    setLanguage: setLanguage,
    getLanguage: getLanguage,
    setAddStudent: setAddStudent,
    addStudent: addStudent,
    setInitialLogin: setInitialLogin,
    getInitialLogin: getInitialLogin,
    getUserType: getUserType,
    getGuestMode: getGuestMode,
    setLoggedOutAsGuest: setLoggedOutAsGuest,
    loggedOutAsGuest: loggedOutAsGuest,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
