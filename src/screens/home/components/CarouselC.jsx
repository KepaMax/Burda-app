import Carousel from 'react-native-reanimated-carousel';
import {Dimensions} from 'react-native';
import Styled from '@common/StyledComponents';
import {useState} from 'react';

const CarouselC = ({sliderImages}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const width = Dimensions.get('screen').width;

  return (
    <Styled.View className="mb-5">
      <Carousel
        loop
        width={width}
        height={188}
        autoPlay={autoPlay}
        autoPlayInterval={3000}
        scrollAnimationDuration={2000}
        data={sliderImages}
        onSnapToItem={index => {
          setActiveIndex(index);
          setAutoPlay(false); // Stop autoplay
          setTimeout(() => {
            setAutoPlay(true); // Restart autoplay after small delay
          }, 1000); // Delay = how long user pause before autoplay continues
        }}
        renderItem={({item}) => (
          <Styled.View className="flex-1 mx-4 mt-4 rounded-[18px]">
            <Styled.Image
              source={{uri: item}}
              style={{width: width - 34}}
              className="h-[170px] rounded-[18px]"
            />
          </Styled.View>
        )}
      />

      <Styled.View className="w-full absolute bottom-3 items-center">
        <Styled.View className="flex-row gap-2">
          {sliderImages.map((_, index) => (
            <Styled.View
              key={index}
              className={`w-[10px] h-[10px] rounded-full ${
                index === activeIndex ? 'bg-[#FFFEFE]' : 'bg-[#717171]'
              }`}
            />
          ))}
        </Styled.View>
      </Styled.View>
    </Styled.View>
  );
};

export default CarouselC;
