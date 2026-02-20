import Styled from '@common/StyledComponents';
import {useTranslation} from 'react-i18next';

const Branches = () => {
  const {t} = useTranslation();
  return (
    <Styled.View className="flex-1 bg-[#F8F8F8] justify-center items-center px-6">
      <Styled.Text className="text-lg font-poppins-medium text-[#184639] text-center">
        {t('branches')}
      </Styled.Text>
      <Styled.Text className="text-sm font-poppins text-[#757575] mt-2 text-center">
        {t('toBeAddedSoon')}
      </Styled.Text>
    </Styled.View>
  );
};

export default Branches;
