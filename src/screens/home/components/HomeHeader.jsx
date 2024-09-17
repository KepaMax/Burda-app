import Styled from '@common/StyledComponents';
import Icons from '@icons/icons.js';

const HomeHeader = () => {
  return (
    <Styled.View className="px-4 py-5 border-b-[1px] border-[#E4E4E4]">
      <Icons.HomeHeaderLogo />
    </Styled.View>
  );
};

export default HomeHeader;
