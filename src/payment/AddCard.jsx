import { useState } from 'react'
import { StyledText, StyledTextInput, StyledTouchableOpacity, StyledView } from '../common/components/StyledComponents'
import SubmitOperationModal from './components/SubmitOperationModal'
import { useTranslation } from 'react-i18next';

const AddCard = () => {
    const [submitOpen, setSubmitOpen] = useState(false);
    const { t } = useTranslation();

    return (
        <StyledView className='flex-1 bg-white p-4 justify-between'>
            <StyledView>
                <StyledText className='text-[#204F50] text-xl font-poppi-bold'>{t("attributes.paymentDetails")}</StyledText>
                <StyledText className='text-base text-[#868782] font-poppi mt-2'>
                    Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.
                </StyledText>

                <StyledView >
                    <StyledView className='gap-1 my-2'>
                        <StyledText className='text-sm text-[#7658F2] font-poppi-medium'>{t("attributes.paymentCardnumber")}</StyledText>
                        <StyledTextInput maxLength={16} keyboardType='numeric' className='border-[1px] text-base text-[#414141] p-[10px] border-[#EDEFF3] rounded-[8px] ' />
                    </StyledView>
                    <StyledView className='flex-row justify-between'>
                        <StyledView className='w-1/2 pr-1'>
                            <StyledText className='text-sm text-[#7658F2] font-poppi-medium'>{t("attributes.paymentExpirationdate")}</StyledText>
                            <StyledTextInput numberOfLines={1} maxLength={5} keyboardType='phone-pad' className='border-[1px] w-[90%]  text-base text-[#414141] p-[10px] border-[#EDEFF3] rounded-[8px] ' />
                        </StyledView>
                        <StyledView className='w-1/2 pl-1'>
                            <StyledText className='text-sm text-[#7658F2] font-poppi-medium'>{t("attributes.paymentCvv")}</StyledText>
                            <StyledTextInput numberOfLines={1} maxLength={4} keyboardType='numeric' className='border-[1px] text-base text-[#414141] p-[10px] border-[#EDEFF3] rounded-[8px] ' />
                        </StyledView>
                    </StyledView>
                </StyledView>
            </StyledView>
            <StyledTouchableOpacity onPress={() => setSubmitOpen(true)} className='rounded-[18px] bg-[#76F5A4] p-[10px] items-center'>
                <StyledText className='text-base text-[#204F50] font-poppi-semibold'>{t("attributes.paymentAddnewButton")}</StyledText>
            </StyledTouchableOpacity>
            {submitOpen && <SubmitOperationModal setModalOpen={setSubmitOpen} text={t("attributes.saveCardDesc")} />}
        </StyledView>
    )
}

export default AddCard