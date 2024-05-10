import { Text, TouchableOpacity, View } from "react-native";
import { useState, useContext, useEffect } from "react";
import AuthContext from "../../common/TokenManager";
import "../../locales/index";
import { useTranslation } from "react-i18next";
import AzFlagIcon from "../../../assets/icons/az-flag-language.svg"
import RusFlagIcon from "../../../assets/icons/rus-flag-language.svg"
import EnFlagIcon from "../../../assets/icons/en-flag-language.svg"
import ActiveIcon from "../../../assets/icons/active-language.svg"
import { useNavigation } from "@react-navigation/native";
import On from "../../assets/icons/on.svg";
import {
  StyledView,
  StyledText,
  StyledTouchableOpacity,
} from "../../common/components/StyledComponents";

const Languages = () => {
  const { setLanguage, getLanguage } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState();
  const navigation = useNavigation();

  useEffect(() => {
    const currentLanguage = async () => {
      const activeLanguage = await getLanguage();
      setLang(activeLanguage);
    };
    currentLanguage();
  }, []);

  return (
    <StyledView className="w-auto p-4 bg-white flex-1">
      <StyledText className="font-poppi-bold text-xl mb-2 text-[#204F50]">{t("attributes.chooseLanguage")}</StyledText>

      <StyledView className="gap-4">
        <StyledTouchableOpacity onPress={() => {
          i18n.changeLanguage("az");
          setLanguage("az");
          navigation.goBack();
        }}>
          <StyledView className="items-center flex-row justify-between border-[1px] rounded-[18px] border-[#EDEFF3] w-full p-4 pr-6">
            <StyledView className="flex-row items-center">
              <AzFlagIcon />
              <StyledText
                className={`text-[#204F50] text-base font-poppi-medium ml-2`}>
                Azərbaycan dili
              </StyledText>
            </StyledView>
            {lang === 'az' && <ActiveIcon />}
          </StyledView>
        </StyledTouchableOpacity>

        <StyledTouchableOpacity onPress={() => {
          i18n.changeLanguage("rus");
          setLanguage("rus");
          navigation.goBack();
        }}>
          <StyledView className="items-center flex-row justify-between border-[1px] rounded-[18px] border-[#EDEFF3] w-full p-4 pr-6">
            <StyledView className="flex-row items-center">
              <RusFlagIcon />
              <StyledText
                className={`text-[#204F50] text-base font-poppi-medium ml-2`}>
                Русский
              </StyledText>
            </StyledView>
            {lang === 'rus' && <ActiveIcon />}
          </StyledView>
        </StyledTouchableOpacity>

        <StyledTouchableOpacity onPress={() => {
          i18n.changeLanguage("en");
          setLanguage("en");
          navigation.goBack();
        }}>
          <StyledView className="items-center flex-row justify-between border-[1px] rounded-[18px] border-[#EDEFF3] w-full p-4 pr-6">
            <StyledView className="flex-row items-center">
              <EnFlagIcon />
              <StyledText
                className={`text-[#204F50] text-base font-poppi-medium ml-2`}>
                English
              </StyledText>
            </StyledView>
            {lang === 'en' && <ActiveIcon />}
          </StyledView>
        </StyledTouchableOpacity>
      </StyledView>
    </StyledView>
  );
};

export default Languages;
