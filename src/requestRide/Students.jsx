import StudentInfo from "../common/components/StudentInfo"
import { StyledText, StyledView } from "../common/components/StyledComponents"

const Students = () => {
    return (
        <StyledView className="flex-1 p-4 bg-white">
            <StyledText className="text-xl text-[#204F50] font-poppi-semibold">Students</StyledText>
            <StudentInfo />
            <StudentInfo />
        </StyledView>
    )
}

export default Students