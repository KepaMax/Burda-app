import {Text, View, Alert, TouchableOpacity} from 'react-native';
import {styled} from 'nativewind';
import {useRoute, useIsFocused} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import StarIcon from '../assets/icons/starFillYellow.svg';
import LocationIcon from '../assets/icons/locationBlue.svg';
import LanguageIcon from '../assets/icons/languageBlue.svg';
import {useState, useEffect, useContext} from 'react';
import AuthContext from '../common/TokenManager';
import '../locales/index';
import {useTranslation} from 'react-i18next';
import {format, parseISO} from 'date-fns';
import CancelSubscriptionModal from './components/CancelSubscriptionModal';

const StyledText = styled(Text);
const StyledView = styled(View);

const monthsInEnglish = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec',
};

const monthsInAzerbaijani = {
  1: 'Yan',
  2: 'Fev',
  3: 'Mart',
  4: 'Apr',
  5: 'May',
  6: 'İyun',
  7: 'İyul',
  8: 'Avq',
  9: 'Sent',
  10: 'Okt',
  11: 'Noy',
  12: 'Dek',
};

const ActivityDetails = () => {
  const {t} = useTranslation();
  const {
    getStudentAccessTokenFromMemory,
    getSupervisorAccessTokenFromMemory,
    getLanguage,
  } = useContext(AuthContext);
  const route = useRoute();
  const data = route.params.data;
  const studentId = route.params.studentId;
  const [chosenLessonInfoCart, setChosenLessonInfoCart] = useState();
  const [detailedData, setDetailedData] = useState();
  const [newDate, setNewDate] = useState();
  const isFocused = useIsFocused();
  const [cancelSubscriptionModalOpen, setCancelSubscriptionModalOpen] =
    useState(false);

  const formatData = prop => {
    const grades = [];
    const uniqueGrades = [];
    const finalArr = [];
    const handleItem = item => {
      grades.push(item?.grade_range);
      for (let i = 0; i < grades.length; i++) {
        if (grades[i] !== grades[i + 1]) {
          uniqueGrades?.push(grades[i]);
        }
      }
      const dayKeys = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
      ];
      const dayTexts = [];
      dayKeys.forEach(key => {
        if (item[`${key}_from`] !== null && item[`${key}_to`] !== null) {
          const dayNumber =
            key === 'monday'
              ? '1'
              : key === 'tuesday'
              ? '2'
              : key === 'wednesday'
              ? '3'
              : key === 'thursday'
              ? '4'
              : key === 'friday'
              ? '5'
              : key === 'saturday'
              ? '6'
              : key === 'sunday'
              ? '7'
              : null;
          const dayText = `${item[`${key}_from`]} - ${item[`${key}_to`]}`;
          const remainingSeats = item.remaining_seats_total;
          const language = item.language;
          const price = item.price;
          const grade = item?.grade_range;
          const id = item.id;
          dayTexts.push({
            day: dayNumber,
            text: dayText,
            seats: remainingSeats,
            language: language,
            price: price,
            grade: grade,
            id: id,
          });
        }
      });
      if (dayTexts.length > 0) {
        finalArr.push(dayTexts);
      }
    };

    handleItem(prop);

    function processSchedule() {
      const outputArray = [];
      finalArr.forEach(group => {
        const processedGroup = {};
        group.forEach(item => {
          const day = item.day;
          const id = item.id;
          const text = item.text;
          const existingGroup = outputArray.find(
            entry =>
              entry.language === item.language &&
              entry.price === item.price &&
              entry.id === item.id,
          );
          if (existingGroup) {
            existingGroup.day += ` - ${day}`;
            const parts = text.split(' - ');
            const fixedText = `${parts[0].slice(0, -3)} - ${parts[1].slice(
              0,
              -3,
            )}`;
            existingGroup.text.push(`${day}    ${fixedText}`);
          } else {
            processedGroup.day = day;
            processedGroup.id = id;
            processedGroup.language = item.language;
            processedGroup.price = item.price;
            processedGroup.seats = item.seats;
            processedGroup.grade = item.grade;
            const parts = text.split(' - ');
            const fixedText = `${parts[0].slice(0, -3)} - ${parts[1].slice(
              0,
              -3,
            )}`;
            processedGroup.text = [`${day}     ${fixedText}`];
            outputArray.push(processedGroup);
          }
        });
      });

      return outputArray;
    }

    const output = processSchedule();

    if (output.length < 2) {
      setChosenLessonInfoCart({
        interval: output[0].text,
        price: output[0].price,
        days: output[0].day,
        grade: output[0].grade,
        language: output[0].language,
        id: output[0].id,
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const url = data?.course?.url
        ? data?.course?.url
        : data?.course_class?.course?.url;
      try {
        const studentToken = await getStudentAccessTokenFromMemory();
        const supervisorToken = await getSupervisorAccessTokenFromMemory();
        const headers = {
          Authorization: `Bearer ${
            supervisorToken ? supervisorToken : studentToken
          }`,
        };
        const response = await fetch(url, {headers});
        const data = await response.json();
        setDetailedData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    formatData(data);
  }, []);

  const isoDate = parseISO(
    data?.next_payment_date ? data?.next_payment_date : data?.date,
  );

  const formattedDate = format(isoDate ? isoDate : item?.date, 'dd/MM/yyyy');

  const parts = formattedDate.split('/');

  useEffect(() => {
    const currentLanguage = async () => {
      lang = await getLanguage();
      if (lang) {
        lang === 'az'
          ? setNewDate(
              `${parts[0]} ${monthsInAzerbaijani[Number(parts[1])]}, ${
                parts[2]
              }`,
            )
          : setNewDate(
              `${parts[0]} ${monthsInEnglish[Number(parts[1])]}, ${parts[2]}`,
            );
      }
    };
    currentLanguage();
  }, [isFocused]);

  return (
    <StyledView className="flex-1 bg-[#f6f6f6]">
      {cancelSubscriptionModalOpen ? (
        <CancelSubscriptionModal
          courseId={data?.id}
          studentId={studentId}
          setCancelSubscriptionModalOpen={setCancelSubscriptionModalOpen}
        />
      ) : null}
      <StyledView className="p-[10px] bg-white rounded-[8px] shadow shadow-zinc-300 mx-5 my-1">
        <StyledView className="flex-row px-[20px] py-[5px] items-center gap-2.5">
          <StyledView className="items-center">
            <FastImage
              style={{
                width: 55,
                height: 55,
                borderRadius: 100,
              }}
              source={{
                uri: data?.course?.thumbnail
                  ? data?.course?.thumbnail
                  : data?.course_class?.course?.thumbnail,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
            {data?.course?.rating ? (
              <StyledView className="flex-row items-center gap-1 mt-1">
                <StarIcon />
                <StyledText className="text-[10px] text-[#757575] font-serrat">
                  {data?.course?.rating}
                </StyledText>
              </StyledView>
            ) : null}
          </StyledView>
          <StyledView className="">
            <StyledText className="text-[17px] text-[#414141] font-serrat-medium">
              {data?.course?.title
                ? data?.course?.title
                : data?.course_class?.course?.title}
            </StyledText>
            <StyledText className="text-sm font-serrat-medium text-[#414141] mt-[5px]">
              {data?.course?.partner_network?.name
                ? data?.course?.partner_network?.name
                : data?.course_class?.course?.partner_network?.name}
            </StyledText>

            <StyledView className="flex-row items-center">
              <StyledText className="text-sm font-serrat text-[#BABABA]">
                {t('attributes.courseDetailsInstructor')}:
              </StyledText>
              <StyledText
                numberOfLines={1}
                className="text-[15px] w-8/12 ml-1 font-serrat-medium text-[#414141]">
                {detailedData?.instructor?.user?.first_name}{' '}
                {detailedData?.instructor?.user?.last_name}
              </StyledText>
            </StyledView>
          </StyledView>
        </StyledView>
        <StyledView className="px-2 mt-4 mb-1">
          <StyledView className="flex-row items-center justify-between">
            {detailedData?.school?.name ? (
              <StyledView className="w-7/12 flex-row items-center gap-1">
                <LocationIcon />
                <StyledText className="font-serrat text-sm text-[#757575]">
                  {detailedData?.school?.name}
                </StyledText>
                {detailedData?.school?.distance ? (
                  <StyledText className="font-serrat-italic text-sm text-[#757575]">
                    ({detailedData?.school?.distance})
                  </StyledText>
                ) : null}
              </StyledView>
            ) : null}
            {detailedData?.languages?.length ? (
              <StyledView className="flex-row items-center gap-1">
                <LanguageIcon />
                <StyledText className="font-serrat text-sm text-[#757575]">
                  {detailedData?.languages?.join(' | ')}
                </StyledText>
              </StyledView>
            ) : null}
          </StyledView>
        </StyledView>
      </StyledView>

      {chosenLessonInfoCart ? (
        <StyledView className="bg-white rounded-[8px] px-[15px] py-[10px] shadow shadow-zinc-300 m-5">
          <StyledText className="font-serrat-medium text-lg text-[#414141] text-center mb-[10px]">
            {t('attributes.yourCourseSchedule')}:
          </StyledText>
          <StyledView className="w-auto bg-[#ECF3F9] py-[8px] flex-row items-center justify-center ">
            <StyledText className="text-sm font-serrat text-[#414141] mr-2">
              {t('attributes.scheduleWeekdays')}
            </StyledText>
            <StyledText className="text-[#379DDF] text-sm font-serrat-medium">
              {chosenLessonInfoCart?.days}
            </StyledText>
          </StyledView>
          <StyledView className="mx-[15px] flex-row items-center justify-between">
            <StyledView className="pr-2">
              <StyledText className="text-xs font-serrat text-[#757575]">
                {t('attributes.scheduleClasses')}:
              </StyledText>
              <StyledText className="text-base text-[#757575] font-serrat-medium">
                {chosenLessonInfoCart?.grade}
              </StyledText>
            </StyledView>
            <StyledView className="px-[20px] py-[10px]">
              {chosenLessonInfoCart?.interval?.map((interval, index) => {
                return (
                  <StyledText
                    key={index}
                    className="text-base text-[#757575] font-serrat">
                    {interval}
                  </StyledText>
                );
              })}
            </StyledView>
            <StyledView className="flex-row pl-2 items-center gap-4">
              <StyledText className="text-base text-[#0079E9] font-serrat-medium">
                ₼{chosenLessonInfoCart?.price}
              </StyledText>
              <StyledText className="text-sm text-[#F8911E] font-serrat-medium">
                {chosenLessonInfoCart?.language}
              </StyledText>
            </StyledView>
          </StyledView>
        </StyledView>
      ) : null}

      {newDate ? (
        <StyledView className="w-auto p-[10px] mt-4 bg-white mx-5 rounded-[8px] shadow shadow-zinc-300">
          <StyledView className="flex-row items-center gap-4">
            <StyledText className="text-lg text-[#414141] font-serrat-medium">
              {t('attributes.nextPayment')}:
            </StyledText>
            <StyledText className="text-lg text-[#F8911E] font-serrat-semiBold">
              {newDate}
            </StyledText>
          </StyledView>
        </StyledView>
      ) : null}

      {studentId ? (
        <StyledView className="items-center w-auto mt-8">
          <TouchableOpacity
            onPress={() => {
              setCancelSubscriptionModalOpen(true);
            }}>
            <StyledText className="text-center font-serrat-medium text-[#FF3115] text-base">
              {t('attributes.cancelSubscription')}
            </StyledText>
          </TouchableOpacity>
        </StyledView>
      ) : null}
    </StyledView>
  );
};

export default ActivityDetails;
