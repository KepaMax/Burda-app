import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {styled} from 'nativewind';
import '../locales/index';
import {useTranslation} from 'react-i18next';

const StyledText = styled(Text);
const StyledView = styled(View);

const AboutUs = () => {
  const {t} = useTranslation();
  return (
    <StyledView className="flex-1 bg-[#f6f6f6]">
      <StyledText className='bg-white p-4 mx-5 w-auto mt-5 text-[#414141] font-serrat text-base'>
      {t('attributes.aboutUsTxt')}
      </StyledText>
    </StyledView>
  );
};

export default AboutUs;

const styles = StyleSheet.create({});
