import {FlatList, TouchableOpacity, ActivityIndicator} from 'react-native';
import {useState, useContext, useEffect} from 'react';
import AuthContext from '../../common/TokenManager';
import BookmarkFillIcon from '../../assets/icons/bookmarkFill.svg';
import FastImage from 'react-native-fast-image';
import StarIcon from '../../assets/icons/starFillYellow.svg';
import {useNavigation, useRoute} from '@react-navigation/native';
import '../../locales/index';
import {useTranslation} from 'react-i18next';
import NoItems from '../../assets/icons/noItems.svg';
import {StyledView, StyledText} from '../../common/components/StyledComponents';
import {API_URL} from '@env';

const Instructors = () => {
  const {getStudentAccessTokenFromMemory, getSupervisorAccessTokenFromMemory} =
    useContext(AuthContext);
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const {t} = useTranslation();
  const route = useRoute();
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const [trigger, setTrigger] = useState(false);

  async function unsetFavorite(id) {
    const url = `${API_URL}users/me/favorites/instructors/${id}/`;
    const studentToken = await getStudentAccessTokenFromMemory();
    const supervisorToken = await getSupervisorAccessTokenFromMemory();
    const token = studentToken ? studentToken : supervisorToken;

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

  const renderItem = ({item}) => {
    return (
      <StyledView className="max-h-[110px] bg-white shadow shadow-zinc-300 my-[6px] rounded-lg mx-5">
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('InstructorDetailsFavoritesProxy', {
              url: item?.url,
              routeName: route.name,
            });
          }}>
          <StyledView className="flex-row w-full h-full py-[8px] px-[16px]">
            <StyledView className="justify-between items-center">
              <FastImage
                style={{width: 60, height: 60, borderRadius: 100}}
                source={{
                  uri: item?.user?.profile_picture,
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />

              {item?.rating ? (
                <StyledView className="flex-row items-center">
                  <StarIcon />
                  <StyledText className="text-[#757575] font-serrat text-xs ml-1.5">
                    {item?.rating}
                  </StyledText>
                </StyledView>
              ) : null}
            </StyledView>

            <StyledView className="relative ml-[20px] flex-1 justify-between py-1">
              <StyledView className="flex-row justify-between items-end">
                <StyledView>
                  <StyledText
                    numberOfLines={1}
                    className="text-[#414141] font-serrat-semiBold text-base">
                    {item?.user?.first_name} {item?.user?.last_name}
                  </StyledText>
                  <StyledText
                    numberOfLines={1}
                    className="text-[#B7B7B7] font-serrat mr-2 text-sm mt-1">
                    {item?.profession}
                  </StyledText>
                </StyledView>

                <StyledView className="absolute -right-1 top-0">
                  <TouchableOpacity
                    hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                    onPress={() => {
                      unsetFavorite(item?.id);
                    }}>
                    {<BookmarkFillIcon />}
                  </TouchableOpacity>
                </StyledView>
              </StyledView>
              <StyledView className="flex-row justify-between items-center mt-2">
                <StyledText
                  numberOfLines={1}
                  className="text-sm font-serrat text-[#757575]">
                  {item?.partner_network?.name}
                </StyledText>
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
          `${API_URL}instructors/?is_favorite=true&ordering=-marked_as_favorite_at&page_size=100`,
          {
            headers,
          },
        );

        if (response.ok) {
          const jsonData = await response.json();
          setData(jsonData.results);
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
        {t('attributes.noFavoritedInstructors')}
      </StyledText>
    </StyledView>
  ) : (
    <StyledView className="flex-1 items-center justify-center">
      <ActivityIndicator size={'large'} color="#0079E9" />
    </StyledView>
  );
};

export default Instructors;
