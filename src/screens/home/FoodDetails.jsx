import Styled from '@common/StyledComponents';
import Images from '@images/images.js';
import CustomComponents from '@common/CustomComponents';
import FoodProperties from './components/FoodProperties';
import Ingredients from './components/Ingredients';
import {useNavigation, useRoute} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {useTranslation} from 'react-i18next';
import {useEffect} from 'react';

const FoodDetails = () => {
  const route = useRoute();
  const item = route.params?.item;
  const navigationScreen = route.params?.navigationScreen;
  const navigation = useNavigation();
  const {t} = useTranslation();

  return (
    <Styled.ScrollView>
      <CustomComponents.Header
        overlay={true}
        title={item?.meal?.name ? item?.meal?.name : item.name}
        titleColor="text-white"
        {...(navigationScreen ? {navigationScreen: navigationScreen} : {})}
      />
      <Images.FoodDetailsHeader />
      <Styled.View className="w-full absolute items-center top-[140px]">
        <FastImage
          style={{width: 200, height: 200, borderRadius: 100}}
          source={{
            uri: item?.meal?.thumbnail ? item?.meal?.thumbnail : item.thumbnail,
          }}
        />
      </Styled.View>
      <FoodProperties item={item} navigationScreen={navigationScreen} />

      <Ingredients
        ingredients={
          item?.meal?.ingredients ? item?.meal?.ingredients : item.ingredients
        }
      />

      <CustomComponents.Button
        title={
          navigationScreen === 'Basket' ? t('returnToBasket') : t('goBack')
        }
        padding="py-3"
        margin="mx-5 my-5"
        borderRadius="rounded-[24px]"
        bgColor="bg-[#66B600]"
        buttonAction={() => navigation.goBack()}
      />
    </Styled.ScrollView>
  );
};

export default FoodDetails;
