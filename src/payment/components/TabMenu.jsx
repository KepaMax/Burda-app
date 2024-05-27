import {Text, View, TouchableOpacity} from 'react-native';
import {useState, useEffect} from 'react';
import {styled} from 'nativewind';
import History from './History';
import Methods from './Methods';

const StyledView = styled(View);
const StyledText = styled(Text);

const TabMenu = () => {
  const [activeTab, setActiveTab] = useState('methods');

  return (
    <StyledView className="my-4 flex-1">
      <StyledView className="items-center relative mx-5">
        <StyledView className="w-full h-[2px] bg-zinc-200 absolute top-[52px]"></StyledView>
        <StyledView className="w-full flex-row items-center">
          <StyledView className="w-1/2">
            <TouchableOpacity
              onPress={() => {
                setActiveTab('history');
              }}>
              <StyledText
                className={`text-center font-serrat-medium tracking-tight p-4 border-b-2 border-zinc-200 ${
                  activeTab === 'history'
                    ? 'border-black text-black'
                    : 'text-zinc-300'
                }`}>
                History
              </StyledText>
            </TouchableOpacity>
          </StyledView>
          <StyledView className="w-1/2">
            <TouchableOpacity
              onPress={() => {
                setActiveTab('methods');
              }}>
              <StyledText
                className={`text-center font-serrat-medium tracking-tight p-4 border-b-2 border-zinc-200 ${
                  activeTab === 'methods'
                    ? 'border-black text-black'
                    : 'text-zinc-300'
                }`}>
                Methods
              </StyledText>
            </TouchableOpacity>
          </StyledView>
        </StyledView>
      </StyledView>
      <>{activeTab === 'history' ? <History /> : <Methods />}</>
    </StyledView>
  );
};

export default TabMenu
