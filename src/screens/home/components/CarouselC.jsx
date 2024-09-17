import Carousel from 'react-native-reanimated-carousel';
import {Dimensions} from 'react-native';
import Styled from '@common/StyledComponents';
import {useState} from 'react';

const CarouselC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const width = Dimensions.get('screen').width;
  const arr = [...new Array(3).keys()];

  return (
    <Carousel
      loop
      width={width}
      style={{marginBottom: 20}}
      height={188}
      autoPlay={true}
      data={arr}
      scrollAnimationDuration={2000}
      onSnapToItem={index => setActiveIndex(index)}
      renderItem={({index}) => (
        <Styled.View className="flex-1 mx-4 mt-4 border border-zinc-400 rounded-[18px]">
          <Styled.Text style={{textAlign: 'center', fontSize: 30}}>
            {index}
          </Styled.Text>
          <Styled.View className="w-full absolute bottom-3 items-center">
            <Styled.View className="flex-row gap-2">
              {arr.map((item, index) => (
                <Styled.View
                  className={`w-[10px] h-[10px] ${
                    index === activeIndex ? 'bg-[#FFFEFE]' : 'bg-[#717171]'
                  } rounded-full`}
                />
              ))}
            </Styled.View>
          </Styled.View>
        </Styled.View>
      )}
    />
  );
};

export default CarouselC;
