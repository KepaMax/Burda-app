import { TouchableOpacity, Text, View, Share, Alert } from "react-native";
import { styled } from "nativewind";
import { useNavigation } from "@react-navigation/native";
import ArrowLeftIcon from "../../../assets/icons/arrow-left-header.svg";
import ShareIcon from "../../assets/icons/share.svg";
import { StyledTouchableOpacity } from "./StyledComponents";

const StyledView = styled(View);
const StyledText = styled(Text);

const CustomHeader = ({ title, noBackBtn, share, url, bg }) => {
  const navigation = useNavigation();

  const onShare = async () => {
    const regex =
      /\/api\/(courses|instructors|partner-networks|course-classes)\/(\d+)\/$/;

    const match = url.match(regex);
    let transformedUrl = null;

    if (match) {
      const type = match[1];
      const id = match[2];

      transformedUrl = `https://tredu.io/#/app/${type}/${id}/`;
    } else {
      console.error("No match found for type and ID.");
    }

    try {
      await Share.share({ message: transformedUrl });
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <StyledView className={`w-full bg-[#7658F2]  items-center`}>
      <StyledView className="w-11/12 items-center justify-center flex-row relative">
        {noBackBtn ? null : (
          <StyledTouchableOpacity hitSlop={{ top: 50, right: 50, bottom: 50, left: 50 }} onPress={()=>navigation.goBack()} className="absolute left-0">
            <ArrowLeftIcon />
          </StyledTouchableOpacity>
        )}
        <StyledText className="text-white font-poppi-medium text-lg pb-5 pt-6">
          {title}
        </StyledText>
      </StyledView>
    </StyledView>
  );
};

export default CustomHeader;
