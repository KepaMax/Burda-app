import Styled from '@common/StyledComponents';
import Images from '@images/images';
import {useTranslation} from 'react-i18next';

const NoCardAdded = () => {
  const {t} = useTranslation();

  return (
    <Styled.View className="bg-[#F7F8F9] rounded-[8px] p-5 pb-8 items-center m-5 mt-3">
      <Styled.Image
        className="w-[194px] h-[170px]"
        source={Images.NoCardAdded}
      />
      <Styled.Text className="font-poppins-bold text-lg text-[#32343E] text-center mb-3 mt-8">
        {t('noCardAdded')}
      </Styled.Text>
      <Styled.Text className="font-poppins text-lg text-[#2D2D2D] text-center">
        {t('noCardAddedDescription')}
      </Styled.Text>
    </Styled.View>
  );
};

export default NoCardAdded;
