import FastImage from 'react-native-fast-image';
import {
  StyledText,
  StyledTouchableOpacity,
  StyledView,
} from '@common/StyledComponents';
import ArrowUpIcon from '@icons/arrow-up-faq.svg';
import ArrowDownIcon from '@icons/arrow-down-faq.svg';
import AcceptIcon from '@icons/accept-home.svg';
import CancelIcon from '@icons/cancel-home.svg';
import PhoneIcon from '@icons/phone-home.svg';
import {API_URL} from '@env';
import {useState} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {Linking} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import storage from '@utils/MMKVStore';
import {fetchData} from '@utils/fetchData';

const StudentsAccordion = ({items}) => {
  const [activeIndex, setActiveIndex] = useState();
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handlePress = index => {
    index === activeIndex ? setActiveIndex(null) : setActiveIndex(index);
  };

  const handleOnWay = async id => {
    const response = await fetchData({
      url: `${API_URL}/rides/${id}/onway/`,
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': storage.getString('selectedLanguage'),
        Authorization: `Bearer ${storage.getString('accessToken')}`,
      },
      method: 'POST',
      setLoading,
    });

    response.success
      ? alert(t('attributes.success'))
      : response.success && alert(t('attributes.errorOccurred'));
  };

  const handleCancel = async id => {
    const response = await fetchData({
      url: `${API_URL}/rides/${id}/cancel/`,
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': storage.getString('selectedLanguage'),
        Authorization: `Bearer ${storage.getString('accessToken')}`,
      },
      method: 'POST',
      setLoading,
    });

    response.success
      ? alert(t('attributes.success'))
      : response.success && alert(t('attributes.errorOccurred'));
  };

  const renderItem = ({item, index}) => {
    return (
      <StyledTouchableOpacity
        onPress={() => handlePress(index)}
        className="p-4  rounded-[18px] border-[1px] border-[#EDEFF3]">
        <StyledView className="flex-row justify-between items-center ">
          <StyledView className="flex-row gap-4">
            <FastImage
              style={{width: 50, height: 50, borderRadius: 100}}
              source={{
                uri: item.child.photo
                  ? item.child.photo
                  : 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg',
              }}
            />
            <StyledView className="">
              <StyledText className="font-poppi-medium text-base text-[#204F50]">
                {item.child.name} {item.child.surname}
              </StyledText>
              <StyledTouchableOpacity
                onPress={() =>
                  navigation.navigate('ChildProfile', {
                    data: item.child,
                    address: item.location.home_address,
                  })
                }>
                <StyledText className="text-sm text-[#7658F2] font-poppi-semibold">
                  {t('attributes.goToProfile')}
                </StyledText>
              </StyledTouchableOpacity>
            </StyledView>
          </StyledView>
          {index === activeIndex ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </StyledView>

        {index === activeIndex && (
          <StyledView className=" mt-4">
            <StyledView className="flex-row justify-center border-t-[1px] border-[#EFEFEF]">
              <StyledTouchableOpacity
                onPress={() => handleOnWay(item.id)}
                className={`${'mx-8'} mt-4`}>
                <AcceptIcon />
              </StyledTouchableOpacity>
              <StyledTouchableOpacity
                onPress={() => handleCancel(item.id)}
                className={`${'mx-8'} mt-4`}>
                <CancelIcon />
              </StyledTouchableOpacity>
              {/* {isNanny && (
                <StyledTouchableOpacity className="mx-4 mt-4">
                  <MessageIcon />
                </StyledTouchableOpacity>
              )} */}
              <StyledTouchableOpacity
                onPress={() => {
                  Linking.openURL(`tel:${item.child.mobile}`);
                }}
                className={`${'mx-8'} mt-4`}>
                <PhoneIcon />
              </StyledTouchableOpacity>
            </StyledView>
          </StyledView>
        )}
      </StyledTouchableOpacity>
    );
  };

  return (
    <>
      <StyledText className="text-lg my-4 text-[#204F50] font-poppi-semibold">
        {t('attributes.studentList')}
      </StyledText>
      <FlatList
        scrollEnabled={false}
        contentContainerStyle={{gap: 12, paddingBottom: 60}}
        data={items}
        renderItem={renderItem}
      />
    </>
  );
};

export default StudentsAccordion;
