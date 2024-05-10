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

const RequesRide = () => {

    const navigation = useNavigation();

    const [selectedSchool, setSelectedSchool] = useState();
    const [selectedRideOption, setSelectedRideOption] = useState(null);
    const [toolTipVisible, setToolTipVisible] = useState(false);
    const scrollViewRef = useRef(null);
    const [successModalOpen, setSuccessModalOpen] = useState(false)
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [classtimesStart, setClasstimesStart] = useState([
        {
            day: "Monday",
            time: null
        },
        {
            day: "Tuesday",
            time: null
        },
        {
            day: "Wednesday",
            time: null
        },
        {
            day: "Thursday",
            time: null
        },
        {
            day: "Friday",
            time: null
        },
    ]);
    const [classtimesEnd, setClasstimesEnd] = useState([
        {
            day: "Monday",
            time: null
        },
        {
            day: "Tuesday",
            time: null
        },
        {
            day: "Wednesday",
            time: null
        },
        {
            day: "Thursday",
            time: null
        },
        {
            day: "Friday",
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
        { label: "Only from home to school", value: 1 },
        { label: "Only from school to home", value: 2 },
        { label: "Both to and from school", value: 3 },
    ]
    return (
        <>
            <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: "white" }}>

                <StyledView className='flex-1 p-4 gap-4 bg-white'>

                    <StyledText className="text-xl  text-[#204F50] font-poppi-semibold">Request ride for Mikael David</StyledText>
                    <StyledView>
                        <StyledTouchableOpacity onPress={() => navigation.navigate("HomeAddress")} className='px-4 flex-row justify-between items-center py-[10px] border-[1px] border-[#EDEFF3] rounded-[18px]'>
                            <StyledText className='text-[#868782] text-base font-poppi'>Enter your home address</StyledText>
                            <ArrorRightIcon />
                        </StyledTouchableOpacity>
                    </StyledView>
                    <StyledView>
                        <CustomSelect placeholder={"Choose the school"} items={data} type="full" selectedItem={selectedSchool} setSelectedItem={setSelectedSchool} />
                    </StyledView>
                    <StyledView>
                        <CustomSelect placeholder={"Choose service type"} items={rideOptions} type="full" selectedItem={selectedRideOption} setSelectedItem={setSelectedRideOption} />
                    </StyledView>
                    {selectedRideOption?.value === 1 || selectedRideOption?.value === 2 ? (
                        <StyledView className='px-4 py-4 rounded-[18px]  border-[1px] border-[#EDEFF3]'>
                            <StyledText className='text-[#204F50] text-lg font-poppi-semibold'>{selectedRideOption.value === 1 ? "Indicate classes start times:" : "Indicate classes end times:"}</StyledText>
                            <ClassTimes classtimes={selectedRideOption.value === 1 ? classtimesStart : classtimesEnd} setClasstimes={selectedRideOption.value === 1 ? setClasstimesStart : setClasstimesEnd} />
                        </StyledView>
                    )
                        : selectedRideOption?.value === 3 && (
                            <StyledView>
                                <StyledView className='px-4 py-4 rounded-[18px]  border-[1px] border-[#EDEFF3]'>
                                    <StyledText className='text-[#204F50] text-lg font-poppi-semibold'>Indicate classes start times:</StyledText>
                                    <ClassTimes classtimes={classtimesStart} setClasstimes={setClasstimesStart} />
                                </StyledView>
                                <StyledView className='px-4 py-4 rounded-[18px] my-4  border-[1px] border-[#EDEFF3]'>
                                    <StyledText className='text-[#204F50] text-lg font-poppi-semibold'>Indicate classes end times:</StyledText>
                                    <ClassTimes classtimes={classtimesEnd} setClasstimes={setClasstimesEnd} />
                                </StyledView>
                            </StyledView>
                        )
                    }
                    {selectedRideOption !== null &&
                        <StyledView>
                            <StyledText className='text-lg text-[#204F50] font-poppi-semibold'>Additional comments</StyledText>
                            <StyledView className='border-[1px] relative  items-start flex-row border-[#EDEFF3] rounded-[18px] p-4 min-h-[130px]'>
                                <StyledTextInput multiline={true} placeholder='Write your comment' placeholderTextColor={"#7A7A7A"} className={`w-[90%] text-base font-poppi text-black `} />
                                <StyledView className='absolute top-4 right-4'>
                                    <Tooltip
                                        onClose={() => setToolTipVisible(false)}
                                        isVisible={toolTipVisible}
                                        placement='center'
                                        backgroundColor={"rgba(0,0,0,0.5)"}
                                        content={
                                            <StyledView className=''>
                                                <StyledText className='text-[#7A7A7A]'>
                                                    Please indicate any specific information like allergies or other health concerns (if any) that we have to know about your child.
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
                                <StyledText className='text-base text-[#204F50] font-poppi-semibold'>Confirm</StyledText>
                            </StyledTouchableOpacity>
                        </StyledView>
                    }
                </StyledView>
            </KeyboardAwareScrollView>
            {confirmModalOpen && <ConfirmModal setModalOpen={setConfirmModalOpen} setSuccessModalOpen={setSuccessModalOpen} />}
            {successModalOpen && <RequestSentModal setModalOpen={setSuccessModalOpen} description="We will review your request and reach out to you as soon as possible" />}
        </>
    )
}

export default RequesRide