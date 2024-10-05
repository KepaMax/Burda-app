import Styled from '@common/StyledComponents';
import InfoPill from './InfoPill';
import {useTranslation} from 'react-i18next';

const FoodProperties = ({item}) => {
  const {t} = useTranslation();

  return (
    <>
      <Styled.View className="w-auto mx-5 mb-3 flex-row justify-between items-center">
        <Styled.Text
          numberOfLines={1}
          className="max-w-[200px] text-lg font-poppins text-[#184639]">
          {item.name}
        </Styled.Text>
        <Styled.View className="flex-row">
          {item.new && <InfoPill type="new" overlay={false} />}
          {item.top && <InfoPill type="top" overlay={false} />}
        </Styled.View>
      </Styled.View>

      <Styled.View className="w-auto h-[84px] bg-white p-2.5 mx-5 rounded-[8px] shadow shadow-zinc-300">
        <Styled.View className="flex-row justify-between">
          <Styled.View className="flex-row gap-1">
            {item.weight && (
              <Styled.View className="w-fit bg-white px-[6px] py-[4px] rounded-[8px] shadow shadow-zinc-300">
                <Styled.Text className="text-[#66B600] text-sm font-poppins">
                  {item.weight} g
                </Styled.Text>
              </Styled.View>
            )}

            {item.calories && (
              <Styled.View className="w-fit bg-white px-[6px] py-[4px] rounded-[8px] shadow shadow-zinc-300">
                <Styled.Text className="text-[#184639] text-sm font-poppins">
                  {item.calories} kkal
                </Styled.Text>
              </Styled.View>
            )}
          </Styled.View>

          <Styled.Text className="text-base text-[#42C2E5] font-poppins-bold">
            {item.price} AZN
          </Styled.Text>
        </Styled.View>

        <Styled.Text className="text-[#FF8C03] font-poppins-bold text-right mt-3">
          {item.quantity} {t('left')}
        </Styled.Text>
      </Styled.View>
    </>
  );
};

export default FoodProperties;
