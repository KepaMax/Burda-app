import { View, Text, ScrollView } from 'react-native'
import React, { useRef, useState } from 'react'
import { StyledText, StyledTextInput, StyledTouchableOpacity, StyledView } from '../common/components/StyledComponents'
import ArrorRightIcon from "../../assets/icons/arrow-right-profile.svg"
import CustomSelect from '../common/components/CustomSelect'
import ClassTimes from './components/ClassTimes'
import Tooltip from 'react-native-walkthrough-tooltip'
import InfoProfileIcon from "../../assets/icons/info-profile.svg"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ConfirmModal from './components/ConfirmModal'
import RequestSentModal from '../common/components/RequestSentModal'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

const RequesRide = () => {

    const navigation = useNavigation();

    const [selectedSchool, setSelectedSchool] = useState();
    const [selectedRideOption, setSelectedRideOption] = useState(null);
    const [toolTipVisible, setToolTipVisible] = useState(false);
    const scrollViewRef = useRef(null);
    const { t } = useTranslation();
    const [successModalOpen, setSuccessModalOpen] = useState(false)
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [classtimesStart, setClasstimesStart] = useState([
        {
            day: t("attributes.monday"),
            time: null
        },
        {
            day: t("attributes.tuesday"),
            time: null
        },
        {
            day: t("attributes.wednesday"),
            time: null
        },
        {
            day: t("attributes.thursday"),
            time: null
        },
        {
            day: t("attributes.friday"),
            time: null
        },
    ]);
    const [classtimesEnd, setClasstimesEnd] = useState([
        {
            day: t("attributes.monday"),
            time: null
        },
        {
            day: t("attributes.tuesday"),
            time: null
        },
        {
            day: t("attributes.wednesday"),
            time: null
        },
        {
            day: t("attributes.thursday"),
            time: null
        },
        {
            day: t("attributes.friday"),
            time: null
        },
    ]);

    const data = [
        { label: "Unique Test 1", value: 1 },  // Ensure unique value
        { label: "Unique Test 2", value: 2 },  // Ensure unique value
        { label: "Unique Test 3", value: 3 },  // Ensure unique value
        { label: "Unique Test 4", value: 4 },               // Add a unique value
        { label: "Unique Test 5", value: 5 },               // Add another unique value
    ];
    const rideOptions = [
        { label: t("attributes.serviceFromHomeToSchool"), value: 1 },
        { label: t("attributes.serviceFromSchoolToHome"), value: 2 },
        { label: t("attributes.serviceBothWay"), value: 3 },
    ]
    return (
        <>
            <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: "white" }}>

                <StyledView className='flex-1 p-4 gap-4 bg-white'>

                    <StyledText className="text-xl  text-[#204F50] font-poppi-semibold">{t("attributes.requestRideClient").replace("{name}", "Mikael").replace("{surname}", "David")}</StyledText>
                    <StyledView>
                        <StyledTouchableOpacity onPress={() => navigation.navigate("HomeAddress")} className='px-4 flex-row justify-between items-center py-[10px] border-[1px] border-[#EDEFF3] rounded-[18px]'>
                            <StyledText className='text-[#868782] text-base font-poppi'>{t("attributes.homeAddressEnter")}</StyledText>
                            <ArrorRightIcon />
                        </StyledTouchableOpacity>
                    </StyledView>
                    <StyledView>
                        <CustomSelect placeholder={t("attributes.profileChooseSchool")} items={data} type="full" selectedItem={selectedSchool} setSelectedItem={setSelectedSchool} />
                    </StyledView>
                    <StyledView>
                        <CustomSelect placeholder={t("attributes.chooseServiceType")} items={rideOptions} type="full" selectedItem={selectedRideOption} setSelectedItem={setSelectedRideOption} />
                    </StyledView>
                    {selectedRideOption?.value === 1 || selectedRideOption?.value === 2 ? (
                        <StyledView className='px-4 py-4 rounded-[18px]  border-[1px] border-[#EDEFF3]'>
                            <StyledText className='text-[#204F50] text-lg font-poppi-semibold'>{selectedRideOption.value === 1 ? t("attributes.indicateClassStartTime") : t("attributes.indicateClassEndTime")}</StyledText>
                            <ClassTimes classtimes={selectedRideOption.value === 1 ? classtimesStart : classtimesEnd} setClasstimes={selectedRideOption.value === 1 ? setClasstimesStart : setClasstimesEnd} />
                        </StyledView>
                    )
                        : selectedRideOption?.value === 3 && (
                            <StyledView>
                                <StyledView className='px-4 py-4 rounded-[18px]  border-[1px] border-[#EDEFF3]'>
                                    <StyledText className='text-[#204F50] text-lg font-poppi-semibold'>{t("attributes.indicateClassStartTime")}</StyledText>
                                    <ClassTimes classtimes={classtimesStart} setClasstimes={setClasstimesStart} />
                                </StyledView>
                                <StyledView className='px-4 py-4 rounded-[18px] my-4  border-[1px] border-[#EDEFF3]'>
                                    <StyledText className='text-[#204F50] text-lg font-poppi-semibold'>{t("attributes.indicateClassEndTime")}</StyledText>
                                    <ClassTimes classtimes={classtimesEnd} setClasstimes={setClasstimesEnd} />
                                </StyledView>
                            </StyledView>
                        )
                    }
                    {selectedRideOption !== null &&
                        <StyledView>
                            <StyledText className='text-lg text-[#204F50] font-poppi-semibold'>{t("attributes.additionalComments")}</StyledText>
                            <StyledView className='border-[1px] relative  items-start flex-row border-[#EDEFF3] rounded-[18px] p-4 min-h-[130px]'>
                                <StyledTextInput multiline={true} placeholder={t("attributes.writeYourComment")} placeholderTextColor={"#7A7A7A"} className={`w-[90%] text-base font-poppi text-black `} />
                                <StyledView className='absolute top-4 right-4'>
                                    <Tooltip
                                        onClose={() => setToolTipVisible(false)}
                                        isVisible={toolTipVisible}
                                        placement='center'
                                        backgroundColor={"rgba(0,0,0,0.5)"}
                                        content={
                                            <StyledView className=''>
                                                <StyledText className='text-[#7A7A7A]'>
                                                    {t("childInfoTooltip")}
                                                </StyledText>
                                            </StyledView>
                                        }
                                    >
                                        <StyledTouchableOpacity onPress={() => setToolTipVisible(true)}>
                                            <InfoProfileIcon />
                                        </StyledTouchableOpacity>
                                    </Tooltip>
                                </StyledView>
                            </StyledView>
                            <StyledTouchableOpacity onPress={() => setConfirmModalOpen(true)} className='bg-[#76F5A4] rounded-[18px] mt-4 p-[10px] justify-center items-center'>
                                <StyledText className='text-base text-[#204F50] font-poppi-semibold'>{t("attributes.mainCheckoutConfirm")}</StyledText>
                            </StyledTouchableOpacity>
                        </StyledView>
                    }
                </StyledView>
            </KeyboardAwareScrollView>
            {confirmModalOpen && <ConfirmModal setModalOpen={setConfirmModalOpen} setSuccessModalOpen={setSuccessModalOpen} />}
            {successModalOpen && <RequestSentModal setModalOpen={setSuccessModalOpen} description={t("attributes.rideRequestSentDesc")} />}
        </>
    )
}

export default RequesRide