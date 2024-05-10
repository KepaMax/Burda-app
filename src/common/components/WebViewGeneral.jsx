import {View} from 'react-native';
import WebView from 'react-native-webview';
import {styled} from 'nativewind';
import {useRoute} from '@react-navigation/native';

const StyledView = styled(View);

const WebViewGeneral = () => {
  const route = useRoute();
  const url = route.params.url;

  return (
    <StyledView className="flex-1">
      <WebView source={{uri: url}} />
    </StyledView>
  );
};

export default WebViewGeneral;
