import FastImage from 'react-native-fast-image'
import { StyledText, StyledTouchableOpacity, StyledView } from '../common/components/StyledComponents'
import PhoneIcon from "../../assets/icons/child-profile-phone.svg"
import MessageIcon from "../../assets/icons/child-profile-message.svg"
import { Linking, ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'

const ChildProfile = () => {
    const { t } = useTranslation();

    return (
        <StyledView className='p-4 bg-white flex-1 '>
            <ScrollView style={{ flex: 1 }}>
                <StyledView className='my-4 items-center justify-center'>
                    <FastImage
                        style={{ width: 120, height: 120, borderRadius: 100 }}
                        source={require("../../assets/images/test-avatar1.png")}
                    />
                </StyledView>
                <StyledView className='w-full flex-row justify-between items-center p-[10px] px-4 border-[1px] border-[#EDEFF3] rounded-[18px]'>
                    <StyledView>
                        <StyledText className='text-base text-black font-poppi-bold'>Aynur Mammadova</StyledText>
                        <StyledText className='text-base font-poppi text-[#868782]'>+994 55 555 55 55</StyledText>
                    </StyledView>
                    <StyledTouchableOpacity onPress={() => Linking.openURL("tel:7777777777")}>
                        <PhoneIcon />
                    </StyledTouchableOpacity>
                </StyledView>
                <StyledView className='w-full flex-row justify-between my-2 items-center p-[10px] px-4 border-[1px] border-[#EDEFF3] rounded-[18px]'>
                    <StyledView>
                        <StyledText className='text-base text-black font-poppi-bold'>Aytac Mammadova</StyledText>
                        <StyledText className='text-base font-poppi text-[#868782]'>+994 55 555 55 55</StyledText>
                    </StyledView>
                    <StyledView className='flex-row gap-2'>
                        <StyledTouchableOpacity onPress={() => Linking.openURL("tel:7777777777")}>
                            <PhoneIcon />
                        </StyledTouchableOpacity>
                        <StyledTouchableOpacity onPress={() => Linking.openURL("sms:7777777777")}>
                            <MessageIcon />
                        </StyledTouchableOpacity>
                    </StyledView>
                </StyledView>
                <StyledText className='text-base font-poppi-semibold text-[#7658F2]'>{t("attributes.profileEmergencyContact")}</StyledText>
                <StyledView className='w-full flex-row my-2 justify-between items-center p-[10px] px-4 border-[1px] border-[#EDEFF3] rounded-[18px]'>
                    <StyledView>
                        <StyledText className='text-base text-black font-poppi-bold'>Rauf Mammadov</StyledText>
                        <StyledText className='text-base font-poppi text-[#868782]'>+994 55 555 55 55</StyledText>
                    </StyledView>
                    <StyledTouchableOpacity onPress={() => Linking.openURL("tel:7777777777")}>
                        <PhoneIcon />
                    </StyledTouchableOpacity>
                </StyledView>
                <StyledText className='text-[15px] font-poppi-medium text-[#C0C0BF]'>{t("attributes.profileEmail")}</StyledText>
                <StyledText className='border-[1px] text-black text-base font-poppi border-[#EDEFF3] rounded-[18px] px-4 py-2 my-1'>2school@gmail.com</StyledText>
                <StyledText className='text-[15px] font-poppi-medium text-[#C0C0BF]'>{t("attributes.profileBirthDate")}</StyledText>
                <StyledText className='border-[1px] text-black text-base font-poppi border-[#EDEFF3] rounded-[18px] px-4 py-2 my-1'>{format(new Date(), "dd/MM/yyyy")}</StyledText>
                <StyledText className='text-[15px] font-poppi-medium text-[#C0C0BF]'>{t("attributes.homeAddress")}</StyledText>
                <StyledText className='border-[1px] text-black text-base font-poppi border-[#EDEFF3] rounded-[18px] px-4 py-2 my-1'>Uzeyir Hajibeyov 57</StyledText>
                <StyledText className='text-[15px] font-poppi-medium text-[#C0C0BF]'>{t("attributes.profileSchool")}</StyledText>
                <StyledText className='border-[1px] text-black text-base font-poppi border-[#EDEFF3] rounded-[18px] px-4 py-2 my-1'>Gymnasium №27</StyledText>
                <StyledText className='text-[15px] font-poppi-medium text-[#C0C0BF]'>{t("attributes.profileSpecificComment")}</StyledText>
                <StyledText className='border-[1px] text-black text-base min-h-[125px] font-poppi border-[#EDEFF3] rounded-[18px] px-4 py-2 my-1'>lorem ipsum</StyledText>
            </ScrollView >
        </StyledView>
    )
}

export default ChildProfile