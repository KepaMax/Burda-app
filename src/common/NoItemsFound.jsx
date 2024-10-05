import {useTranslation} from 'react-i18next';
import Styled from './StyledComponents';
import Images from '@images/images';

const NoItemsFound = () => {
  const {t} = useTranslation();

  return (
    <Styled.View className="pt-[150px] items-center justify-center">
      <Images.NoItems />
      <Styled.Text className="text-black mt-5 font-poppins-medium text-base">
        {t('noItemsFound')}
      </Styled.Text>
    </Styled.View>
  );
};

export default NoItemsFound;
