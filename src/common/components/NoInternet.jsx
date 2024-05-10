import {Text, View} from 'react-native';
import React from 'react';
import {styled} from 'nativewind';
import NoConnection from '../../assets/icons/noInternet.svg';
import '../../locales/index';
import {useTranslation} from 'react-i18next';

const StyledView = styled(View);
const StyledText = styled(Text);

const NoInternet = () => {
  const {t} = useTranslation();

  return (
    <StyledView className="flex-1 items-center justify-center">
      <NoConnection />
      <StyledText className="text-black text-lg font-serrat-semiBold mt-[24px]">
        {t('attributes.noInternet')}
      </StyledText>
    </StyledView>
  );
};

export default NoInternet;
