import {useNavigation} from '@react-navigation/native';
import ArrowLeftIcon from '@icons/arrow-left-header.svg';
import {
  StyledView,
  StyledText,
  StyledTouchableOpacity,
} from '@common/StyledComponents';

const CustomHeader = ({title, noBackBtn}) => {
  const navigation = useNavigation();

  return (
    <StyledView className={`w-full bg-[#7658F2] items-center`}>
      <StyledView className="w-11/12 items-center justify-center flex-row relative">
        {noBackBtn ? null : (
          <StyledTouchableOpacity
            hitSlop={{top: 50, right: 50, bottom: 50, left: 50}}
            onPress={() => navigation.goBack()}
            className="absolute left-0">
            <ArrowLeftIcon />
          </StyledTouchableOpacity>
        )}
        <StyledText className="text-white font-poppi-medium text-[20px] pb-5 pt-6">
          {title}
        </StyledText>
      </StyledView>
    </StyledView>
  );
};

export default CustomHeader;
