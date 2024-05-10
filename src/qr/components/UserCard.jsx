import {Text, View} from 'react-native';
import {styled} from 'nativewind';
import FastImage from 'react-native-fast-image';

const StyledView = styled(View);
const StyledText = styled(Text);

const UserCard = () => {
  return (
    <StyledView className="flex-1 bg-white shadow-lg shadow-zinc-400 mx-5 mt-7 mb-14 rounded-md items-center p-3">
      <FastImage
        style={{width: 70, height: 70, borderRadius: 50}}
        source={{
          uri: 'https://picsum.photos/70',
          priority: FastImage.priority.normal,
        }}
      />
      <StyledText className="mt-3 text-black text-base font-serrat-medium">
        Alex Sharma
      </StyledText>
      <StyledText className="text-zinc-500 text-sm font-serrat">
        B02314
      </StyledText>
    </StyledView>
  );
};

export default UserCard;
