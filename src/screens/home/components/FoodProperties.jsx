import Styled from '@common/StyledComponents';
import InfoPill from './InfoPill';
import {useTranslation} from 'react-i18next';

const FoodProperties = ({item, navigationScreen}) => {
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
        <Styled.View className="flex-row justify-between items-center">
          <Styled.View>
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
                    {item?.meal?.calories
                      ? item?.meal?.calories
                      : item.calories}{' '}
                    kkal
                  </Styled.Text>
                </Styled.View>
              )}
            </Styled.View>
            <Styled.View className="flex-row gap-1 mt-1">
              {Boolean(item?.meal?.carbohydrates || item.carbohydrates) && (
                <Styled.View className="w-fit bg-white px-[6px] py-[4px] rounded-[8px] shadow shadow-zinc-300">
                  <Styled.Text className="text-[#66B600] text-sm font-poppins">
                    {item?.meal?.carbohydrates
                      ? item?.meal?.carbohydrates
                      : item.carbohydrates}{' '}
                    {t("carbohydrates")}
                  </Styled.Text>
                </Styled.View>
              )}

              {Boolean(item?.meal?.fat || item.fat) && (
                <Styled.View className="w-fit bg-white px-[6px] py-[4px] rounded-[8px] shadow shadow-zinc-300">
                  <Styled.Text className="text-[#184639] text-sm font-poppins">
                    {item?.meal?.fat ? item?.meal?.fat : item.fat} {t("fat")}
                  </Styled.Text>
                </Styled.View>
              )}
            </Styled.View>
          </Styled.View>

          <Styled.View className="flex-row items-center gap-2">
            {(() => {
              const mealData = item?.meal ? item.meal : item;
              const hasDiscount = mealData?.has_discount;
              
              if (hasDiscount) {
                return (
                  <>
                    <Styled.Text
                      className="text-base text-[#BF4E30] font-poppins-bold"
                      style={{textDecorationLine: 'line-through', textDecorationColor: '#C53030'}}>
                      {mealData?.original_price} ₼
                    </Styled.Text>
                    
                    <Styled.Text className="text-base text-[#42C2E5] font-poppins-bold">
                      {mealData?.discounted_price} ₼
                    </Styled.Text>
                  </>
                );
              } else {
                return (
                  <Styled.Text className="text-base text-[#42C2E5] font-poppins-bold">
                    {mealData?.price} ₼
                  </Styled.Text>
                );
              }
            })()}
          </Styled.View>
        </Styled.View>
      </Styled.View>
    </>
  );
};

export default FoodProperties;
