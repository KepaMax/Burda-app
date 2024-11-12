import Styled from '@common/StyledComponents';
import InfoPill from './InfoPill';
import {useTranslation} from 'react-i18next';

const FoodProperties = ({item,navigationScreen}) => {
  const {t} = useTranslation();

  return (
    <>
      <Styled.View className="w-auto mx-5 mb-3 flex-row justify-between items-center">
        <Styled.Text className="text-lg font-poppins text-[#184639]">
          {item?.meal?.name ? item?.meal?.name : item.name}
        </Styled.Text>
      </Styled.View>
      <Styled.View className="flex-row w-auto mx-5 mb-3  items-center">
        {Boolean(item?.meal?.new || item?.new) && (
          <InfoPill type="new" overlay={false} />
        )}
        {Boolean(item?.meal?.top || item?.top) && (
          <InfoPill type="top" overlay={false} />
        )}
      </Styled.View>

      <Styled.View className="w-auto h-[84px] bg-white p-2.5 mx-5 rounded-[8px] justify-center shadow shadow-zinc-300">
        <Styled.View className="flex-row justify-between">
          <Styled.View className="flex-row gap-1">
            {Boolean(item?.meal?.weight || item.weight) && (
              <Styled.View className="w-fit bg-white px-[6px] py-[4px] rounded-[8px] shadow shadow-zinc-300">
                <Styled.Text className="text-[#66B600] text-sm font-poppins">
                  {item?.meal?.weight ? item?.meal?.weight : item.weight} g
                </Styled.Text>
              </Styled.View>
            )}

            {Boolean(item?.meal?.calories || item.calories) && (
              <Styled.View className="w-fit bg-white px-[6px] py-[4px] rounded-[8px] shadow shadow-zinc-300">
                <Styled.Text className="text-[#184639] text-sm font-poppins">
                  {item?.meal?.calories ? item?.meal?.calories : item.calories}{' '}
                  kkal
                </Styled.Text>
              </Styled.View>
            )}
          </Styled.View>

          <Styled.Text className="text-base text-[#42C2E5] font-poppins-bold">
            {item?.meal?.price ? item?.meal?.price : item.price} AZN
          </Styled.Text>
        </Styled.View>
      </Styled.View>
    </>
  );
};

export default FoodProperties;
