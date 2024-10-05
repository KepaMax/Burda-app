import Styled from '@common/StyledComponents';
import {useTranslation} from 'react-i18next';

const InfoPill = ({type, overlay = true}) => {
  const {t} = useTranslation();

  return (
    <Styled.View
      className={`w-fit ${
        overlay && 'absolute right-6 top-4'
      }  px-2 py-1 m-1 rounded-[8px] ${
        type === 'new' ? 'bg-[#FFC529]' : 'bg-[#FF6135]'
      }`}>
      <Styled.Text className="text-white font-poppins-medium">
        {t(type)}
      </Styled.Text>
    </Styled.View>
  );
};

export default InfoPill;
