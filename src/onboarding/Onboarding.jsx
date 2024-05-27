import {useRef, useEffect, useState, useContext} from 'react';
import {
  TouchableOpacity,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
} from 'react-native';
import {
  StyledText,
  StyledTouchableOpacity,
  StyledView,
} from '../common/components/StyledComponents';
import Animated, {
  FadeIn,
  FadeInLeft,
  FadeInRight,
  FadeInDown,
  Easing,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import '../locales/index';
import {useTranslation} from 'react-i18next';
import AuthContext from '../common/TokenManager';
import BookmarkIcon from '../assets/icons/bookmark.svg';
import BlurRight from '../assets/images/blurRight.png';
import BlurLeft from '../assets/images/blurLeft.png';
import StarSmallIcon from '../assets/icons/starFillYellow.svg';
import OuterTrack from '../assets/images/outerTrack.png';
import OuterTrackImg1 from '../assets/images/outerTrackImg1.png';
import OuterTrackImg2 from '../assets/images/outerTrackImg2.png';
import InnerTrack from '../assets/images/innerTrack.png';
import InnerTrackImg1 from '../assets/images/innerTrackImg1.png';
import InnerTrackImg2 from '../assets/images/innerTrackImg2.png';
import InnerTrackImg3 from '../assets/images/innerTrackImg3.png';
import CenterImg from '../assets/images/trackCenterImg.png';
import Background from '../assets/images/background.png';
import OnboardScreen1Img1 from '../assets/images/onboardScreen1Img1.png';
import OnboardScreen1Img2 from '../assets/images/onboardScreen1Img2.png';
import OnboardScreen1Img3 from '../assets/images/onboardScreen1Img3.png';
import OnboardScreen2Img1 from '../assets/images/onboardScreen2Img1.png';
import OnboardScreen2Img2 from '../assets/images/onboardScreen2Img2.png';
import OnboardScreen2Img3 from '../assets/images/onboardScreen2Img3.png';
import Line from '../assets/icons/lineSeperator.svg';
import Location from '../assets/icons/locationDark.svg';
import AzFlag from '../assets/icons/az.svg';
import GbFlag from '../assets/icons/gb.svg';
import On from '../assets/icons/on.svg';

const Onboarding = () => {
  const rotationValue = useSharedValue(0);
  const rotationImgValue = useSharedValue(0);
  const {t, i18n} = useTranslation();
  const {setInitialLogin, setTrigger, setLanguage, getLanguage} =
    useContext(AuthContext);
  const data = ['', '', '', ''];
  const deviceWidth = Dimensions.get('window').width;
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [lang, setLang] = useState();

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{rotate: `${rotationValue.value}deg`}],
  }));

  const animatedStyleImg = useAnimatedStyle(() => ({
    transform: [{rotate: `${rotationImgValue.value}deg`}],
  }));

  useEffect(() => {
    const currentLanguage = async () => {
      const activeLanguage = await getLanguage();
      setLang(activeLanguage);
    };
    currentLanguage();
  }, []);

  useEffect(() => {
    if (currentIndex > -1) {
      const timer = setInterval(() => {
        const nextIndex = (currentIndex + 1) % data.length;
        setCurrentIndex(nextIndex);
      }, 3000);

      return () => clearInterval(timer);
    }
  }, [currentIndex]);

  const setGlobalLoginState = async () => {
    await setInitialLogin(true);
  };

  const handleRotation = () => {
    rotationValue.value += 0.1;
    rotationImgValue.value -= 0.1;
  };

  useEffect(() => {
    const intervalID = setInterval(handleRotation, 10);

    return () => {
      clearInterval(intervalID);
    };
  }, []);

  return data ? (
    <ImageBackground source={Background} className="flex-1">
      <ScrollView contentContainerStyle={{alignItems: 'center', flex: 1}}>
        {currentIndex === -1 ? (
          <StyledView className="w-full p-5 flex-1">
            <StyledText className="text-zinc-800 mb-4 text-black text-xl font-serrat-medium">
              {t('attributes.chooseLanguage')}
            </StyledText>
            <StyledView className="gap-[8px]">
              <TouchableOpacity
                onPress={() => {
                  i18n.changeLanguage('az');
                  setLang('az');
                  setLanguage('az');
                }}>
                <StyledView
                  className={`flex-row items-center py-[15px] px-[24px] bg-white shadow shadow-zinc-300 rounded-[8px] justify-between
               `}>
                  <StyledView className="flex-row items-center">
                    <StyledView className="w-8 h-8 rounded-md overflow-hidden">
                      <AzFlag />
                    </StyledView>
                    <StyledText className="text-base font-serrat-medium text-zinc-800 ml-4">
                      Azərbaycan dili
                    </StyledText>
                  </StyledView>
                  <StyledView
                    className={`${lang === 'az' ? 'block' : 'hidden'}`}>
                    <On />
                  </StyledView>
                </StyledView>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  i18n.changeLanguage('en');
                  setLang('en');
                  setLanguage('en');
                }}>
                <StyledView
                  className={`flex-row items-center py-[15px] px-[24px] bg-white shadow shadow-zinc-300 rounded-[8px] justify-between`}>
                  <StyledView className="flex-row items-center">
                    <StyledView className="w-8 h-8 rounded-md overflow-hidden">
                      <GbFlag />
                    </StyledView>
                    <StyledText className="text-zinc-800 ml-4 text-base font-serrat-medium">
                      English
                    </StyledText>
                  </StyledView>
                  <StyledView
                    className={`${lang === 'en' ? 'block' : 'hidden'}`}>
                    <On />
                  </StyledView>
                </StyledView>
              </TouchableOpacity>
            </StyledView>
          </StyledView>
        ) : currentIndex === 0 ? (
          <Animated.View entering={FadeIn.duration(500)}>
            <StyledView className="items-center pt-[50px]">
              <Animated.View
                style={[
                  {
                    width: deviceWidth,
                    height: 370,
                  },
                  animatedStyles,
                ]}
                // className="items-center"
              >
                <StyledView className="w-[370px] items-center justify-center h-[370px]">
                  <Image
                    style={{width: 370, height: 370, resizeMode: 'contain'}}
                    source={OuterTrack}
                  />
                </StyledView>
                <Animated.Image
                  source={OuterTrackImg1}
                  style={[
                    {
                      width: 80,
                      height: 80,
                    },
                    animatedStyleImg,
                  ]}
                  className="absolute -top-10 right-32 z-50"
                />
                <Animated.Image
                  source={OuterTrackImg2}
                  style={[
                    {
                      width: 80,
                      height: 80,
                    },
                    animatedStyleImg,
                  ]}
                  className="absolute left-4 bottom-8 z-50"
                />
                <StyledView className="w-[370px] h-[370px] absolute items-center justify-center ">
                  <Image
                    style={{
                      width: 242,
                      height: 242,
                      resizeMode: 'contain',
                    }}
                    source={InnerTrack}
                  />
                  <Animated.Image
                    source={InnerTrackImg1}
                    style={[
                      {
                        width: 60,
                        height: 60,
                      },
                      animatedStyleImg,
                    ]}
                    className="absolute right-32 bottom-14 z-50"
                  />
                  <Animated.Image
                    source={InnerTrackImg2}
                    style={
                      ([
                        {
                          width: 70,
                          height: 70,
                        },
                      ],
                      animatedStyleImg)
                    }
                    className="absolute left-16 top-20 z-50"
                  />
                  <Animated.Image
                    source={InnerTrackImg3}
                    style={[
                      {
                        width: 50,
                        height: 50,
                      },
                      animatedStyleImg,
                    ]}
                    className="absolute right-14 top-32 z-50"
                  />
                  <Animated.Image
                    source={CenterImg}
                    style={[
                      {
                        width: 80,
                        height: 80,
                      },
                      animatedStyleImg,
                    ]}
                    className="absolute right-50 top-50 z-50"
                  />
                </StyledView>
              </Animated.View>
              <StyledText
                style={{width: deviceWidth - 40}}
                className="mt-[40px] text-center text-[32px] text-black font-serrat-semiBold z-50">
                {t('attributes.onboarding1')}
              </StyledText>
            </StyledView>
          </Animated.View>
        ) : currentIndex === 1 ? (
          <>
            <Animated.View
              entering={FadeInRight.duration(400).easing(Easing.ease)}
              style={{width: deviceWidth - 40}}>
              <StyledView className="w-auto h-[110px] my-[6px] mx-5 bg-white/50 border border-zinc-300 rounded-[8px] mt-[50px] mr-[10px]">
                <StyledView className="absolute z-50 right-3 top-3">
                  <BookmarkIcon />
                </StyledView>

                <StyledView className="w-full h-full p-[10px] flex-row rounded-lg">
                  <Image
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: 5,
                      resizeMode: 'cover',
                      marginRight: 16,
                    }}
                    source={OnboardScreen1Img1}
                  />

                  <Image
                    style={{
                      position: 'absolute',
                      right: -40,
                      top: -30,
                    }}
                    source={BlurRight}
                  />
                  <StyledView className="flex-1 justify-between py-1">
                    <StyledView>
                      <StyledText
                        numberOfLines={1}
                        className="text-[#414141] text-base font-serrat-medium mr-2">
                        {t('attributes.onboardingScreen1Item1Course')}
                      </StyledText>

                      <StyledView className="flex-row items-center mt-1">
                        <StyledText
                          numberOfLines={1}
                          className="font-serrat text-sm text-[#6D6D6D]">
                          {t('attributes.onboardingScreen1Item1Partner')}
                        </StyledText>
                      </StyledView>
                    </StyledView>

                    <StyledView className="flex-row mt-1 w-full items-center justify-end">
                      <StyledView className="flex-row  bg-[#EFF3FA] items-center rounded-full py-1.5 px-3">
                        <StyledText className="text-[#0B1875] text-xs font-serrat">
                          {t('attributes.coursesPricefromEn')}
                        </StyledText>
                        <StyledText className="text-[#0B1875] text-xs font-serrat-semiBold">
                          50 AZN
                        </StyledText>
                        <StyledText className="text-[#0B1875] text-xs font-serrat">
                          {t('attributes.coursesPricefromAz')}
                        </StyledText>
                      </StyledView>
                    </StyledView>
                  </StyledView>
                </StyledView>
              </StyledView>
            </Animated.View>

            <Animated.View
              entering={FadeInLeft.duration(400).delay(100).easing(Easing.ease)}
              style={{width: deviceWidth - 40}}>
              <StyledView className="w-auto h-[110px] my-[6px] mx-5 bg-white/50 border border-zinc-300 rounded-[8px] mt-[40px] ml-[10px]">
                <StyledView className="absolute z-50 right-3 top-3">
                  <BookmarkIcon />
                </StyledView>

                <StyledView className="w-full h-full p-[10px] flex-row rounded-lg ">
                  <Image
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: 5,
                      resizeMode: 'cover',
                      marginRight: 16,
                      zIndex: 5,
                    }}
                    source={OnboardScreen1Img2}
                  />

                  <Image
                    style={{
                      position: 'absolute',
                      left: -40,
                      top: -30,
                    }}
                    source={BlurLeft}
                  />
                  <StyledView className="flex-1 justify-between py-1">
                    <StyledView>
                      <StyledText
                        numberOfLines={1}
                        className="text-[#414141] text-base font-serrat-medium mr-2">
                        {t('attributes.onboardingScreen1Item2Course')}
                      </StyledText>

                      <StyledView className="flex-row items-center mt-1">
                        <StyledText
                          numberOfLines={1}
                          className="font-serrat text-sm text-[#6D6D6D]">
                          {t('attributes.onboardingScreen1Item2Partner')}
                        </StyledText>
                      </StyledView>
                    </StyledView>

                    <StyledView className="flex-row mt-1 w-full items-center justify-end">
                      <StyledView className="flex-row  bg-[#EFF3FA] items-center rounded-full py-1.5 px-3">
                        <StyledText className="text-[#0B1875] text-xs font-serrat">
                          {t('attributes.coursesPricefromEn')}
                        </StyledText>
                        <StyledText className="text-[#0B1875] text-xs font-serrat-semiBold">
                          80 AZN
                        </StyledText>
                        <StyledText className="text-[#0B1875] text-xs font-serrat">
                          {t('attributes.coursesPricefromAz')}
                        </StyledText>
                      </StyledView>
                    </StyledView>
                  </StyledView>
                </StyledView>
              </StyledView>
            </Animated.View>

            <Animated.View
              entering={FadeInRight.duration(400)
                .delay(300)
                .easing(Easing.ease)}
              style={{width: deviceWidth - 40}}>
              <StyledView className="w-auto h-[110px] my-[6px] mx-5 bg-white/50 border border-zinc-300 rounded-[8px] mt-[40px] mr-[10px]">
                <StyledView className="absolute z-50 right-3 top-3">
                  <BookmarkIcon />
                </StyledView>

                <StyledView className="w-full h-full p-[10px] flex-row rounded-lg">
                  <Image
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: 5,
                      resizeMode: 'cover',
                      marginRight: 16,
                    }}
                    source={OnboardScreen1Img3}
                  />

                  <Image
                    style={{
                      position: 'absolute',
                      right: -40,
                      top: -30,
                    }}
                    source={BlurRight}
                  />
                  <StyledView className="flex-1 justify-between py-1">
                    <StyledView>
                      <StyledText
                        numberOfLines={1}
                        className="text-[#414141] text-base font-serrat-medium mr-2">
                        {t('attributes.onboardingScreen1Item3Course')}
                      </StyledText>

                      <StyledView className="flex-row items-center mt-1">
                        <StyledText
                          numberOfLines={1}
                          className="font-serrat text-sm text-[#6D6D6D]">
                          {t('attributes.onboardingScreen1Item3Partner')}
                        </StyledText>
                      </StyledView>
                    </StyledView>

                    <StyledView className="flex-row mt-1 w-full items-center justify-end">
                      <StyledView className="flex-row  bg-[#EFF3FA] items-center rounded-full py-1.5 px-3">
                        <StyledText className="text-[#0B1875] text-xs font-serrat">
                          {t('attributes.coursesPricefromEn')}
                        </StyledText>
                        <StyledText className="text-[#0B1875] text-xs font-serrat-semiBold">
                          70 AZN
                        </StyledText>
                        <StyledText className="text-[#0B1875] text-xs font-serrat">
                          {t('attributes.coursesPricefromAz')}
                        </StyledText>
                      </StyledView>
                    </StyledView>
                  </StyledView>
                </StyledView>
              </StyledView>
            </Animated.View>

            <Animated.View entering={FadeIn.duration(500)}>
              <StyledText
                style={{width: deviceWidth - 40}}
                className="mt-[40px] text-center text-[32px] text-black font-serrat-semiBold z-50">
                {t('attributes.onboarding2')}
              </StyledText>
            </Animated.View>
          </>
        ) : currentIndex === 2 ? (
          <StyledView>
            <Animated.View
              className=""
              style={{
                width: deviceWidth - 40,
              }}
              entering={FadeInDown.duration(400).easing(Easing.ease)}>
              <StyledView className="h-[100px] shadow shadow-zinc-300 bg-white mt-[50px] rounded-lg ml-12">
                <StyledView className="flex-row w-full h-full py-[8px] px-[16px]">
                  <StyledView className="justify-between items-center">
                    <Image
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 100,
                        resizeMode: 'cover',
                      }}
                      source={OnboardScreen2Img1}
                    />

                    <StyledView className="flex-row items-center">
                      <StarSmallIcon />
                      <StyledText className="text-[#757575] font-serrat text-xs ml-1.5">
                        4.7
                      </StyledText>
                    </StyledView>
                  </StyledView>

                  <StyledView className="relative ml-[20px] flex-1 justify-between py-1">
                    <StyledView className="flex-row justify-between items-end">
                      <StyledView>
                        <StyledText
                          numberOfLines={1}
                          className="text-[#414141] font-serrat-semiBold text-base">
                          Gulnara Mammadli
                        </StyledText>
                        <StyledText
                          numberOfLines={1}
                          className="text-[#B7B7B7] font-serrat mr-2 text-sm mt-1">
                          {t('attributes.pianoInstructor')}
                        </StyledText>
                      </StyledView>

                      <StyledView className="absolute -right-1 top-0">
                        <BookmarkIcon />
                      </StyledView>
                    </StyledView>
                    <StyledView className="flex-row justify-between items-center mt-2">
                      <StyledText
                        numberOfLines={1}
                        className="text-sm font-serrat text-[#757575]">
                        {t('attributes.onboardingScreen1Item1Partner')}
                      </StyledText>
                    </StyledView>
                  </StyledView>
                </StyledView>
              </StyledView>
            </Animated.View>

            <Animated.View
              style={{width: deviceWidth - 40}}
              entering={FadeInDown.duration(400)
                .delay(100)
                .easing(Easing.ease)}>
              <StyledView className="h-[100px] bg-white shadow shadow-zinc-300 mt-[30px] rounded-lg mx-6">
                <StyledView className="flex-row w-full h-full py-[8px] px-[16px]">
                  <StyledView className="justify-between items-center">
                    <Image
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 100,
                        resizeMode: 'cover',
                      }}
                      source={OnboardScreen2Img2}
                    />

                    <StyledView className="flex-row items-center">
                      <StarSmallIcon />
                      <StyledText className="text-[#757575] font-serrat text-xs ml-1.5">
                        4.7
                      </StyledText>
                    </StyledView>
                  </StyledView>

                  <StyledView className="relative ml-[20px] flex-1 justify-between py-1">
                    <StyledView className="flex-row justify-between items-end">
                      <StyledView>
                        <StyledText
                          numberOfLines={1}
                          className="text-[#414141] font-serrat-semiBold text-base">
                          Nigar Huseynli
                        </StyledText>
                        <StyledText
                          numberOfLines={1}
                          className="text-[#B7B7B7] font-serrat mr-2 text-sm mt-1">
                          {t('attributes.balletInstructor')}
                        </StyledText>
                      </StyledView>

                      <StyledView className="absolute -right-1 top-0">
                        <BookmarkIcon />
                      </StyledView>
                    </StyledView>
                    <StyledView className="flex-row justify-between items-center mt-2">
                      <StyledText
                        numberOfLines={1}
                        className="text-sm font-serrat text-[#757575]">
                        Dance academy
                      </StyledText>
                    </StyledView>
                  </StyledView>
                </StyledView>
              </StyledView>
            </Animated.View>

            <Animated.View
              style={{width: deviceWidth - 40}}
              entering={FadeInDown.duration(400)
                .delay(300)
                .easing(Easing.ease)}>
              <StyledView className="h-[100px] bg-white shadow shadow-zinc-300 mt-[30px] rounded-lg ml-2 mr-12">
                <StyledView className="flex-row w-full h-full py-[8px] px-[16px]">
                  <StyledView className="justify-between items-center">
                    <Image
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 100,
                        resizeMode: 'cover',
                      }}
                      source={OnboardScreen2Img3}
                    />

                    <StyledView className="flex-row items-center">
                      <StarSmallIcon />
                      <StyledText className="text-[#757575] font-serrat text-xs ml-1.5">
                        4.7
                      </StyledText>
                    </StyledView>
                  </StyledView>

                  <StyledView className="relative ml-[20px] flex-1 justify-between py-1">
                    <StyledView className="flex-row justify-between items-end">
                      <StyledView>
                        <StyledText
                          numberOfLines={1}
                          className="text-[#414141] font-serrat-semiBold text-base">
                          Vusal Mammadov
                        </StyledText>
                        <StyledText
                          numberOfLines={1}
                          className="text-[#B7B7B7] font-serrat mr-2 text-sm mt-1">
                          {t('attributes.codingInstructor')}
                        </StyledText>
                      </StyledView>

                      <StyledView className="absolute -right-1 top-0">
                        <BookmarkIcon />
                      </StyledView>
                    </StyledView>
                    <StyledView className="flex-row justify-between items-center mt-2">
                      <StyledText
                        numberOfLines={1}
                        className="text-sm font-serrat text-[#757575]">
                        {t('attributes.programmingCourse')}
                      </StyledText>
                    </StyledView>
                  </StyledView>
                </StyledView>
              </StyledView>
            </Animated.View>

            <Animated.View entering={FadeIn.duration(500)}>
              <StyledText
                style={{width: deviceWidth - 40}}
                className="mt-[40px] text-center text-[32px] text-black font-serrat-semiBold z-50">
                {t('attributes.onboarding3')}
              </StyledText>
            </Animated.View>
          </StyledView>
        ) : currentIndex === 3 ? (
          <>
            <Animated.View
              entering={FadeInRight.duration(400).easing(Easing.ease)}
              style={{width: deviceWidth - 40}}>
              <StyledView
                style={{width: deviceWidth - 70}}
                className={`w-full flex-row shadow shadow-zinc-300 rounded-[8px] p-[8px] px-[24px] h-[90px] items-center justify-between bg-[#FFEEF3] mt-[50px]`}>
                <StyledView className="items-center w-2/12">
                  <StyledText className="text-sm text-[#414141]">
                    15:00
                  </StyledText>
                  <Line />
                  <StyledText className="text-sm text-[#414141]">
                    16:00
                  </StyledText>
                </StyledView>

                <StyledView className="w-8/12">
                  <StyledText className="text-base text-[#414141] font-medium">
                    {t('attributes.pianoLesson')}
                  </StyledText>
                  <StyledView className="flex-row w-full flex-wrap mt-[5px] items-center">
                    <Location />
                    <StyledText className="text-sm text-[#757575] ml-2">
                      {t('attributes.school47')}
                    </StyledText>
                  </StyledView>
                </StyledView>
              </StyledView>
            </Animated.View>

            <Animated.View
              entering={FadeInLeft.duration(400).delay(100).easing(Easing.ease)}
              style={{width: deviceWidth - 40, alignItems: 'flex-end'}}>
              <StyledView
                style={{width: deviceWidth - 70}}
                className={`w-full flex-row shadow shadow-zinc-300 rounded-[8px] p-[8px] px-[24px] h-[90px] items-center justify-between bg-[#E5F3FF] mt-[30px]`}>
                <StyledView className="items-center w-2/12">
                  <StyledText className="text-sm text-[#414141]">
                    13:30
                  </StyledText>
                  <Line />
                  <StyledText className="text-sm text-[#414141]">
                    14:30
                  </StyledText>
                </StyledView>

                <StyledView className="w-8/12">
                  <StyledText className="text-base text-[#414141] font-medium">
                    {t('attributes.chessLesson')}
                  </StyledText>
                  <StyledView className="flex-row w-full flex-wrap mt-[5px] items-center">
                    <Location />
                    <StyledText className="text-sm text-[#757575] ml-2">
                      {t('attributes.school240')}
                    </StyledText>
                  </StyledView>
                </StyledView>
              </StyledView>
            </Animated.View>

            <Animated.View
              entering={FadeInRight.duration(400)
                .delay(300)
                .easing(Easing.ease)}
              style={{width: deviceWidth - 40}}>
              <StyledView
                style={{width: deviceWidth - 70}}
                className={`w-full shadow shadow-zinc-300 flex-row rounded-[8px] p-[8px] px-[24px] h-[90px] items-center justify-between bg-[#EDECFF] mt-[30px]`}>
                <StyledView className="items-center w-2/12">
                  <StyledText className="text-sm text-[#414141]">
                    11:30
                  </StyledText>
                  <Line />
                  <StyledText className="text-sm text-[#414141]">
                    13:00
                  </StyledText>
                </StyledView>

                <StyledView className="w-8/12">
                  <StyledText className="text-base text-[#414141] font-medium">
                    {t('attributes.roboticsLesson')}
                  </StyledText>
                  <StyledView className="flex-row w-full flex-wrap mt-[5px] items-center">
                    <Location />
                    <StyledText className="text-sm text-[#757575] ml-2">
                      {t('attributes.school47')}
                    </StyledText>
                  </StyledView>
                </StyledView>
              </StyledView>
            </Animated.View>

            <Animated.View
              entering={FadeInLeft.duration(400).delay(500).easing(Easing.ease)}
              style={{width: deviceWidth - 40, alignItems: 'flex-end'}}>
              <StyledView
                style={{width: deviceWidth - 70}}
                className={`w-full shadow shadow-zinc-300 flex-row rounded-[8px] p-[8px] px-[24px] h-[90px] items-center justify-between bg-[#FAE9D6] mt-[30px]`}>
                <StyledView className="items-center w-2/12">
                  <StyledText className="text-sm text-[#414141]">
                    09:00
                  </StyledText>
                  <Line />
                  <StyledText className="text-sm text-[#414141]">
                    11:00
                  </StyledText>
                </StyledView>

                <StyledView className="w-8/12">
                  <StyledText className="text-base text-[#414141] font-medium">
                    {t('attributes.artLesson')}
                  </StyledText>
                  <StyledView className="flex-row w-full flex-wrap mt-[5px] items-center">
                    <Location />
                    <StyledText className="text-sm text-[#757575] ml-2">
                      {t('attributes.school244')}
                    </StyledText>
                  </StyledView>
                </StyledView>
              </StyledView>
            </Animated.View>

            <Animated.View entering={FadeIn.duration(500)}>
              <StyledText
                style={{width: deviceWidth - 40}}
                className="mt-[40px] text-center text-[32px] text-black font-serrat-semiBold z-50">
                {t('attributes.onboarding4')}
              </StyledText>
            </Animated.View>
          </>
        ) : null}

        {currentIndex > -1 ? (
          <StyledView className="flex-row mt-[20px] w-full justify-center items-center">
            {data?.map((item, index) => (
              <TouchableOpacity
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                onPress={() => {
                  setCurrentIndex(index);
                }}>
                <StyledView
                  className={`w-[15px] h-[15px] rounded-full mx-2 ${
                    index === currentIndex ? 'bg-[#0079E9]' : 'bg-[#D4E9FD]'
                  }`}></StyledView>
              </TouchableOpacity>
            ))}
          </StyledView>
        ) : null}

        <StyledTouchableOpacity
          onPress={() => {
            if (currentIndex < data.length - 1) {
              setCurrentIndex(prevIndex => prevIndex + 1);
            }
            if (currentIndex > 2) {
              setGlobalLoginState();
              setTrigger(prevState => !prevState);
            }
          }}
          style={{width: deviceWidth - 40}}
          className="bg-[#0079E9] p-[16px] absolute bottom-12 rounded-[8px]">
          <StyledText className="text-[18px] text-white font-serrat-medium text-center">
            {currentIndex > 2
              ? t('attributes.getStarted')
              : t('attributes.next')}
          </StyledText>
        </StyledTouchableOpacity>
      </ScrollView>
    </ImageBackground>
  ) : null;

  // return (
  //
  // );
};

export default Onboarding;
