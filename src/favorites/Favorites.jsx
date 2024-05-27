import {Text, View, TouchableOpacity} from 'react-native';
import {styled} from 'nativewind';
import {useState} from 'react';
import Courses from './components/Courses';
import Instructors from './components/Instructors';
import Partners from './components/Partners';
import '../locales/index';
import {useTranslation} from 'react-i18next';

const StyledView = styled(View);
const StyledText = styled(Text);

const Favorites = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const {t} = useTranslation();

  const onTabPress = tabName => {
    setActiveTab(tabName);
  };

  return (
    <StyledView className="flex-1 bg-[#f6f6f6]">
      <StyledView className="w-full px-5 mb-5 flex-row items-center">
        <StyledView
          className={`w-1/3 border-b-2 ${
            activeTab === 'courses' ? 'border-black' : 'border-zinc-400'
          }`}>
          <TouchableOpacity onPress={() => onTabPress('courses')}>
            <StyledText
              className={`text-zinc-400 text-center text-base font-serrat-medium tracking-tight py-3 ${
                activeTab === 'courses' ? 'text-black' : null
              }`}>
              {t('attributes.mainCourses')}
            </StyledText>
          </TouchableOpacity>
        </StyledView>
        <StyledView
          className={`w-1/3 border-b-2 ${
            activeTab === 'instructors' ? 'border-black' : 'border-zinc-400'
          }`}>
          <TouchableOpacity onPress={() => onTabPress('instructors')}>
            <StyledText
              className={`text-zinc-400 text-center text-base font-serrat-medium tracking-tight py-3 ${
                activeTab === 'instructors' ? 'text-black' : null
              }`}>
              {t('attributes.mainInstructors')}
            </StyledText>
          </TouchableOpacity>
        </StyledView>
        <StyledView
          className={`w-1/3 border-b-2 ${
            activeTab === 'partners' ? 'border-black' : 'border-zinc-400'
          }`}>
          <TouchableOpacity onPress={() => onTabPress('partners')}>
            <StyledText
              className={`text-zinc-400 text-center text-base font-serrat-medium tracking-tight py-3 ${
                activeTab === 'partners' ? 'text-black' : null
              }`}>
              {t('attributes.mainPartners')}
            </StyledText>
          </TouchableOpacity>
        </StyledView>
      </StyledView>

      {activeTab === 'courses' ? (
        <Courses />
      ) : activeTab === 'instructors' ? (
        <Instructors />
      ) : (
        <Partners />
      )}
    </StyledView>
  );
};

export default Favorites;
