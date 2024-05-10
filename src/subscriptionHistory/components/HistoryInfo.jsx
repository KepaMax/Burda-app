import { format } from "date-fns"
import { StyledText, StyledView } from "../../common/components/StyledComponents"

const HistoryInfo = ({ isActive }) => {
    return (
        <StyledView className=" border-[1px] rounded-[18px] border-[#EDEFF3] bg-white p-5">
            <StyledView className="flex-row justify-between items-center">
                <StyledText className="font-poppi-semibold text-lg text-[#204F50]">Mikael David</StyledText>
                <StyledText className={`font-poppi-italic text-base text-[#204F50] ${isActive ? "text-[#76F5A4]" : 'text-[#FF3115]'}`}>{isActive ? "Active" : "Canceled"}</StyledText>
            </StyledView>
            <StyledView className="flex-row my-5 justify-between items-center">
                <StyledView className="gap-1 w-1/2">
                    <StyledText className="font-poppi-medium text-sm text-[#000000]">Type</StyledText>
                    <StyledText className="font-poppi-italic text-base text-[#7658F2]">Monthly</StyledText>
                </StyledView>
                <StyledView className="gap-1 w-1/2">
                    <StyledText className="font-poppi-medium text-sm text-[#000000]">Amount</StyledText>
                    <StyledText className="font-poppi-italic text-base text-[#7658F2]">120 AZN</StyledText>
                </StyledView>
            </StyledView>
            <StyledView className="flex-row my-5 justify-between items-center">
                <StyledView className="gap-1 w-1/2">
                    <StyledText className="font-poppi-medium text-sm text-[#000000]">Start date </StyledText>
                    <StyledText className="font-poppi-italic text-base text-[#7658F2]">{format(new Date(),"dd MMM, yyyy")}</StyledText>
                </StyledView>
                <StyledView className="gap-1 w-1/2">
                    <StyledText className="font-poppi-medium text-sm text-[#000000]">End date </StyledText>
                    <StyledText className="font-poppi-italic text-base text-[#7658F2]">{format(new Date(),"dd MMM, yyyy")}</StyledText>
                </StyledView>
            </StyledView>
        </StyledView>
    )
}

export default HistoryInfo