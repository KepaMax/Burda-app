
import { useTranslation } from 'react-i18next'
import { StyledText, StyledView } from '../common/components/StyledComponents'

const Tracking = () => {
    const {t} = useTranslation();
    return (
        <StyledView className='flex-1 bg-white justify-center items-center p-4'>
            <StyledText className='text-[#7658F2] text-4xl font-semibold'>{t("attributes.comingSoon")}!</StyledText>
        </StyledView>
    )
}

export default Tracking