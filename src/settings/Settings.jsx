import { useContext, useState, useEffect } from "react";
import AuthContext from "../common/TokenManager";
import {
  StyledView,
  StyledText,
  StyledTouchableOpacity,
} from "../common/components/StyledComponents";
import { useNavigation } from "@react-navigation/native";
import "../locales/index";
import { useTranslation } from "react-i18next";
import ChevronRight from "../assets/icons/chevron-right.svg";
import LanguageIcon from "../../assets/icons/language-settings.svg"
import ArrowRightProfileIcon from "../../assets/icons/arrow-right-profile.svg"
import PasswordIcon from "../../assets/icons/change-password-settings.svg"
import { Platform } from "react-native";

const Settings = () => {
  const { getGuestMode } = useContext(AuthContext);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [resetPasswordAccessible, setResetPasswordAccessible] = useState(false);

  const guestMode = async () => {
    const mode = await getGuestMode();
    setResetPasswordAccessible(!mode);
  };

  useEffect(() => {
    guestMode();
  }, []);

  return (
    <StyledView className="p-4 bg-white flex-1 gap-4">
      <StyledTouchableOpacity
        onPress={() => {
          navigation.navigate("Languages");
        }}
      >
        <StyledView className="items-center flex-row justify-between border-[1px] rounded-[18px] border-[#EDEFF3] w-full p-4">
          <StyledView className="flex-row items-center">
            <LanguageIcon />
            <StyledText
              className={`text-[#000000] text-base font-poppi-medium ml-2`}>
              {t("attributes.changeLanguage")}
            </StyledText>
          </StyledView>
          <ArrowRightProfileIcon />
        </StyledView>
      </StyledTouchableOpacity>



      <StyledTouchableOpacity
        onPress={() => {
          navigation.navigate("ResetPassword");
        }}>
        <StyledView className="items-center flex-row justify-between border-[1px] rounded-[18px] border-[#EDEFF3] w-full p-4">
          <StyledView className="flex-row items-center">
            <PasswordIcon />
            <StyledText
              className={`text-[#000000] text-base font-poppi-medium ml-2`}>
              {t("attributes.resetPasswordTitle")}
            </StyledText>
          </StyledView>

          <ArrowRightProfileIcon />
        </StyledView>
      </StyledTouchableOpacity>
      <StyledText className="absolute bottom-4 w-full text-lg text-[#292B2D] text-center font-serrat-medium">
        {t("attributes.appVersion")} 2.3
      </StyledText>
    </StyledView>
  );
};

export default Settings;
