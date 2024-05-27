import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import {useState} from 'react';
import {styled} from 'nativewind';
import OrangeDropdownIcon from '../../assets/icons/orangeDropdown.svg';
import LineIcon from '../../assets/icons/line.svg';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const History = () => {
  const [courseNameDropdownOpen, setCourseNameDropdownOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [courseStartDateDropdownOpen, setCourseStartDateDropdownOpen] =
    useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [courseEndDateDropdownOpen, setCourseEndDateDropdownOpen] =
    useState(false);
  const [selectedEndDate, setSelectedEndDate] = useState('');

  const data = [
    {
      title: 'Chess',
      id: 1,
    },
    {
      title: 'Dance',
      id: 2,
    },
    {
      title: 'Piano',
      id: 3,
    },
  ];

  const startDateData = [
    {
      title: 'May 3, 2023',
      id: 1,
    },
    {
      title: 'September 15, 2023',
      id: 2,
    },
    {
      title: 'June 5, 2023',
      id: 3,
    },
  ];

  const endDateData = [
    {
      title: 'May 3, 2023',
      id: 1,
    },
    {
      title: 'September 15, 2023',
      id: 2,
    },
    {
      title: 'June 5, 2023',
      id: 3,
    },
  ];

  const renderItem = ({item, type}) => {
    return (
      <StyledTouchableOpacity
        onPress={() => {
          if (type === 'name') {
            setSelectedCourse(item.title);
            setCourseNameDropdownOpen(false);
          } else if (type === 'startdate') {
            setSelectedStartDate(item.title);
            setCourseStartDateDropdownOpen(false);
          } else if (type === 'enddate') {
            setSelectedEndDate(item.title);
            setCourseEndDateDropdownOpen(false);
          }
        }}
        className="w-full py-4 px-7">
        <StyledText className="text-zinc-500">{item.title}</StyledText>
      </StyledTouchableOpacity>
    );
  };

  const itemSeperator = () => {
    return <StyledView className="h-px w-auto bg-zinc-100 mx-2"></StyledView>;
  };

  return (
    <StyledView className="flex-1 pt-12">
      <StyledView className="w-auto mx-5 relative">
        <StyledTouchableOpacity
          onPress={() => {
            setCourseNameDropdownOpen(!courseNameDropdownOpen);
          }}
          className="w-full py-5 px-7 shadow-md shadow-zinc-400 bg-white flex flex-row items-center justify-between rounded-md">
          <StyledText
            className={`${
              selectedCourse ? 'text-zinc-500' : 'text-zinc-400'
            } text-sm font-serrat-medium`}>
            {selectedCourse ? selectedCourse : 'Choose course name'}
          </StyledText>
          <OrangeDropdownIcon />
        </StyledTouchableOpacity>
        <StyledView
          className={`absolute w-full top-14 z-50 ${
            courseNameDropdownOpen ? 'block' : 'hidden'
          } bg-white shadow-md shadow-zinc-400 rounded-md mt-4 h-[150px]`}>
          <FlatList
            data={data}
            ItemSeparatorComponent={itemSeperator}
            renderItem={item => {
              renderItem(item, 'name');
            }}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        </StyledView>
      </StyledView>

      <StyledView className="w-full  pt-7 px-5 flex-row justify-between items-center">
        <StyledView className="w-auto relative">
          <StyledTouchableOpacity
            onPress={() => {
              setCourseStartDateDropdownOpen(!courseStartDateDropdownOpen);
            }}
            className="w-auto py-5 px-7 shadow-md shadow-zinc-400 bg-white flex flex-row items-center justify-between rounded-md">
            <StyledText
              className={`pr-4 ${
                selectedStartDate ? 'text-zinc-500' : 'text-zinc-400'
              } text-sm font-serrat-medium`}>
              {selectedStartDate ? selectedStartDate : 'Select date'}
            </StyledText>
            <OrangeDropdownIcon />
          </StyledTouchableOpacity>
          <StyledView
            className={`absolute w-full top-14 ${
              courseStartDateDropdownOpen ? 'block' : 'hidden'
            } bg-white shadow-md shadow-zinc-400 rounded-md mt-4 h-[150px]`}>
            <FlatList
              data={startDateData}
              ItemSeparatorComponent={itemSeperator}
              renderItem={item => {
                renderItem(item, 'startdate');
              }}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
            />
          </StyledView>
        </StyledView>
        <LineIcon />
        <StyledView className="w-auto relative">
          <StyledTouchableOpacity
            onPress={() => {
              setCourseEndDateDropdownOpen(!courseEndDateDropdownOpen);
            }}
            className="w-auto py-5 px-7 shadow-md shadow-zinc-400 bg-white flex flex-row items-center justify-between rounded-md">
            <StyledText
              className={`pr-4 ${
                selectedEndDate ? 'text-zinc-500' : 'text-zinc-400'
              } text-sm font-serrat-medium`}>
              {selectedEndDate ? selectedEndDate : 'Select date'}
            </StyledText>
            <OrangeDropdownIcon />
          </StyledTouchableOpacity>
          <StyledView
            className={`absolute w-full top-14 ${
              courseEndDateDropdownOpen ? 'block' : 'hidden'
            } bg-white shadow-md shadow-zinc-400 rounded-md mt-4 h-[150px]`}>
            <FlatList
              data={endDateData}
              ItemSeparatorComponent={itemSeperator}
              renderItem={item => {
                renderItem(item, 'enddate');
              }}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
            />
          </StyledView>
        </StyledView>
      </StyledView>
    </StyledView>
  );
};

export default History;

const styles = StyleSheet.create({});
