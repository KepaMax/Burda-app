import Icons from '@icons/icons.js';
import Styled from './StyledComponents';
import {useTranslation} from 'react-i18next';

const NoInternet = () => {
  const {t} = useTranslation();

  return (
    <Styled.View className="flex-1 items-center justify-center">
      <Icons.NoInternet />
      <Styled.Text className="text-black text-lg font-poppins-semibold mt-[24px]">
        {t('noInternet')}
      </Styled.Text>
    </Styled.View>
  );
};

export default NoInternet;
