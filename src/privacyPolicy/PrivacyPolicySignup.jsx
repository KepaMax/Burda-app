import {View, ActivityIndicator} from 'react-native';
import {styled} from 'nativewind';
import WebView from 'react-native-webview';

const StyledView = styled(View);

const PrivacyPolicySignup = () => {
  const url =
    'https://docs.google.com/gview?embedded=true&url=https://tredu-storage-bucket.s3.us-east-2.amazonaws.com/Privacy+policy.pdf';

  return (
    <WebView
      startInLoadingState={true}
      renderLoading={() => {
        return (
          <StyledView
            className={`flex bg-black/20 h-screen z-50 w-screen absolute items-center justify-center`}>
            <ActivityIndicator
              style={{paddingBottom: 140}}
              size="large"
              color="#0079E9"
            />
          </StyledView>
        );
      }}
      source={{uri: url}}
    />
  );
};

export default PrivacyPolicySignup;
