import { useState } from 'react'
import { StyledText, StyledTouchableOpacity, StyledView } from '../common/components/StyledComponents'
import { format, set } from 'date-fns'
import WarningModal from '../common/components/WarningModal'
import { useTranslation } from 'react-i18next'

const SubscriptionInfo = () => {

    const [cancelSubscriptionOpen, setCancelSubscriptionOpen] = useState(false)
    const { t } = useTranslation();

    return (
        <StyledView className='flex-1 p-4 items-center bg-white gap-2'>
            <StyledText className='font-poppi-medium text-[#204F50] text-lg'>Mikael David</StyledText>
            <StyledView className='p-4 border-[1px] flex-row justify-between rounded-[18px] w-full border-[#EDEFF3]'>
                <StyledText className='font-poppi-medium text-base text-black'>{t("attributes.startDate")}</StyledText>
                <StyledText className='font-poppi-italic text-base text-[#7658F2]'>{format(new Date(), "dd MMM, yyyy")}</StyledText>
            </StyledView>
            <StyledView className='p-4 border-[1px] flex-row justify-between rounded-[18px] w-full border-[#EDEFF3]'>
                <StyledText className='font-poppi-medium text-base text-black'>Renewnal date</StyledText>
                <StyledText className='font-poppi-italic text-base text-[#7658F2]'>{format(new Date(), "dd MMM, yyyy")}</StyledText>
            </StyledView>
            <StyledView className='p-4 border-[1px] flex-row justify-between rounded-[18px] w-full border-[#EDEFF3]'>
                <StyledText className='font-poppi-medium text-base text-black'>Payment method</StyledText>
                <StyledText className='font-poppi-italic text-base text-[#7658F2]'>**4466</StyledText>
            </StyledView>
            <StyledView className='p-4 border-[1px] flex-row justify-between rounded-[18px] w-full border-[#EDEFF3]'>
                <StyledText className='font-poppi-medium text-base text-black'>Amount</StyledText>
                <StyledText className='font-poppi-italic text-base text-[#7658F2]'>120 AZN</StyledText>
            </StyledView>
            <StyledView className='w-full'>
                <StyledTouchableOpacity onPress={() => setCancelSubscriptionOpen(true)} className='w-full items-center py-3 mt-2 border-[1px] rounded-[5px] border-[#FF3115]'>
                    <StyledText className='font-poppi-medium text-base text-[#FF3115]'>
                        Cancel Subscription
                    </StyledText>
                </StyledTouchableOpacity>
            </StyledView>
            {cancelSubscriptionOpen && <WarningModal setModalOpen={setCancelSubscriptionOpen} title="Are you sure?" description="By cancelling your subscription, this month's travel rights will be cancelled" />}
        </StyledView>
    )
}

export default SubscriptionInfo