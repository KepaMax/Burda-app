import { useEffect, useState } from 'react'
import { StyledText, StyledTouchableOpacity, StyledView } from '../../common/components/StyledComponents'
import DatePicker from 'react-native-date-picker';

const ClassTimes = ({ classtimes, setClasstimes }) => {
    const [timePickerOpen, setTimePickerOpen] = useState(false);
    const [time, setTime] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null);

    const handleTimeSet = (index) => {
        setActiveIndex(index);
        setTimePickerOpen(true);
    }

    useEffect(() => {
        const temp = classtimes;
        if (activeIndex !== null && time !== null) {
            temp[activeIndex].time = `${time.getHours().toString().padStart(2,'0')}:${time.getMinutes().toString().padStart(2,'0')}`;
            setClasstimes(temp);
        }
        console.log(temp[activeIndex])
        setActiveIndex(null);
    }, [time])

    return (
        <StyledView className='w-full items-center'>
            {classtimes.map((item, index) => (
                <StyledView key={index} className='flex-row items-center justify-between w-4/6'>
                    <StyledText className='text-base  text-[#868782] font-poppi'>{item.day}:</StyledText>
                    <StyledTouchableOpacity onPress={() => { handleTimeSet(index) }} className={`border-[1px] my-2 w-[100px] items-center ${item.time !== null ? "bg-[#E7E1FC]" : ''}  border-[#7658F2] rounded-[8px] py-1`}>
                        <StyledText className='text-sm text-[#7658F2] font-poppi'>{item.time !== null ? item.time : "00:00"}</StyledText>
                    </StyledTouchableOpacity>
                </StyledView>
            ))}
            <DatePicker
                modal
                open={timePickerOpen}
                mode='time'
                locale='az-AZ'
                theme='light'

                date={new Date()}
                onConfirm={(date) => {
                    setTimePickerOpen(false)
                    setTime(date)
                    console.log(time)
                }}
                onCancel={() => {
                    setTimePickerOpen(false)
                }}
            />
        </StyledView>

    )
}

export default ClassTimes