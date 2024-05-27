import { useTranslation } from "react-i18next";
import DocsIcon from "../../../assets/icons/docs-modal.svg"
import { StyledText, StyledTouchableOpacity, StyledView } from "../../common/components/StyledComponents";

const ConfirmModal = ({ setModalOpen, setSuccessModalOpen }) => {
    const {t} = useTranslation();
    return (
        <StyledView className="flex-1 items-center justify-center bg-black/20 absolute h-screen w-screen z-50">
            <StyledView
                className={`bg-white p-4 pt-12 rounded-sm shadow justify-center items-center shadow-zinc-400 border-t-2 border-[#7658F2] mx-5`}>
                <StyledView className="bg-[#7658F2] w-[42px] h-[42px] items-center justify-center absolute -top-5   rounded-full">
                    <DocsIcon />
                </StyledView>
                <StyledText className="text-center text-base font-poppi-semibold text-[#414141] my-4">
                    {t("attributes.submitRequestTitle")}
                </StyledText>
                <StyledText className="text-center text-sm font-serrat text-[#414141]">
                {t("attributes.submitRequestDesc")}
                </StyledText>
                <StyledView className="flex-row w-full items-center mt-10">
                    <StyledTouchableOpacity
                        onPress={() => {
                            setModalOpen(false);
                        }}
                        className="py-2 w-[64px] rounded-md">
                        <StyledText className="text-center text-lg font-serrat-medium text-[#757575]">
                        {t("attributes.submitNo")}
                        </StyledText>
                    </StyledTouchableOpacity>
                    <StyledTouchableOpacity
                        onPress={() => {
                            setModalOpen(false);
                            setSuccessModalOpen(true);
                        }}
                        className="py-2 bg-[#7658F2] ml-12 w-[64px] rounded-md">
                        <StyledText className="text-center text-lg text-white font-serrat-medium">
                        {t("attributes.submitYes")}
                        </StyledText>
                    </StyledTouchableOpacity>
                </StyledView>
            </StyledView>
        </StyledView>
    )
}

export default ConfirmModal