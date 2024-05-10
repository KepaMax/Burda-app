import {Text, View, TouchableOpacity} from 'react-native';
// import QRCodeScanner from 'react-native-qrcode-scanner';
// import {RNCamera} from 'react-native-camera';
import {styled} from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);

const QrPlaceholder = () => {
  return (
    <StyledView className="items-center py-3">
      <StyledText className="text-black font-serrat-medium text-lg">
        Scan QR code
      </StyledText>
      <StyledView className="my-6">
        {/* <QRCodeScanner
          className="w-32 h-32"
          onRead={this.onSuccess}
          flashMode={RNCamera.Constants.FlashMode.torch}
          topContent={
            <Text>
              Go to <Text>wikipedia.org/wiki/QR_code</Text> on your computer and
              scan the QR code.
            </Text>
          }
          bottomContent={
            <TouchableOpacity>
              <Text>OK. Got it!</Text>
            </TouchableOpacity>
          }
        /> */}
      </StyledView>
    </StyledView>
  );
};

export default QrPlaceholder;
