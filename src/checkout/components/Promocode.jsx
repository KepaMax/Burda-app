import { useState } from "react";
import {
  StyledText,
  StyledView,
  StyledTextInput,
  StyledTouchableOpacity,
} from "../../common/components/StyledComponents";
import "../../locales/index";
import { useTranslation } from "react-i18next";
import PromoIcon from "../../assets/icons/promocode.svg";
import { API_URL } from "@env";
import { Alert } from "react-native";

const Promocode = ({ setActivePromocode }) => {
  const { t } = useTranslation();
  const [promocode, setPromocode] = useState("");
  const [valid, setValid] = useState(false);

  const getPromocodeInfo = async () => {
    const headers = {
      Accept: "*/*; version=v2",
    };

    const response = await fetch(`${API_URL}coupons/${promocode}/`, {
      headers,
    });
    const results = await response.json();

    if (response.ok) {
      setActivePromocode(results);
      setValid(true);
    } else {
      Alert.alert(t("attributes.error"), t("attributes.couponInvalid"));
    }
  };

  return (
    <StyledView className="mx-5 bg-white shadow shadow-zinc-300 px-4 py-[10px] rounded-[8px] mb-5">
      <StyledText className="text-lg text-black font-serrat-semiBold">
        {t("attributes.mainCheckoutPromo")}
      </StyledText>
      <StyledView className=" h-[44px] flex-row items-center justify-between border border-zinc-300 rounded-[8px] mt-3 shadow-sm shadow-zinc-300">
        <StyledTextInput
          editable={!valid}
          value={promocode}
          onChangeText={(value) => setPromocode(value)}
          placeholder={t("attributes.promoPlaceholder")}
          placeholderTextColor="#B7B7B7"
          className="rounded-l-[8px] bg-white h-[44px] w-[85%] pl-4"
        />
        <StyledTouchableOpacity
          disabled={valid}
          onPress={() =>
            promocode
              ? getPromocodeInfo()
              : Alert.alert(t("attributes.enterPromocode"))
          }
          className={`${
            valid ? "bg-green-500" : "bg-[#0079E9]"
          }  h-[44px] w-[15%] items-center justify-center rounded-r-[8px]`}
        >
          <PromoIcon />
        </StyledTouchableOpacity>
      </StyledView>
    </StyledView>
  );
};

export default Promocode;
