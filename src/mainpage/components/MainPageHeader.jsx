import RingbellHomeIcon from "../../../assets/icons/ringbell-home.svg"
import LogoHomeIcon from "../../../assets/icons/logo-home.svg"
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../common/TokenManager";
import "../../locales/index";
import { StyledTouchableOpacity, StyledView } from "../../common/components/StyledComponents";

const MainPageHeader = () => {
  const [userType, setUserType] = useState(null);
  const { getUserType } = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    const getType = async () => {
      const type = await getUserType();
      setUserType(type);
    };
    getType();
  }, []);

  return (
    <StyledView className=" px-4 py-2 flex-row justify-between bg-[#7658F2]">
      <StyledTouchableOpacity className="border-[1px] border-[#BABABA] w-[44px] h-[44px] items-center justify-center rounded-[10px]">
        <LogoHomeIcon />
      </StyledTouchableOpacity>

      <StyledView className="flex-row gap-[16px]">
        <StyledTouchableOpacity onPress={() => navigation.navigate("Notifications")} className="border-[1px] bg-white border-[#EDEFF3] w-[40px] h-[40px] items-center justify-center rounded-full">
          <RingbellHomeIcon />
        </StyledTouchableOpacity>
      </StyledView>
    </StyledView>
  );
};

export default MainPageHeader;
