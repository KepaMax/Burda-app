import { useEffect, useState, useContext } from "react";
import AuthContext from "../common/TokenManager";
import {
  ImageBackground,
  Dimensions,
  Alert,
  Linking,
  TouchableOpacity,
} from "react-native";
import "../locales/index";
import { useTranslation } from "react-i18next";
import { request, PERMISSIONS } from "react-native-permissions";
import QRCodeScanner from "react-native-qrcode-scanner";
import Bg from "../assets/icons/scannerHeaderBg.png";
import Warning from "../assets/icons/qrWarning.svg";
import { useNavigation } from "@react-navigation/native";
import { StyledView, StyledText } from "../common/components/StyledComponents";

const QR = () => {
  const {
    getStudentAccessTokenFromMemory,
    getGuestMode,
  } = useContext(AuthContext);
  const { t } = useTranslation();
  const [cameraAccess, setCameraAccess] = useState(false);
  const navigation = useNavigation();
  const [guestMode, setGuestMode] = useState(null);
  const [renderCompleted, setRenderCompleted] = useState(false);
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight = Dimensions.get("window").height;

  const attendStudent = async (url) => {
    const token = await getStudentAccessTokenFromMemory();

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        Alert.alert(t("attributes.attendanceSuccess"));
      } else {
        Alert.alert(data.errors[0].detail);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const checkPermission = () => {
    request(
      Platform.OS === "ios"
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA
    ).then((result) => {
      result === "granted"
        ? setCameraAccess(true)
        : Alert.alert(
            t("attributes.error"),
            t("attributes.cameraErrorMessage"),
            [
              {
                text: t("attributes.searchCancel"),
                onPress: () => navigation.navigate("Home Page"),
              },
              {
                text: t("attributes.goToSettings"),
                onPress: () => Linking.openSettings(),
              },
            ]
          );
    });
  };

  useEffect(() => {
    const guestMode = async () => {
      const mode = await getGuestMode();
      setGuestMode(mode);
      setRenderCompleted(true);

      if (!mode) {
        checkPermission();
      }
    };

    guestMode();
  }, []);

  return guestMode ? (
    <StyledView className="bg-[#f6f6f6] h-full items-center justify-center">
      <StyledView className="max-w-[330px] w-full border border-[#0079E9] py-[25px] px-[35px] rounded-[8px]">
        <StyledText className="text-base text-[#4B465C] font-serrat text-center">
          {t("attributes.needAccountQR")}
        </StyledText>
        <StyledView className="gap-4 mt-1">
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SignUp");
            }}
          >
            <StyledView className="p-[8px] bg-[#0079E9] rounded-[8px]">
              <StyledText className="text-center text-white text-lg font-serrat-medium">
                {t("attributes.registerButton")}
              </StyledText>
            </StyledView>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SignIn");
            }}
          >
            <StyledView className="p-[8px] rounded-[8px] border border-[#0079E9]">
              <StyledText className="text-center text-[#0079E9] text-lg font-serrat-medium">
                {t("attributes.registerSignin")}
              </StyledText>
            </StyledView>
          </TouchableOpacity>
        </StyledView>
      </StyledView>
    </StyledView>
  ) : renderCompleted ? (
    <>
      {cameraAccess ? (
        <QRCodeScanner
          containerStyle={{ flex: 1 }}
          cameraContainerStyle={{
            height: deviceHeight / 2,
            overflow: "hidden",
          }}
          reactivate={true}
          topContent={
            <ImageBackground
              source={Bg}
              style={{
                width: deviceWidth,
                height: 190,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <StyledText className="px-5 text-black text-center text-lg font-serrat-medium">
                {t("attributes.scanQR")}
              </StyledText>
            </ImageBackground>
          }
          onRead={(e) => {
            attendStudent(e.data);
          }}
        />
      ) : (
        <StyledView className="w-full h-full items-center justify-center">
          <StyledView className="items-center">
            <Warning />
            <StyledText className="text-black mt-6 font-serrat-medium text-xl text-center">
              {t("attributes.noCameraAccessGranted")}
            </StyledText>
            <TouchableOpacity
              onPress={() => {
                Linking.openSettings();
              }}
            >
              <StyledText className="text-zinc-400 mt-2 font-serrat-medium text-lg text-center">
                {t("attributes.goToSettings")}
              </StyledText>
            </TouchableOpacity>
          </StyledView>
        </StyledView>
      )}
    </>
  ) : null;
};

export default QR;
