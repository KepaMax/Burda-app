import {Dimensions} from 'react-native';
import CustomComponents from './CustomComponents';
import {useTranslation} from 'react-i18next';
import Styled from './StyledComponents';
import {useState, useEffect} from 'react';
import {fetchData} from '@utils/fetchData';

const ViewBasket = ({navigation}) => {
  const {t} = useTranslation();
  const screenWidth = Dimensions.get('screen').width;
  const [totalPrice, setTotalPrice] = useState(null);

  const getBasketItems = async () => {
    const result = await fetchData({
      url: 'https://api.myburda.com/api/v1/basket-items/',
      tokenRequired: true,
    });

    if (result?.success) {
      setTotalPrice(result.data.total_price);
    }
  };

  useEffect(() => {
    getBasketItems();
  }, []);

  return (
    <>
      <CustomComponents.Button
        title={t('viewBasket')}
        bgColor="bg-white"
        textColor="text-[#FF8C03]"
        padding="p-3"
        extraBtnStyling="w-full absolute z-10 bottom-[90px] left-[20px] border-[1px] border-[#FF8C03] justify-start"
        widthInPixels={screenWidth - 40}
        buttonAction={() => {
          navigation.navigate('Home', {
            screen: 'Basket',
          });
        }}
      />
      <Styled.Text className="absolute bottom-[105px] right-[40px] z-20">
        {totalPrice} AZN
      </Styled.Text>
    </>
  );
};

export default ViewBasket;
