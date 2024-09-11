import {
  StyledText,
  StyledTouchableOpacity,
  StyledView,
} from '@common/StyledComponents';
import DotsIcon from '@icons/dots-ride.svg';
import CompletedIcon from '@icons/complete-pin-ride.svg';
import ArrowDown from '@icons/arrow-down-ride.svg';
import IncompletedIcon from '@icons/incomplete-pin-ride.svg';
import {FlatList} from 'react-native-gesture-handler';
import {useTranslation} from 'react-i18next';

const Rides = ({items, setModalOpen}) => {
  const {t} = useTranslation();

  const renderItem = ({item}) => {
    return (
      <StyledView className="w-full p-4">
        <StyledView className="flex-row items-center gap-2">
          <StyledView className="w-[2%] justify-center items-center">
            {item.status === 'completed' ? (
              <CompletedIcon />
            ) : (
              <IncompletedIcon />
            )}
          </StyledView>
          <StyledText className="text-[#000000B2] text-xs font-poppi">
            {item.child.name} {item.child.surname}
          </StyledText>
        </StyledView>
        <StyledView className="flex-row items-center gap-2">
          <StyledView className="w-[2%] items-center">
            <DotsIcon />
          </StyledView>
          <StyledText className="text-black text-base font-poppi-semibold border-b-[1px] w-[95%] border-[#D0D0D0] pb-1">
            {item.location.home_address}
          </StyledText>
        </StyledView>
      </StyledView>
    );
  };

  const noRides = () => (
    <StyledView className="w-full h-[50px] items-center justify-center">
      <StyledText className="text-base text-zinc-600">
        No upcoming rides
      </StyledText>
    </StyledView>
  );

  return (
    <>
      <StyledText className="text-lg mb-4 text-[#204F50] font-poppi-semibold">
        {t('attributes.todaysRideToSchool')}
      </StyledText>
      <StyledView className="border-[1px] items-center p-4 border-[#EDEFF3] h-fit rounded-[18px]">
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{gap: 0}}
          data={items}
          scrollEnabled={false}
          renderItem={renderItem}
          ListEmptyComponent={noRides}
        />

        {Boolean(items?.length) && (
          <StyledTouchableOpacity
            onPress={() => setModalOpen(true)}
            className="w-full justify-center items-center py-3">
            <ArrowDown />
          </StyledTouchableOpacity>
        )}
      </StyledView>
    </>
  );
};

export default Rides;
