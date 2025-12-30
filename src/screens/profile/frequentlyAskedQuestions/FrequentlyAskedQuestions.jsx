import Styled from '@common/StyledComponents';
import CustomComponents from '@common/CustomComponents';
import {useState} from 'react';
import {FlatList} from 'react-native';
import {useTranslation} from 'react-i18next';
import Icons from '@icons/icons';
import faqData from '../../../data/faq.json';

const FrequentlyAskedQuestions = () => {
  const {t} = useTranslation();
  const [expandedId, setExpandedId] = useState(1); // İlk soru açık başlasın
  const faqList = faqData.faq;

  const toggleQuestion = id => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderQuestionItem = ({item}) => {
    const isExpanded = expandedId === item.id;

    return (
      <Styled.TouchableOpacity
        onPress={() => toggleQuestion(item.id)}
        activeOpacity={0.7}
        className="px-5 py-4 border-b border-gray-200">
        <Styled.View className="flex-row items-center justify-between">
          <Styled.Text
            className="text-[#292B2D] text-base font-poppins-regular flex-1 mr-3"
            numberOfLines={isExpanded ? undefined : 2}>
            {item.question}
          </Styled.Text>
          {isExpanded ? (
            <Icons.ArrowUp />
          ) : (
            <Icons.ArrowDown />
          )}
        </Styled.View>
        {isExpanded && (
          <Styled.Text className="text-[#868782] text-sm font-poppins-regular mt-3">
            {item.answer}
          </Styled.Text>
        )}
      </Styled.TouchableOpacity>
    );
  };

  return (
    <>
      <CustomComponents.Header
        title={t('frequentlyAskedQuestions')}
        bgColor="bg-white"
      />
      <FlatList
        data={faqList}
        renderItem={renderQuestionItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{paddingBottom: 20}}
      />
    </>
  );
};

export default FrequentlyAskedQuestions;

