import {FlatList, TouchableOpacity, ActivityIndicator} from 'react-native';
import {useState, useContext, useEffect} from 'react';
import AuthContext from '../../common/TokenManager';
import FastImage from 'react-native-fast-image';
import {useNavigation, useRoute} from '@react-navigation/native';
import '../../locales/index';
import {useTranslation} from 'react-i18next';
import NoItems from '../../assets/icons/noItems.svg';
import {StyledView, StyledText} from '../../common/components/StyledComponents';
import BookmarkFillIcon from '../../assets/icons/bookmarkFill.svg';
import StarIcon from '../../assets/icons/starFillYellow.svg';
import DistanceIcon from '../../assets/icons/locationBlue.svg';
import {API_URL} from '@env';

const Courses = () => {
  const {getStudentAccessTokenFromMemory, getSupervisorAccessTokenFromMemory} =
    useContext(AuthContext);
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const {t} = useTranslation();
  const route = useRoute();
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const [trigger, setTrigger] = useState(false);

  async function unsetFavorite(id) {
    const url = `${API_URL}users/me/favorites/courses/${id}/`;
    const studentToken = await getStudentAccessTokenFromMemory();
    const supervisorToken = await getSupervisorAccessTokenFromMemory();
    const token = supervisorToken ? supervisorToken : studentToken;

    if (token) {
      try {
        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setTrigger(prevValue => !prevValue);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }

  const renderItem = ({item}) => {
    return (
      <StyledView className="mx-5 w-auto h-[130px] my-[6px] bg-white shadow shadow-zinc-300 rounded-lg">
        <StyledView className="absolute z-50 right-3 top-3">
          <TouchableOpacity
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            onPress={() => {
              unsetFavorite(item?.id);
            }}>
            {<BookmarkFillIcon />}
          </TouchableOpacity>
        </StyledView>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('CourseDetailsFavoritesProxy', {
              url: item?.url,
              routeName: route.name,
            });
          }}>
          <StyledView className="w-full h-full p-[10px] flex-row rounded-lg">
            <StyledView className="mr-4">
              <FastImage
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: 5,
                }}
                source={{
                  uri: item?.thumbnail,
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            </StyledView>
            <StyledView className="flex-1 justify-between py-1">
              <StyledView>
                <StyledText
                  numberOfLines={1}
                  className="text-zinc-500 text-base font-serrat-medium mr-2">
                  {item?.title}
                </StyledText>

                <StyledView className="flex-row items-center mt-1">
                  {item?.rating ? (
                    <StyledView className="flex-row items-center mr-1.5">
                      <StarIcon />
                      <StyledText className="text-xs text-black font-serrat-medium ml-1.5">
                        {item?.rating}
                      </StyledText>
                    </StyledView>
                  ) : null}

                  <StyledText
                    numberOfLines={1}
                    className="font-serrat text-sm text-[#6D6D6D]">
                    {item?.partner_network?.name}
                  </StyledText>
                </StyledView>
              </StyledView>

              <StyledView className="flex-row mt-4 w-full items-center justify-between">
                {item?.school ? (
                  <StyledView className="flex-row items-center">
                    <DistanceIcon />
                    <StyledText
                      numberOfLines={1}
                      className="font-serrat text-xs w-6/12 text-[#757575] ml-1">
                      {item?.school?.name}
                    </StyledText>
                  </StyledView>
                ) : null}

                {/* {item.starting_price ? (
          <StyledView className="flex-row  bg-[#EFF3FA] items-center rounded-full py-2 px-3">
            <StyledText className="text-[#0B1875] text-xs font-serrat">
              {t('attributes.coursesPricefromEn')}
            </StyledText>
            <StyledText className="text-[#0B1875] text-xs font-serrat-semiBold">
              ₼{item.starting_price.split('.')[0]}
            </StyledText>
            <StyledText className="text-[#0B1875] text-xs font-serrat">
              {t('attributes.coursesPricefromAz')}
            </StyledText>
          </StyledView>
        ) : null} */}
              </StyledView>
            </StyledView>
          </StyledView>
        </TouchableOpacity>
      </StyledView>
    );
  };

  const fetchData = async () => {
    setInitialDataFetched(false);
    const studentToken = await getStudentAccessTokenFromMemory();
    const supervisorToken = await getSupervisorAccessTokenFromMemory();
    const token = studentToken ? studentToken : supervisorToken;
    const headers = {
      Accept: 'application/json; version=v2',
      Authorization: `Bearer ${token}`,
    };
    if (token) {
      try {
        const response = await fetch(
          `${API_URL}courses/?is_favorite=true&ordering=-marked_as_favorite_at&page_size=100`,
          {
            headers,
          },
        );

        if (response.ok) {
          const jsonData = await response.json();
          setData(jsonData.results)
          setInitialDataFetched(true);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [trigger]);

  return data.length ? (
    <FlatList
      style={{backgroundColor: '#f6f6f6'}}
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  ) : initialDataFetched && !data.length ? (
    <StyledView className="flex-1 items-center justify-center">
      <NoItems />
      <StyledText className="font-serrat mt-5 text-lg text-black">
        {t('attributes.noFavoritedCourses')}
      </StyledText>
    </StyledView>
  ) : (
    <StyledView className="flex-1 items-center justify-center">
      <ActivityIndicator size={'large'} color="#0079E9" />
    </StyledView>
  );
};

export default Courses;
