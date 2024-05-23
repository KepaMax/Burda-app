import { format } from "date-fns"
import { StyledText, StyledView } from "../../common/components/StyledComponents"
import { useTranslation } from "react-i18next"

const HistoryInfo = ({ isActive }) => {
    const { t } = useTranslation();
    return (
        <StyledView className=" border-[1px] rounded-[18px] border-[#EDEFF3] bg-white p-5">
            <StyledView className="flex-row justify-between items-center">
                <StyledText className="font-poppi-semibold text-lg text-[#204F50]">Mikael David</StyledText>
                <StyledText className={`font-poppi-italic text-base text-[#204F50] ${isActive ? "text-[#76F5A4]" : 'text-[#FF3115]'}`}>{isActive ? t("attributes.subscriptionActive") : t("attributes.subscriptionCanceled")}</StyledText>
            </StyledView>
            <StyledView className="flex-row my-5 justify-between items-center">
                <StyledView className="gap-1 w-1/2">
                    <StyledText className="font-poppi-medium text-sm text-[#000000]">{t("attributes.paymentType")}</StyledText>
                    <StyledText className="font-poppi-italic text-base text-[#7658F2]">{t("attributes.paymentMethodMonthly")}</StyledText>
                </StyledView>
                <StyledView className="gap-1 w-1/2">
                    <StyledText className="font-poppi-medium text-sm text-[#000000]">{t("attributes.paymentSuccessAmount")}</StyledText>
                    <StyledText className="font-poppi-italic text-base text-[#7658F2]">120 AZN</StyledText>
                </StyledView>
            </StyledView>
            <StyledView className="flex-row my-5 justify-between items-center">
                <StyledView className="gap-1 w-1/2">
                    <StyledText className="font-poppi-medium text-sm text-[#000000]">{t("attributes.startDate")} </StyledText>
                    <StyledText className="font-poppi-italic text-base text-[#7658F2]">{format(new Date(), "dd MMM, yyyy")}</StyledText>
                </StyledView>
                <StyledView className="gap-1 w-1/2">
                    <StyledText className="font-poppi-medium text-sm text-[#000000]">{t("attributes.endDate")} </StyledText>
                    <StyledText className="font-poppi-italic text-base text-[#7658F2]">{format(new Date(), "dd MMM, yyyy")}</StyledText>
                </StyledView>
            </StyledView>
        </StyledView>
    )
}

export default HistoryInfo