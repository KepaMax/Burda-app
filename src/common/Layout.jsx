import {useMMKVBoolean} from 'react-native-mmkv';
import Styled from './StyledComponents';
import LoadingScreen from './LoadingScreen';

const Layout = ({children}) => {
  const [loading, setLoading] = useMMKVBoolean('loading');

  return (
    <Styled.View className="flex-1">
      {children}
      {loading && <LoadingScreen />}
    </Styled.View>
  );
};

export default Layout;
