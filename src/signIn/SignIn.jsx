import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { useState, useCallback, useEffect, useContext } from "react";
import { styled } from "nativewind";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import AuthContext from "../common/TokenManager";
import EyeIcon from "../assets/icons/eye.svg";
import EyeOpenIcon from "../assets/icons/eyeOpen.svg";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import "../locales/index";
import { useTranslation } from "react-i18next";
import { StyledTextInput, StyledTouchableOpacity } from "../common/components/StyledComponents";

const StyledText = styled(Text);
const StyledView = styled(View);

const SignIn = () => {
  const {
    getNewStudentTokens,
    getNewSupervisorTokens,
    setTrigger,
    trigger,
    refreshStudentTokens,
    refreshSupervisorTokens,
    getLanguage,
    loggedOutAsGuest,
  } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("supervisor");
  const [loading, setLoading] = useState();
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [language, setLanguage] = useState("");
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    loggedOutAsGuest ? navigation.navigate("SignUp") : null;
  }, []);

  const [supervisorFormData, setSupervisorFormData] = useState({
    username: "",
    password: "",
  });

  async function loginAs() {
    setLoading(true);
    if (activeTab === "supervisor") {
      if (supervisorFormData.username && supervisorFormData.password) {
        const loginSuccessful = await getNewSupervisorTokens(
          supervisorFormData.username,
          supervisorFormData.password
        );
        setTrigger(!trigger);
        setLoading(false);
        loginSuccessful ? navigation.navigate("MainstackTab") : null;
      } else {
        setLoading(false);
        Alert.alert("Username and password cannot be empty");
      }
    } else {
      if (studentFormData.username && studentFormData.password) {
        const loginSuccessful = await getNewStudentTokens(
          studentFormData.username,
          studentFormData.password
        );
        setTrigger(!trigger);
        setLoading(false);
        loginSuccessful ? navigation.navigate("MainstackTab") : null;
      } else {
        setLoading(false);
        Alert.alert("Username and password cannot be empty");
      }
    }
  }

  const onTabPress = useCallback((tabName) => {
    setActiveTab(tabName);
  }, []);

  const handleSupervisorInputChange = (name, value) => {
    setSupervisorFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleStudentInputChange = (name, value) => {
    setStudentFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  useEffect(() => {
    refreshStudentTokens();
    refreshSupervisorTokens();
  }, []);

  useEffect(() => {
    const currentLanguage = async () => {
      lang = await getLanguage();
      if (lang) {
        i18n.changeLanguage(lang);
        setLanguage(lang);
      }
    };
    currentLanguage();
  }, [isFocused]);

  return (
    <StyledView className="flex-1 bg-white p-4">
      <KeyboardAwareScrollView>

        <StyledView className="gap-4 mb-3">
          <StyledTextInput
            value={supervisorFormData.username}
            placeholder={t("attributes.profileEmail")}
            name="username"
            placeholderTextColor="#868782"
            className="border-[1px] text-black font-poppi text-base placeholder:font-poppi focus:bg-[#F3F7FF] border-[#EDEFF3] focus:border-[#7658F2] rounded-[18px] px-4"
            onChangeText={(value) =>
              handleSupervisorInputChange("username", value)
            }

          />

          <StyledView className="rounded-[18px] mt-2 relative justify-center border-[1px] focus:bg-[#F3F7FF] border-[#EDEFF3] focus:border-[#7658F2]">

            <StyledTextInput
              value={supervisorFormData.password}
              name="password"
              placeholderTextColor="#757575"
              onChangeText={(value) =>
                handleSupervisorInputChange("password", value)
              }
              placeholder={t("attributes.registerParentPassword")}
              secureTextEntry={!isPasswordVisible}
              className="placeholder:font-poppi text-black font-poppi-medium placeholder:text-base  rounded-[8px] px-4"
            />

            <StyledView className="absolute right-[10px]">
              <TouchableOpacity
                onPress={() => {
                  setPasswordVisible(!isPasswordVisible);
                }}
              >
                {isPasswordVisible ? <EyeOpenIcon /> : <EyeIcon />}
              </TouchableOpacity>
            </StyledView>
          </StyledView>
          <StyledView className="w-auto flex-row items-center justify-end">
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("ForgotPassword");
              }}
            >
              <StyledText className="font-poppi text-sm text-[#204F50]">
                {t("attributes.signinForgotPassword")}
              </StyledText>
            </TouchableOpacity>
          </StyledView>
        </StyledView>
        <StyledTouchableOpacity
          onPress={async () => {
            loginAs();
          }}
        >
          <StyledView className=" p-[10px] bg-[#76F5A4] rounded-[18px]">
            <StyledText className="text-center text-[#204F50] text-base font-poppi-semibold">
              {t("attributes.registerSignin")}
            </StyledText>
          </StyledView>
        </StyledTouchableOpacity>
        <StyledView className="w-full mt-10 flex-row items-center justify-center">
          <StyledText className="font-poppi text-base text-[#91919F]">
            {t("attributes.registerSignup")}
          </StyledText>
          <StyledTouchableOpacity
            onPress={() => {
              navigation.navigate("SignUp", { signIn: true });
            }}
          >
            <StyledText className="font-poppi-semibold ml-2 text-base text-[#204F50]">
              {t("attributes.signUp")}
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </KeyboardAwareScrollView>
    </StyledView>
  );
};

export default SignIn;
