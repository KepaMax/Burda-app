import {
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { useState, useContext } from "react";
import AuthContext from "../common/TokenManager";
import { useNavigation, useRoute } from "@react-navigation/native";
import EyeIcon from "../assets/icons/eye.svg";
import EyeOpenIcon from "../assets/icons/eyeOpen.svg";
import TermsConditions from "../assets/icons/termsConditions.svg";
import TermsConditionsFill from "../assets/icons/termsConditionsFill.svg";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import "../locales/index";
import { useTranslation } from "react-i18next";
import Background from "../assets/images/background.png";
import { ScrollView } from "react-native-gesture-handler";
import ArrowLefIcon from "../../assets/icons/arrow-left-header.svg"
import {
  StyledText,
  StyledView,
  StyledTouchableOpacity,
  StyledTextInput,
} from "../common/components/StyledComponents";
import ChevronDownIcon from "../assets/icons/chevronDownBlue.svg";
import ChevronUpIcon from "../assets/icons/chevronUpBlue.svg";
import ChevronLeftIcon from "../assets/icons/chevron-left.svg";
import { API_URL } from "@env";
import CustomSelect from "../common/components/CustomSelect";

const SignUp = () => {
  const route = useRoute();
  const signIn = route.params?.signIn;
  const { getNewSupervisorTokens } = useContext(AuthContext);
  const [errors, setErrors] = useState();
  const [supervisorFormData, setSupervisorFormData] = useState({
    password: "",
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
  });
  const [accepted, setAccepted] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isPasswordConfirmVisible, setPasswordConfirmVisible] = useState(false);
  const navigation = useNavigation();
  const [prefixDropdownOpen, setPrefixDropdownOpen] = useState(false);
  const [selectedPrefix, setSelectedPrefix] = useState(null);
  const prefixData = [
    {
      label: "010",
      value: "10",
    },
    {
      label: "050",
      value: "50",
    },
    {
      label: "051",
      value: "51",
    },
    {
      label: "055",
      value: "55",
    },
    {
      label: "060",
      value: "60",
    },
    {
      label: "070",
      value: "70",
    },
    {
      label: "077",
      value: "77",
    },
    {
      label: "099",
      value: "99",
    },
  ];

  const [loading, setLoading] = useState();
  const { t } = useTranslation();
  const [phoneNumValue, setPhoneNumValue] = useState();
  const [passwordCheck, setPasswordCheck] = useState();

  async function createSupervisorAccount(route) {
    setLoading(true);
    const url = `${API_URL}supervisors/`;

    const addNumber = {
      ...supervisorFormData,
      email: supervisorFormData.email.toLowerCase(),
      phone_number: `+994${selectedPrefix}${phoneNumValue}`,
    };

    try {
      if (accepted) {
        if (selectedPrefix) {
          if (
            passwordCheck &&
            supervisorFormData.password &&
            passwordCheck !== supervisorFormData.password
          ) {
            setLoading(false);
            setErrors({
              ...errors,
              password: t("attributes.passwordNoMatch"),
            });
            setPasswordVisible(true);
          } else {
            const response = await fetch(url, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(addNumber),
            });

            const data = await response.json();
            if (!response.ok) {
              setLoading(false);
              const newData = {};

              data.errors.forEach((item) => {
                newData[item.attr] = item.detail;
              });

              setErrors(newData);
            } else {
              setErrors(null);
              setLoading(false);
              const signupSuccessful = await getNewSupervisorTokens(
                supervisorFormData.email.toLowerCase(),
                supervisorFormData.password
              );
              signupSuccessful && route
                ? navigation.navigate(route)
                : navigation.navigate("MainstackTab");
            }
          }
        } else {
          setLoading(false);
          Alert.alert(t("attributes.mustChoosePrefix"));
        }
      } else {
        setLoading(false);
        Alert.alert(t("attributes.readTermsConditionsAlert"));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const handleSupervisorInputChange = (name, value) => {
    // Check if the name is first_name or last_name
    if (name === "first_name" || name === "last_name") {
      // Check if the value contains any numbers
      if (/\d/.test(value)) {
        // If the value contains numbers, do not update the state
        return;
      }
    }

    // Update the state only if the conditions are met
    setSupervisorFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleNumberChange = (value) => {
    setPhoneNumValue(value);
  };

  return (
    <>
      <StyledView className="flex-1 p-4 bg-white">
        <StyledView
          className={`${loading === true ? "flex" : "hidden"
            } bg-black/20 h-screen z-50 w-screen absolute items-center justify-center`}
        >
          <ActivityIndicator size="large" color="#0079E9" />
        </StyledView>
        <KeyboardAwareScrollView>
          <StyledView >
            <StyledText className="font-poppi-medium text-base text-[#C0C0BF] mb-3">
              {t("attributes.registerInfoParentTitle")}
            </StyledText>
            <StyledView className="gap-4 mb-4">
              <StyledView className="w-auto">
                <StyledTextInput
                  value={supervisorFormData.email}
                  placeholder={t("attributes.registerParentEmail")}
                  name="email"
                  placeholderTextColor={errors?.email ? "#FF3115" : "#868782"}
                  onChangeText={(value) =>
                    handleSupervisorInputChange("email", value)
                  }
                  className={`border-[1px] text-black font-poppi text-base placeholder:font-poppi ${errors?.phone_number
                    ? "border-red-400 bg-red-50"
                    : "border-[#EDEFF3] bg-white focus:border-[#7658F2]"
                    } focus:bg-[#F3F7FF]  rounded-[18px] px-4`}

                />
                <StyledText
                  className={`text-red-400 text-xs font-serrat mt-1 ${errors?.email ? "block" : "hidden"
                    }`}
                >
                  {errors?.email}
                </StyledText>
              </StyledView>

              <StyledView className="flex-row">
                <CustomSelect items={prefixData} selectedItem={selectedPrefix} setSelectedItem={setSelectedPrefix} placeholder={"Select"} disabled={false} />

                <StyledView className="w-[70%]">
                  <TextInput
                    maxLength={7}
                    keyboardType="numeric"
                    value={phoneNumValue}
                    placeholder={t("attributes.profileNumber")}
                    name="phone_number"
                    placeholderTextColor={
                      errors?.phone_number ? "#FF3115" : "#757575"
                    }
                    onChangeText={(value) => handleNumberChange(value)}
                    className={`border-[1px] text-black py-[10px]  font-poppi text-base placeholder:font-poppi ${errors?.phone_number
                      ? "border-red-400 bg-red-50"
                      : "border-[#EDEFF3] bg-white focus:border-[#7658F2]"
                      } focus:bg-[#F3F7FF]  rounded-[18px] rounded-l-none px-4`}
                  />
                </StyledView>
                <StyledText
                  className={`text-red-400 text-xs font-serrat mt-1 ${errors?.phone_number ? "block" : "hidden"
                    }`}
                >
                  {errors?.phone_number}
                </StyledText>
              </StyledView>

              <StyledView className="w-auto">
                <StyledView className="relative justify-center">
                  <TextInput
                    value={supervisorFormData.password}
                    placeholder={t("attributes.registerParentPassword")}
                    name="password"
                    placeholderTextColor={
                      errors?.password ? "#FF3115" : "#757575"
                    }
                    secureTextEntry={!isPasswordVisible}
                    onChangeText={(value) =>
                      handleSupervisorInputChange("password", value)
                    }
                    className={`border-[1px] text-black py-[10px]  font-poppi text-base placeholder:font-poppi ${errors?.phone_number
                      ? "border-red-400 bg-red-50"
                      : "border-[#EDEFF3] bg-white focus:border-[#7658F2]"
                      } focus:bg-[#F3F7FF]  rounded-[18px] px-4`}
                  />
                  <StyledView className={`absolute right-[10px]`}>
                    <TouchableOpacity
                      onPress={() => {
                        setPasswordVisible(!isPasswordVisible);
                      }}
                    >
                      {isPasswordVisible ? <EyeOpenIcon /> : <EyeIcon />}
                    </TouchableOpacity>
                  </StyledView>
                </StyledView>
                <StyledView className="relative justify-center mt-4">
                  <TextInput
                    value={passwordCheck}
                    placeholder={t("attributes.confirmPassword")}
                    name="password"
                    placeholderTextColor={
                      errors?.password ? "#FF3115" : "#757575"
                    }
                    secureTextEntry={!isPasswordConfirmVisible}
                    onChangeText={(value) => setPasswordCheck(value)}
                    className={`border-[1px] text-black py-[10px]  font-poppi text-base placeholder:font-poppi ${errors?.phone_number
                      ? "border-red-400 bg-red-50"
                      : "border-[#EDEFF3] bg-white focus:border-[#7658F2]"
                      } focus:bg-[#F3F7FF]  rounded-[18px] px-4`}
                  />
                  <StyledView
                    className={`absolute right-[10px] ${errors?.password ? "pb-5" : null
                      }`}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setPasswordConfirmVisible(!isPasswordConfirmVisible);
                      }}
                    >
                      {isPasswordConfirmVisible ? <EyeOpenIcon /> : <EyeIcon />}
                    </TouchableOpacity>
                  </StyledView>
                  <StyledText
                    className={`text-red-400 text-xs font-serrat mt-1 ${errors?.password ? "block" : "hidden"
                      }`}
                  >
                    {errors?.password}
                  </StyledText>
                </StyledView>
              </StyledView>

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("SignIn");
                }}
              >
                <StyledText className="font-poppi text-sm text-[#204F50]">
                  {t("attributes.registerSignIn")}
                </StyledText>
              </TouchableOpacity>
            </StyledView>
            <StyledView className="w-auto flex-row px-4 mb-3">
              <StyledTouchableOpacity
                onPress={() => {
                  setAccepted(!accepted);
                }}
              >
                {accepted ? <TermsConditionsFill /> : <TermsConditions />}
              </StyledTouchableOpacity>

              <StyledView className="flex-row px-2  items-center flex-wrap gap-1 w-full">
                <StyledText className="font-poppi text-sm text-[#91919F]">
                  {t("attributes.readAndAgreed")}
                </StyledText>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("TermsAndConditionsSignup");
                  }}
                >
                  <StyledText className="font-poppi text-sm text-[#204F50]">
                    {t("attributes.termsOfUse")}
                  </StyledText>
                </TouchableOpacity>
                <StyledText className="font-poppi text-sm text-[#91919F]">
                  {t("attributes.and")}
                </StyledText>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("PrivacyPolicySignup");
                  }}
                >
                  <StyledText className="font-poppi  text-sm text-[#204F50]">
                    {t("attributes.privacyPolicySignUp")}
                  </StyledText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("TermsAndConditionsSignup");
                  }}
                >
                </TouchableOpacity>
              </StyledView>
            </StyledView>

          </StyledView>
        </KeyboardAwareScrollView>
        <StyledTouchableOpacity
          className="bg-[#76F5A4] rounded-[18px] p-[10px]"
          onPress={() => {
            createSupervisorAccount();
          }}
        >
          <StyledText className="text-center text-[#204F50] text-base font-poppi-semibold">
            {t("attributes.verify")}
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </>
  );
};

export default SignUp;
