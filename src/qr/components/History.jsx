import {Text, TouchableOpacity, View} from 'react-native';
import {styled} from 'nativewind';
import {Link} from '@react-navigation/native';
import ChevronLeftIcon from '../../assets/icons/chevronLeft.svg';

const StyledView = styled(View);
const StyledText = styled(Text);

const History = () => {
  return (
    <StyledView className="mx-5 my-12 bg-white shadow-md rounded-md shadow-zinc-400">
      <TouchableOpacity>
      <StyledView className="flex-row pl-5 pr-6 py-4  justify-between items-center">
        <StyledText className="text-black font-serrat-medium text-sm">
          Activity History
        </StyledText>
        <ChevronLeftIcon />
      </StyledView>
      </TouchableOpacity>
    </StyledView>
  );
};

export default History;
