import { StyledText, StyledTouchableOpacity, StyledView } from './StyledComponents';
import AcceptedIcon from "../../../assets/icons/accepted-modal.svg"
import CancelIcon from "../../../assets/icons/cancel-modal.svg"
import { useTranslation } from 'react-i18next';

const RequestSentModal = ({ setModalOpen, description }) => {
    const {t} = useTranslation();
    return (
        <StyledView className="items-center justify-center bg-black/20 absolute top-0 h-full w-full z-50">

            <StyledView
                className={`bg-white px-4 py-10 rounded-[5px] shadow justify-center items-center mx-5`}>
                <StyledTouchableOpacity onPress={() => setModalOpen(false)} className='absolute right-3 top-3'>
                    <CancelIcon />
                </StyledTouchableOpacity>
                <AcceptedIcon />
                <StyledText className="text-center text-base font-poppi-semibold text-[#414141] my-4">
                    {t("attributes.requestSent")}
                </StyledText>
                <StyledText className="text-center text-sm font-serrat text-[#414141]">
                    {description}
                </StyledText>

            </StyledView>
        </StyledView>
    )
}

export default RequestSentModal