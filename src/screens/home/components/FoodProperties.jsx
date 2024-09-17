import Styled from '@common/StyledComponents';
import InfoPill from './InfoPill';

const FoodProperties = () => {
  return (
    <>
      <Styled.View className="w-auto mx-5 mb-3 flex-row justify-between items-center">
        <Styled.Text className="text-lg font-semibold text-[#184639]">
          Sezar salad
        </Styled.Text>
        <Styled.View className="flex-row">
          <InfoPill type="new" title="New" overlay={false} />
          <InfoPill type="top" title="Top" overlay={false} />
        </Styled.View>
      </Styled.View>

      <Styled.View className="w-auto h-[84px] bg-white p-2.5 mx-5 rounded-[8px] shadow shadow-zinc-300">
        <Styled.View className="flex-row justify-between">
          <Styled.View className="flex-row gap-1">
            <Styled.View className="w-fit bg-white px-[6px] py-[4px] rounded-[8px] shadow shadow-zinc-300">
              <Styled.Text className="text-[#66B600] text-sm">
                5300g
              </Styled.Text>
            </Styled.View>

            <Styled.View className="w-fit bg-white px-[6px] py-[4px] rounded-[8px] shadow shadow-zinc-300">
              <Styled.Text className="text-[#184639] text-sm">
                830 kkal
              </Styled.Text>
            </Styled.View>
          </Styled.View>

          <Styled.Text className="text-base text-[#42C2E5] font-bold">
            12 AZN
          </Styled.Text>
        </Styled.View>

        <Styled.Text className="text-[#FF8C03] font-bold text-right mt-3">
          4 items left
        </Styled.Text>
      </Styled.View>
    </>
  );
};

export default FoodProperties;
