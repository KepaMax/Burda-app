import { useState } from "react";
import {
  StyledText,
  StyledTouchableOpacity,
  StyledView,
} from "../common/components/StyledComponents";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import WarningModal from "../common/components/WarningModal";

const CancelSubscription = () => {
  const { t } = useTranslation();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  return (
    <StyledView className="flex-1 bg-white p-4">
      <StyledText className="text-center text-lg text-[#204F50] font-poppi-medium">
        Mikael David
      </StyledText>
      <StyledView className="flex-row justify-between items-center p-4 border-[1px] border-[#EDEFF3] rounded-[18px] mt-4">
        <StyledText className="font-poppi-medium text-sm text-[#000000]">
          {t("attributes.startDate")}{" "}
        </StyledText>
        <StyledText className="font-poppi-italic text-base text-[#7658F2]">
          {format(new Date(), "dd MMM, yyyy")}
        </StyledText>
      </StyledView>
      <StyledView className="flex-row justify-between items-center p-4 border-[1px] border-[#EDEFF3] rounded-[18px] mt-4">
        <StyledText className="font-poppi-medium text-sm text-[#000000]">
          {t("attributes.renewalDate")}{" "}
        </StyledText>
        <StyledText className="font-poppi-italic text-base text-[#7658F2]">
          {format(new Date(), "dd MMM, yyyy")}
        </StyledText>
      </StyledView>
      <StyledView className="flex-row justify-between items-center p-4 border-[1px] border-[#EDEFF3] rounded-[18px] mt-4">
        <StyledText className="font-poppi-medium text-sm text-[#000000]">
          {t("attributes.paymentMethod")}{" "}
        </StyledText>
        <StyledText className="font-poppi-italic text-base text-[#7658F2]">
          **4466
        </StyledText>
      </StyledView>
      <StyledView className="flex-row justify-between items-center p-4 border-[1px] border-[#EDEFF3] rounded-[18px] mt-4">
        <StyledText className="font-poppi-medium text-sm text-[#000000]">
          {t("attributes.paymentSuccessAmount")}{" "}
        </StyledText>
        <StyledText className="font-poppi-italic text-base text-[#7658F2]">
          120 AZN
        </StyledText>
      </StyledView>
      <StyledTouchableOpacity
        onPress={() => setCancelModalOpen(true)}
        className="border-[1px] rounded-[5px] justify-center items-center p-4 mt-4 border-[#FF3115]"
      >
        <StyledText className="text-base text-[#FF3115] font-poppi-medium">
          {t("attributes.cancelSubscription")}
        </StyledText>
      </StyledTouchableOpacity>
      {cancelModalOpen && (
        <WarningModal
          title={t("attributes.cancelRideTitle")}
          description={t("attributes.cancelSubscriptionDesc")}
          setModalOpen={setCancelModalOpen}
        />
      )}
    </StyledView>
  );
};

export default CancelSubscription;
