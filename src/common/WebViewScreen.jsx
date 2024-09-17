import WebView from 'react-native-webview';
import {useRoute} from '@react-navigation/native';
import Styled from './StyledComponents';
import CustomComponents from './CustomComponents';

const WebViewScreen = () => {
  const route = useRoute();
  const {url, title} = route.params;

  return (
    <Styled.View className="flex-1">
      <CustomComponents.Header title={title} />
      <WebView source={{uri: url}} />
    </Styled.View>
  );
};

export default WebViewScreen;
