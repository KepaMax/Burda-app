import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  SectionList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {styled} from 'nativewind';
import {useRef, useState, useEffect, useContext} from 'react';
import AuthContext from '../common/TokenManager';
import {useNavigation, useRoute, useIsFocused} from '@react-navigation/native';
import StarIcon from '../assets/icons/starFillYellow.svg';
import FastImage from 'react-native-fast-image';
import DistanceIcon from '../assets/icons/locationBlue.svg';
import NoItems from '../assets/icons/noItems.svg';
import DelayInput from 'react-native-debounce-input';
import '../locales/index';
import {useTranslation} from 'react-i18next';
import uuid from 'react-native-uuid';
import SearchIcon from '../assets/icons/searchBar.svg';
import BookmarkIcon from '../assets/icons/bookmark.svg';
import BookmarkFillIcon from '../assets/icons/bookmarkFill.svg';
import {API_URL} from '@env';

const StyledView = styled(View);
const StyledText = styled(Text);

const SearchBar = () => {
  const {
    getStudentAccessTokenFromMemory,
    getSupervisorAccessTokenFromMemory,
    getGuestMode,
  } = useContext(AuthContext);
  const route = useRoute();
  const [searchTerm, setSearchTerm] = useState('');
  const [instructors, setInstructors] = useState(null);
  const [courses, setCourses] = useState(null);
  const [partners, setPartners] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const inputRef = useRef(null);
  const {t} = useTranslation();
  const isFocused = useIsFocused();
  const [trigger, setTrigger] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [guestMode, setGuestMode] = useState(null);
  const [settingFavorite, setSettingFavorite] = useState(false);

  const onRefresh = () => {
    setTrigger(!trigger);
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  async function setFavorite(type, id) {
    const partnerUrl = `${API_URL}users/me/favorites/partner-networks/`;
    const instructorUrl = `${API_URL}users/me/favorites/instructors/`;
    const courseUrl = `${API_URL}users/me/favorites/courses/`;

    const activeUrl =
      type === 'courses'
        ? courseUrl
        : type === 'instructors'
        ? instructorUrl
        : type === 'partner-networks'
        ? partnerUrl
        : null;

    try {
      const studentToken = await getStudentAccessTokenFromMemory();
      const supervisorToken = await getSupervisorAccessTokenFromMemory();
      const response = await fetch(activeUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${
            studentToken ? studentToken : supervisorToken
          }`,
        },
        body: JSON.stringify({
          object_id: id,
        }),
      });

      setTrigger(!trigger);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function unsetFavorite(type, id) {
    const partnerUrl = `${API_URL}users/me/favorites/partner-networks/${id}/`;
    const instructorUrl = `${API_URL}users/me/favorites/instructors/${id}/`;
    const courseUrl = `${API_URL}users/me/favorites/courses/${id}/`;

    const activeUrl =
      type === 'courses'
        ? courseUrl
        : type === 'instructors'
        ? instructorUrl
        : type === 'partner-networks'
        ? partnerUrl
        : null;

    try {
      const studentToken = await getStudentAccessTokenFromMemory();
      const supervisorToken = await getSupervisorAccessTokenFromMemory();
      const response = await fetch(activeUrl, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${
            studentToken ? studentToken : supervisorToken
          }`,
        },
      });
      setTrigger(!trigger);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleSearch = text => {
    setSettingFavorite(false);
    text !== searchTerm ? setSearchResults([]) : null;
    setSearchTerm(text);
  };

  const renderItem = ({item}) => {
    const categories = [];
    item?.type === 'partner-networks'
      ? item?.categories?.map(category => {
          categories.push(category.name);
        })
      : null;

    return item?.type === 'courses' ? (
      <StyledView className="w-auto h-[130px] my-[6px] bg-white shadow shadow-zinc-300 rounded-lg">
        {guestMode ? null : (
          <StyledView className="absolute z-50 right-3 top-3">
            <TouchableOpacity
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
              onPress={() => {
                setSettingFavorite(true);
                item?.is_favorite
                  ? unsetFavorite(item?.type, item?.id)
                  : setFavorite(item?.type, item?.id);
              }}>
              {item?.is_favorite ? <BookmarkFillIcon /> : <BookmarkIcon />}
            </TouchableOpacity>
          </StyledView>
        )}

        <TouchableOpacity
          onPress={() => {
            requestAnimationFrame(() => {
              navigation.navigate('CourseDetailsSearchProxy', {
                url: item?.url,
                routeName: route.name,
              });
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
                  uri: item.thumbnail,
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
                  {item.title}
                </StyledText>

                <StyledView className="flex-row items-center mt-1">
                  {item.rating ? (
                    <StyledView className="flex-row items-center mr-1.5">
                      <StarIcon />
                      <StyledText className="text-xs text-black font-serrat-medium ml-1.5">
                        {item.rating}
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
                {item.school ? (
                  <StyledView className="flex-row items-center">
                    <DistanceIcon />
                    <StyledText
                      numberOfLines={1}
                      className="font-serrat text-xs w-6/12 text-[#757575] ml-1">
                      {item.school.name}
                    </StyledText>
                  </StyledView>
                ) : null}

                {item.starting_price ? (
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
                ) : null}
              </StyledView>
            </StyledView>
          </StyledView>
        </TouchableOpacity>
      </StyledView>
    ) : item?.type === 'instructors' ? (
      <StyledView className="max-h-[110px] bg-white shadow shadow-zinc-300 my-[6px] rounded-lg">
        <TouchableOpacity
          onPress={() => {
            requestAnimationFrame(() => {
              navigation.navigate('InstructorDetailsSearchProxy', {
                url: item?.url,
                routeName: route.name,
              });
            });
          }}>
          <StyledView className="flex-row w-full h-full py-[8px] px-[16px]">
            <StyledView className="justify-between items-center">
              <FastImage
                style={{width: 60, height: 60, borderRadius: 100}}
                source={{
                  uri: item.user.profile_picture,
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />

              {item.rating ? (
                <StyledView className="flex-row items-center">
                  <StarSmallIcon />
                  <StyledText className="text-[#757575] font-serrat text-xs ml-1.5">
                    {item.rating}
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
                    {item.user.first_name} {item.user.last_name}
                  </StyledText>
                  <StyledText
                    numberOfLines={1}
                    className="text-[#B7B7B7] font-serrat mr-2 text-sm mt-1">
                    {item.profession}
                  </StyledText>
                </StyledView>

                {guestMode ? null : (
                  <StyledView className="absolute -right-1 top-0">
                    <TouchableOpacity
                      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                      onPress={() => {
                        setSettingFavorite(true);
                        item?.is_favorite
                          ? unsetFavorite(item?.type, item?.id)
                          : setFavorite(item?.type, item?.id);
                      }}>
                      {item?.is_favorite ? (
                        <BookmarkFillIcon />
                      ) : (
                        <BookmarkIcon />
                      )}
                    </TouchableOpacity>
                  </StyledView>
                )}
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
    ) : item?.type === 'partner-networks' ? (
      <StyledView className="h-[120px] bg-white my-[6px] rounded-lg shadow shadow-zinc-300">
        <TouchableOpacity
          onPress={() => {
            requestAnimationFrame(() => {
              navigation.navigate('PartnerNetworkSearchProxy', {
                url: item?.url,
                routeName: route.name,
              });
            });
          }}>
          <StyledView className="p-[10px] relative">
            <StyledView className="flex-row">
              <FastImage
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 5,
                }}
                source={{
                  uri: item.logo,
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
              <StyledView className="ml-2 pl-2 border-l border-zinc-200 py-1 justify-between flex-1">
                <StyledView>
                  <StyledText className="font-serrat-medium text-base text-zinc-500">
                    {item.name}
                  </StyledText>
                  <StyledText
                    numberOfLines={1}
                    className="font-serrat-medium mt-1 text-sm text-[#B7B7B7]">
                    {categories.join(' · ')}
                  </StyledText>
                </StyledView>
                <StyledView className="items-center flex-row justify-between">
                  {item.rating ? (
                    <StyledView className="flex-row items-center">
                      <StarIcon />
                      <StyledText className="font-serrat text-xs text-[#757575] ml-1.5">
                        {item.rating}
                      </StyledText>
                    </StyledView>
                  ) : null}

                  {item.languages ? (
                    <StyledView className="flex-row items-center">
                      <Language />
                      <StyledText className="w-fit flex-row items-center text-xs text-[#757575] ml-1.5">
                        {item.languages.join(' | ')}
                      </StyledText>
                    </StyledView>
                  ) : null}
                </StyledView>
              </StyledView>
            </StyledView>
            {guestMode ? null : (
              <StyledView className="absolute top-3 right-3">
                <TouchableOpacity
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                  onPress={() => {
                    setSettingFavorite(true);
                    item?.is_favorite
                      ? unsetFavorite(item?.type, item?.id)
                      : setFavorite(item?.type, item?.id);
                  }}>
                  {item?.is_favorite ? <BookmarkFillIcon /> : <BookmarkIcon />}
                </TouchableOpacity>
              </StyledView>
            )}
          </StyledView>
        </TouchableOpacity>
      </StyledView>
    ) : null;
  };

  useEffect(() => {
    if (isFocused) {
      requestAnimationFrame(() => {
        inputRef?.current?.focus();
      });
    }
  }, [isFocused]);

  useEffect(() => {
    const fetchData = async (endpoint, type, title, setter) => {
      try {
        if (searchTerm) {
          setLoading(true);
          const studentToken = await getStudentAccessTokenFromMemory();
          const supervisorToken = await getSupervisorAccessTokenFromMemory();
          const guestMode = await getGuestMode();
          setGuestMode(guestMode);
          const headers = {
            Authorization: `Bearer ${
              studentToken ? studentToken : supervisorToken
            }`,
          };

          const response = guestMode
            ? await fetch(
                `${endpoint}${searchTerm.trim()}&page_size=100&ordering=-rating`,
              )
            : await fetch(
                `${endpoint}${searchTerm.trim()}&page_size=100&ordering=-rating`,
                {headers},
              );

          if (response.status === 200) {
            setLoading(false);
          }

          const data = await response.json();
          const results = data.results;
          results.map(item => {
            item.type = type;
            item.uniqID = uuid.v4();
          });
          if (results.length) {
            setter({title, data: results});
          }
        }
      } catch (error) {
        setLoading(false);
        console.error('Error fetching data:', error);
      }
    };

    isFocused
      ? fetchData(
          `${API_URL}partner-networks/?search=`,
          'partner-networks',
          t('attributes.mainPartners'),
          setPartners,
        )
      : null;
    isFocused
      ? fetchData(
          `${API_URL}courses/?search=`,
          'courses',
          t('attributes.mainCourses'),
          setCourses,
        )
      : null;
    isFocused
      ? fetchData(
          `${API_URL}instructors/?search=`,
          'instructors',
          t('attributes.mainInstructors'),
          setInstructors,
        )
      : null;
  }, [searchTerm, trigger, isFocused]);

  useEffect(() => {
    const allSearchItems = [partners, courses, instructors];
    const filteredArray = allSearchItems.filter(item => item !== null);
    setSearchResults(filteredArray);
  }, [instructors, partners, courses]);

  return (
    <StyledView className="h-full w-full bg-white">
      <StyledView className="w-full flex-row items-center justify-between bg-[#f6f6f6] px-4 py-5">
        <StyledView
          className={`bg-white shadow ${
            Platform.OS === 'ios' ? 'shadow-zinc-300' : 'shadow-zinc-400'
          } rounded-2xl relative w-[82%]`}>
          <StyledView className="absolute left-2 top-3 pointer-events-none">
            <SearchIcon />
          </StyledView>
          <DelayInput
            value={searchTerm}
            minLength={3}
            placeholder={t('attributes.searchPlaceholder')}
            placeholderTextColor="#494949"
            inputRef={inputRef}
            onChangeText={handleSearch}
            delayTimeout={500}
            className="h-10 pl-8 text-black font-serrat"
          />
        </StyledView>
        <TouchableOpacity
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          onPress={() => {
            navigation.navigate('Home Page', {
              screen: 'Home Page',
            });
          }}>
          <StyledText className="text-[#0079E9] text-sm font-serrat-medium">
            {t('attributes.searchCancel')}
          </StyledText>
        </TouchableOpacity>
      </StyledView>

      <StyledView className="flex-1 bg-[#f6f6f6]">
        {loading && !settingFavorite ? (
          <ActivityIndicator size="large" color="#0079E9" />
        ) : searchResults.length ? (
          <SectionList
            renderSectionHeader={({section: {title}}) => (
              <StyledText className="pt-2 text-zinc-800 text-lg font-serrat-medium">
                {title}
              </StyledText>
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            sections={searchResults}
            stickySectionHeadersEnabled={false}
            renderItem={renderItem}
            keyExtractor={item => item.uniqID}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingVertical: 15,
              paddingHorizontal: 20,
              gap: 10,
            }}
          />
        ) : searchTerm ? (
          <StyledView className="flex-1 items-center justify-center">
            <StyledView className="items-center gap-4">
              <NoItems />
              <StyledText className="font-serrat text-lg text-zinc-600">
                {t('attributes.searchNoresultsTitle')}
              </StyledText>
            </StyledView>
          </StyledView>
        ) : null}
      </StyledView>
    </StyledView>
  );
};

export default SearchBar;
