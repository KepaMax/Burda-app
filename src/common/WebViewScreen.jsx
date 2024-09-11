import WebView from 'react-native-webview';
import {useRoute} from '@react-navigation/native';
import {StyledView} from './StyledComponents';
import CustomHeader from './CustomHeader';

const WebViewScreen = () => {
  const route = useRoute();
  const {url, title} = route.params;

  return (
    <StyledView className="flex-1">
      <CustomHeader title={title} />
      <WebView source={{uri: url}} />
    </StyledView>
  );
};

export default WebViewScreen;
