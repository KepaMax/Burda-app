import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Linking,
} from "react-native";
import { useState } from "react";
import { styled } from "nativewind";
import ArrowLefIcon from "../../assets/icons/arrow-left-header.svg"
import LockIcon from "../../assets/icons/lock-forgot-password.svg";
import "../locales/index";
import { useTranslation } from "react-i18next";
import Background from "../assets/images/background.png";
import { useNavigation } from "@react-navigation/native";
import { openInbox } from "react-native-email-link";
import { API_URL } from "@env";
import { StyledTouchableOpacity } from "../common/components/StyledComponents";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);

const ForgotPassword = () => {
  const [stage, setStage] = useState(1);
  const [email, setEmail] = useState("");
  const { t } = useTranslation();
  const navigation = useNavigation();

  const resetPassword = async () => {
    if (email) {
      const postData = {
        email: email.toLowerCase(),
      };

      try {
        const response = await fetch(`${API_URL}users/reset_password/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });

        if (response.status === 204) {
          setStage(2);
        } else {
          Alert.alert(t("attributes.errorOccurred"));
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      Alert.alert(t("attributes.enterEmail"));
    }
  };

  return (
    <ImageBackground source={Background} style={{ flex: 1 }}>
      <StyledView className="w-full bg-[#7658F2] px-4">
        <StyledTouchableOpacity
          className="h-max py-5"
          onPress={() => {
            navigation.goBack();
          }}
        >
          <ArrowLefIcon />
        </StyledTouchableOpacity>
      </StyledView>
      {stage === 1 ? (
        <StyledView className="flex-1 p-4 bg-white">
          <StyledView className="w-full items-center mt-14 mb-[24px]">
            <StyledView className="rounded-full  w-[80px] h-[80px] items-center justify-center mb-6">
              <LockIcon />
            </StyledView>
            <StyledText className="font-poppi-bold text-[#204F50] text-[22px] mt-10">
              {t("attributes.signinForgotPassword")}
            </StyledText>
          </StyledView>
          <StyledText className="text-base text-center text-[#585858] font-poppi-medium">
            {t("attributes.forgotPasswordDescr")}
          </StyledText>
          <StyledTextInput
            onChangeText={(value) => setEmail(value)}
            className="bg-white p-[10px] text-black border-[1px] focus:bg-[#F3F7FF] border-[#EDEFF3] focus:border-[#7658F2] placeholder:text-base my-4 rounded-[18px]"
            placeholder={t("attributes.forgotPasswordEmail")}
            placeholderTextColor="#868782"
          />
          <StyledTouchableOpacity
            className="rounded-[18px] p-[10px] bg-[#76F5A4]"
            onPress={() => {
              resetPassword();
            }}
          >
            <StyledText className="font-poppi-semibold text-base text-[#204F50] text-center">
              {t("attributes.forgotPasswordConfirmButton")}
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      ) : (
        <StyledView className="flex-1 p-4 bg-white">
          <StyledView className="w-full items-center mt-10 mb-[24px]">
            <StyledView className="rounded-full  w-[80px] h-[80px] items-center justify-center mb-6">
              <LockIcon />
            </StyledView>
            <StyledText className="font-poppi-bold text-[#204F50] text-[22px] mt-10">
              {t("attributes.checkEmailTitle")}
            </StyledText>
          </StyledView>
          <StyledText className="text-base text-center text-[#585858] font-poppi-medium">
            {t("attributes.checkEmailDesc")}
          </StyledText>

          <StyledTouchableOpacity
            className="rounded-[18px] p-[10px] bg-[#76F5A4] mt-8"
            onPress={() => {
              openInbox();
            }}
          >
            <StyledText className="font-poppi-semibold text-base text-[#204F50] text-center">
              {t("attributes.openEmail")}
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      )}
    </ImageBackground>
  );
};

export default ForgotPassword;
