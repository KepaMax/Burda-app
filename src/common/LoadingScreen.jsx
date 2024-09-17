import Styled from '@common/StyledComponents';
import {ActivityIndicator} from 'react-native';

const LoadingScreen = () => {
  return (
    <Styled.View className="w-full h-full absolute bg-black/10 items-center justify-center">
      <ActivityIndicator size="large" />
    </Styled.View>
  );
};

export default LoadingScreen;
