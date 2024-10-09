import Styled from '@common/StyledComponents';
import {useTranslation} from 'react-i18next';

const Subscription = () => {
  const {t} = useTranslation();

  return (
    <Styled.View className="flex-1 items-center justify-center">
      <Styled.Text className="text-black font-poppins text-base">
        {t('toBeAddedSoon')}
      </Styled.Text>
    </Styled.View>
  );
};

export default Subscription;
