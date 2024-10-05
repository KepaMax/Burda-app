import Styled from '@common/StyledComponents';
import {useTranslation} from 'react-i18next';
import {FlatList} from 'react-native';
import {format, addDays, getMonth, getYear} from 'date-fns';
import {enUS, az} from 'date-fns/locale';
import storage from '@utils/MMKVStore';
import {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

const WeeklyMenu = () => {
  const today = new Date();
  const month = getMonth(today) + 1;
  const year = getYear(today);
  const [weekDays, setWeekdays] = useState([]);
  const {t} = useTranslation();
  const navigation = useNavigation();

  function getWeekDays(selectedLanguage) {
    const locales = {
      en: enUS,
      az: az,
    };

    const weekdays = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = addDays(today, i);

      const dayName = format(currentDate, 'EEEEEE', {
        locale: locales[selectedLanguage],
      });
      const date = format(currentDate, 'd', {
        locale: locales[selectedLanguage],
      });

      weekdays.push({
        dayName,
        date,
      });
    }

    setWeekdays(weekdays);
  }

  useEffect(() => {
    const selectedLanguage = storage.getString('selectedLanguage');
    getWeekDays(selectedLanguage);
  }, []);

  const MenuItem = ({item}) => {
    return (
      <Styled.TouchableOpacity
        onPress={() => {
          navigation.navigate('FoodMenu', {
            month: month,
            year: year,
            date: item.date,
            fullDate: `${year}-${month}-${item.date}`,
          });
        }}
        className={`min-w-[48px] px-[16px] py-[24px] ${
          weekDays[0].dayName === item.dayName ? 'bg-[#66B600]' : 'bg-white'
        } rounded-[100px] shadow shadow-zinc-300`}>
        <Styled.Text
          className={`${
            weekDays[0].dayName === item.dayName
              ? 'text-white'
              : 'text-[#67666D]'
          } text-center mb-[18px] font-poppins-medium text-xs`}>
          {item.dayName}
        </Styled.Text>
        <Styled.Text
          className={`${
            weekDays[0].dayName === item.dayName
              ? 'text-white'
              : 'text-[#67666D]'
          } text-center mb-[18px] font-poppins-medium text-xs`}>
          {item.date}
        </Styled.Text>
      </Styled.TouchableOpacity>
    );
  };

  return (
    <>
      <Styled.Text className="text-[20px] text-[#184639] font-poppins-medium mx-5">
        {t('weeklyMenu')}
      </Styled.Text>

      <FlatList
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 20,
          padding: 20,
          paddingRight: 40,
          backgroundColor: 'white',
          margin: 20,
          borderRadius: 8,
        }}
        horizontal
        data={weekDays}
        renderItem={({item}) => <MenuItem item={item} />}
      />
    </>
  );
};

export default WeeklyMenu;
