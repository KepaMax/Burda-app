import Carousel from 'react-native-reanimated-carousel';
import {Dimensions} from 'react-native';
import Styled from '@common/StyledComponents';
import {useState} from 'react';
import Images from '@images/images';

const CarouselC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const width = Dimensions.get('screen').width;
  const arr = [Images.Banner1, Images.Banner2];

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
      renderItem={({item, index}) => (
        <Styled.View className="flex-1 mx-4 mt-4 rounded-[18px]">
          <Styled.Image
            style={{width: width - 34}}
            className="h-[170px] rounded-[18px]"
            source={item}
          />
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
