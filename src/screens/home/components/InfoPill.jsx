import Styled from '@common/StyledComponents';

const InfoPill = ({type, title, overlay = true}) => {
  return (
    <Styled.View
      className={`w-fit ${
        overlay && 'absolute right-6 top-4'
      }  px-2 py-1 m-1 rounded-[8px] ${
        type === 'new' ? 'bg-[#FFC529]' : 'bg-[#FF6135]'
      }`}>
      <Styled.Text className="text-white font-medium">{title}</Styled.Text>
    </Styled.View>
  );
};

export default InfoPill;
