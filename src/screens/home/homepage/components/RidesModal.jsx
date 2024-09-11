import {
  StyledText,
  StyledTouchableOpacity,
  StyledView,
} from '@common/StyledComponents';
import CloseIcon from '@icons/close-modal.svg';
import DotsIcon from '@icons/dots-ride.svg';
import CompletedIcon from '@icons/complete-pin-ride.svg';
import IncompletedIcon from '@icons/incomplete-pin-ride.svg';
import ArrowDown from '@icons/arrow-down-ride.svg';
import {FlatList} from 'react-native-gesture-handler';

const RidesModal = ({items, setModalOpen}) => {
  const renderItem = ({item}) => {
    return (
      <StyledView className="w-full p-4">
        <StyledView className="flex-row items-center gap-2">
          <StyledView className="w-[2%] justify-center items-center">
            {item.completed ? <CompletedIcon /> : <IncompletedIcon />}
          </StyledView>
          <StyledText className="text-[#000000B2] text-xs font-poppi">
            {item.child.name} {item.child.surname}
          </StyledText>
        </StyledView>
        <StyledView className="flex-row items-center gap-2">
          <StyledView className="w-[2%] items-center">
            <DotsIcon />
          </StyledView>
          <StyledText className="text-black text-base font-poppi-semibold border-b-[1px] w-[90%] border-[#D0D0D0] pb-1">
            {item.location.home_address}
          </StyledText>
        </StyledView>
      </StyledView>
    );
  };

  return (
    <StyledView className="items-center justify-center bg-black/20 px-4 absolute h-full w-full z-50">
      <StyledView className=" w-full h-max max-h-[560px] bg-white rounded-[18px] relative border-[1px] border-[#EDEFF3] p-4">
        <StyledTouchableOpacity
          onPress={() => setModalOpen(false)}
          hitSlop={{right: 40, left: 40, top: 40, bottom: 40}}
          className="absolute right-6 z-50 top-6">
          <CloseIcon />
        </StyledTouchableOpacity>
        <FlatList
          contentContainerStyle={{gap: 0}}
          data={items}
          renderItem={renderItem}
        />
      </StyledView>
    </StyledView>
  );
};

export default RidesModal;
