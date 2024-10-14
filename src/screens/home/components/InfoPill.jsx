import Styled from '@common/StyledComponents';
import {useTranslation} from 'react-i18next';

const InfoPill = ({type, overlay = true, customPosition}) => {
  const {t} = useTranslation();

  return (
    <Styled.View
      className={`z-50 w-[60px] ${
        overlay && 'absolute right-6 top-4'
      }  px-2 py-1 m-1 rounded-[8px] ${
        type === 'new' ? 'bg-[#FFC529]' : 'bg-[#FF6135]'
      } ${customPosition} ${t(type) === 'POPULYAR' && 'w-[100px]'}`}>
      <Styled.Text className="text-white font-poppins-medium text-center">
        {t(type)}
      </Styled.Text>
    </Styled.View>
  );
};

export default InfoPill;
