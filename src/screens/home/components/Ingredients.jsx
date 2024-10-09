import Styled from '@common/StyledComponents';
import {useTranslation} from 'react-i18next';

const Ingredients = ({ingredients}) => {
  const {t} = useTranslation();

  const IngredientItem = ({item}) => {
    return (
      <Styled.Text className="w-fit px-3 py-1 m-1 bg-zinc-200 text-sm text-black font-poppins">
        {item.name}
      </Styled.Text>
    );
  };

  return (
    <>
      <Styled.Text className="m-5 mb-3 text-lg font-semibold text-[#184639]">
        {t('ingredients')}
      </Styled.Text>

      <Styled.View className="w-auto flex-row flex-wrap bg-white p-2.5 mx-5 rounded-[8px] shadow shadow-zinc-300">
        {ingredients?.map(item => (
          <IngredientItem key={item.id} item={item} />
        ))}
      </Styled.View>
    </>
  );
};

export default Ingredients;
