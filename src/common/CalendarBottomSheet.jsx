import {useMemo, useRef, useState} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  StyledText,
  StyledTouchableOpacity,
  StyledView,
  StyledTouchableWithoutFeedback,
} from './StyledComponents';
import DatePicker from 'react-native-date-picker';
import {useTranslation} from 'react-i18next';

const CalendarBottomSheet = ({date, setDate, setShowCalendar}) => {
  const bottomSheetRef = useRef(null);
  const [localDate, setLocalDate] = useState(date !== null ? date : new Date());
  const {t} = useTranslation();
  const snapPoints = useMemo(() => ['50%'], []);

  const handleClosePress = () => {
    setShowCalendar(false);
  };

  return (
    <StyledView className="bg-black/20 absolute h-full w-full z-50">
      <StyledTouchableWithoutFeedback onPress={handleClosePress}>
        <GestureHandlerRootView style={{flex: 1}}>
          <BottomSheet
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            handleIndicatorStyle={{backgroundColor: '#BEBFC0'}}
            backgroundStyle={{backgroundColor: '#fff'}}
            onClose={() => handleClosePress()}>
            <StyledView className="p-6 items-center justify-between  w-max h-full">
              <StyledText className="text-[#204F50] font-poppi-bold text-xl">
                {t('attributes.chooseDateOfBirth')}
              </StyledText>

              <StyledView className="w-full h-max border-[1px] rounded-[15px] border-[#EDEFF3] justify-center items-center">
                <DatePicker
                  dividerColor="#EDEFF3"
                  maximumDate={new Date()}
                  mode="date"
                  minimumDate={new Date('2012-01-01')}
                  theme="light"
                  inline
                  open={true}
                  date={localDate}
                  onDateChange={date => {
                    setLocalDate(date);
                  }}
                />
              </StyledView>
              <StyledTouchableOpacity
                onPress={() => {
                  setDate(localDate);
                  setShowCalendar(false);
                }}
                className="rounded-[18px] justify-center items-center py-1 w-full bg-[#76F5A4]">
                <StyledText className="text-[#204F50] font-poppi-semibold text-base">
                  {t('attributes.save')}
                </StyledText>
              </StyledTouchableOpacity>
            </StyledView>
          </BottomSheet>
        </GestureHandlerRootView>
      </StyledTouchableWithoutFeedback>
    </StyledView>
  );
};

export default CalendarBottomSheet;
