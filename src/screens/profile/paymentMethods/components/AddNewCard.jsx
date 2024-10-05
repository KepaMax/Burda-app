import Styled from '@common/StyledComponents';
import CustomComponents from '@common/CustomComponents';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {fetchData} from '@utils/fetchData';
import storage from '@utils/MMKVStore';

const AddNewCard = () => {
  const {t} = useTranslation();

  const addNewCard = async () => {
    const result = await fetchData({
      url: 'https://api.myburda.com/api/v4/payment-methods/',
      headers: {
        Authorization: `Bearer ${storage.getString('accessToken')}`,
        Accept: '*/*; version=v3',
      },
      method: 'POST',
    });
  };

  return (
    <>
      <CustomComponents.Header title={t('addNewCard')} bgColor="bg-white" />
      <KeyboardAwareScrollView>
        <CustomComponents.Input
          margin="mx-5 my-3"
          title={t('cardNumber')}
          titleColor="text-[#757575]"
          titleSize="text-base"
          titleFontSize="font-poppins-medium"
          placeholder="---- ---- ---- ----"
        />
        <Styled.View className="flex-row justify-between items-center mx-5 mb-10">
          <CustomComponents.Input
            title={t('expirationDate')}
            width="w-[47%]"
            titleColor="text-[#757575]"
            titleSize="text-base"
            titleFontSize="font-poppins-medium"
            placeholder={`${t('month')}/${t('year')}`}
          />

          <CustomComponents.Input
            title="CVV"
            width="w-[47%]"
            titleColor="text-[#757575]"
            titleSize="text-base"
            titleFontSize="font-poppins-medium"
            placeholder="---"
          />
        </Styled.View>

        <Styled.View className="mx-5">
          <CustomComponents.Button
            title={t('addCard')}
            bgColor="bg-[#66B600]"
            borderRadius="rounded-[24px]"
            textSize="text-lg"
            fontWeight="font-poppins-medium"
            padding="py-3"
            buttonAction={() => {
              addNewCard();
            }}
          />
        </Styled.View>
      </KeyboardAwareScrollView>
    </>
  );
};

export default AddNewCard;
