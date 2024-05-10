import {useRoute, useNavigation} from '@react-navigation/native';
import WebView from 'react-native-webview';
import {styled} from 'nativewind';
import {View, Text, ActivityIndicator} from 'react-native';

const StyledView = styled(View);

const WebViewPayment = () => {
  const route = useRoute();
  const url = route.params.url;

  return (
    <WebView
      startInLoadingState={true}
      renderLoading={() => {
        return (
          <StyledView
            className={`flex bg-black/20 h-screen z-50 w-screen absolute items-center justify-center`}>
            <ActivityIndicator size="large" color="#0079E9" />
          </StyledView>
        );
      }}
      source={{uri: url}}
    />
  );
};

export default WebViewPayment;
