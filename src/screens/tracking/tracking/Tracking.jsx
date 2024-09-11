import {useTranslation} from 'react-i18next';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  StyleSheet,
  Vibration,
} from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import {API_KEY, API_URL} from '@env';
import HomeIcon from '@icons/home-tracking.svg';
import DotsIcon from '@icons/dots-ride.svg';
import CompletedIcon from '@icons/complete-pin-ride.svg';
import IncompletedIcon from '@icons/incomplete-pin-ride.svg';
import ArrowLeftIcon from '@icons/arrow-left.svg';
import ArrowRigthIcon from '@icons/arrow-right.svg';
import SchoolIcon from '@icons/school-tracking.svg';
import {StyledText, StyledView} from '@common/StyledComponents';
import storage from '@utils/MMKVStore';
import {fetchData} from '@utils/fetchData';
import {StyledTouchableOpacity} from '@common/StyledComponents';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

const mapStyle = [
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#aadaff',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffffff',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#000000',
      },
    ],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [
      {
        color: '#f0f0f0',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e0e0e0',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#c0e0b0',
      },
    ],
  },
];

const Tracking = () => {
  const {t} = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const userType = storage.getString('userType');
  const [activeIndex, setActiveIndex] = useState(0);
  const [ridesArray, setRidesArray] = useState(null);
  const [waypoints, setWaypoints] = useState(null);

  const handleWaze = (lat, long) => {
    const url = `https://waze.com/ul?ll=${lat},${long}`;
    Linking.openURL(url);
  };

  // Take a look

  const handleEndRide = async () => {
    fetchData({
      url: `${API_URL}/rides/${id}/cancel/`,
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': storage.getString('selectedLanguage'),
        Authorization: `Bearer ${storage.getString('accessToken')}`,
      },
      method: 'POST',
      setLoading,
    });

    for (let index = 0; index < data.paths.length; index++) {
      const element = data.paths[index];
      const url = `${API_URL}/rides/${element.ride_path}/complete/`;
      fetchData();
    }
  };

  const handleActiveStudenChange = increment => {
    Vibration.vibrate(10);
    increment
      ? activeIndex < ridesArray.length - 1
        ? setActiveIndex(activeIndex + 1)
        : setActiveIndex(0)
      : activeIndex > 0
      ? setActiveIndex(activeIndex - 1)
      : setActiveIndex(ridesArray.length - 1);
  };

  useEffect(() => {
    const getRideData = async () => {
      const result = await fetchData({
        url: `${API_URL}/rides/paths/`,
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': storage.getString('selectedLanguage'),
          Authorization: `Bearer ${storage.getString('accessToken')}`,
        },
        setLoading: setLoading,
      });

      if (result?.success) {
        const realData = result.data.find(item => item.paths.length > 0);
        setData(realData);

        if (realData) {
          const transformedPaths = realData.paths.map(item => ({
            name: item.child.name,
            surname: item.child.surname,
            lat: item.lat,
            long: item.long,
            address: item.home_address,
          }));

          setRidesArray(
            realData.transfer === 'pickup'
              ? [
                  ...transformedPaths,
                  {
                    name: realData.school.name,
                    address: realData.school.name,
                    surname: '',
                    lat: realData.school.lat,
                    long: realData.school.long,
                  },
                ]
              : [
                  {
                    name: realData.school.name,
                    address: realData.school.name,
                    surname: '',
                    lat: realData.school.lat,
                    long: realData.school.long,
                  },
                  ...transformedPaths,
                ],
          );

          const transformedData = realData.paths.map(item => ({
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.long),
          }));

          setWaypoints(transformedData);
        }
      }
    };

    getRideData();
  }, []);

  const renderItem = ({item}) => {
    return (
      <StyledView className="w-full p-4">
        <StyledView className="flex-row items-center gap-2">
          <StyledView className="w-[2%] justify-center items-center">
            {item.status === 'completed' ? (
              <CompletedIcon />
            ) : (
              <IncompletedIcon />
            )}
          </StyledView>
          <StyledText className="text-[#000000B2] text-xs font-poppi">
            {item.child.name} {item.child.surname}
          </StyledText>
        </StyledView>
        <StyledView className="flex-row items-center gap-2">
          <StyledView className="w-[2%] items-center">
            <DotsIcon />
          </StyledView>
          <StyledText className="text-black text-base font-poppi-semibold border-b-[1px] w-[95%] border-[#D0D0D0] pb-1">
            {item.child.name}
          </StyledText>
        </StyledView>
      </StyledView>
    );
  };

  return !loading ? (
    data && ridesArray && waypoints ? (
      <>
        <StyledView className="flex-1 relative -z-10">
          {userType === 'drivers' ? (
            <StyledView className="absolute w-full justify-center px-2  items-center bottom-7 z-50">
              <StyledView className="flex-row justify-between bg-white py-4 px-2 w-full border-[1px] border-zinc-300 rounded-[18px] shadow shadow-zinc-400">
                <StyledTouchableOpacity
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                  onPress={() => handleActiveStudenChange(false)}
                  className="justify-center">
                  <ArrowLeftIcon />
                </StyledTouchableOpacity>

                <StyledView className="justify-center items-center">
                  <StyledText className="text-black text-sm my-1 font-bold">
                    {ridesArray[activeIndex].name}{' '}
                    {ridesArray[activeIndex].surname}
                  </StyledText>
                  <StyledText className="text-black text-sm my-1 font-poppi-medium">
                    {ridesArray[activeIndex].address}
                  </StyledText>

                  <StyledView className="flex-row gap-1 justify-between w-[90%] my-1">
                    <StyledTouchableOpacity
                      onPress={() => {
                        Vibration.vibrate(10);
                        handleWaze(
                          ridesArray[activeIndex].lat,
                          ridesArray[activeIndex].long,
                        );
                      }}
                      className="px-2  w-1/2 py-4 bg-[#7658F2] rounded-[5px] justify-center items-center">
                      <StyledText
                        numberOfLines={1}
                        className="text-white font-poppi-medium text-sm">
                        {t('attributes.openInWaze')}
                      </StyledText>
                    </StyledTouchableOpacity>

                    <StyledTouchableOpacity
                      onPress={() => {
                        Vibration.vibrate(10);
                        handleEndRide();
                      }}
                      className="px-5 py-4 bg-[#FFFFFF] w-[45%]  border-[1px] border-[#7658F2] rounded-[5px] items-center justify-center">
                      <StyledText
                        numberOfLines={1}
                        className="text-[#7658F2] font-poppi-medium text-sm">
                        {t('attributes.endRide')}
                      </StyledText>
                    </StyledTouchableOpacity>
                  </StyledView>
                </StyledView>

                <StyledTouchableOpacity
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                  onPress={() => handleActiveStudenChange(true)}
                  className="justify-center ">
                  <ArrowRigthIcon />
                </StyledTouchableOpacity>
              </StyledView>
            </StyledView>
          ) : (
            <StyledView className="absolute w-auto h-[130px] justify-center px-2 mx-3 items-center top-7 z-50 border-[1px] bg-white border-zinc-300 rounded-[18px] shadow shadow-zinc-400">
              <FlatList data={data.paths} renderItem={renderItem} />
            </StyledView>
          )}

          <MapView
            customMapStyle={mapStyle}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: parseFloat(data.paths[0].lat),
              longitude: parseFloat(data.paths[0].long),
              latitudeDelta: 0.0421,
              longitudeDelta: 0.02,
            }}>
            <MapViewDirections
              origin={
                data.transfer === 'pickup'
                  ? {
                      latitude: parseFloat(data.paths[0].lat),
                      longitude: parseFloat(data.paths[0].long),
                    }
                  : {
                      latitude: parseFloat(data.school.lat),
                      longitude: parseFloat(data.school.long),
                    }
              }
              waypoints={waypoints}
              destination={
                data.transfer === 'pickup'
                  ? {
                      latitude: parseFloat(data.school.lat),
                      longitude: parseFloat(data.school.long),
                    }
                  : {
                      latitude: parseFloat(data.paths[0].lat),
                      longitude: parseFloat(data.paths[0].long),
                    }
              }
              apikey={API_KEY}
              strokeColor={'#6A5ACD'}
              strokeWidth={6}
            />

            <Marker
              coordinate={{
                latitude: parseFloat(data.paths[0].lat),
                longitude: parseFloat(data.paths[0].long),
              }}>
              <StyledView className="w-[36px] justify-center items-center h-[36px] bg-[#7658F2] rounded-full border-[1px] border-white">
                <HomeIcon />
              </StyledView>
            </Marker>

            <Marker
              coordinate={{
                latitude: parseFloat(data.school.lat),
                longitude: parseFloat(data.school.long),
              }}>
              <StyledView className="w-[36px] h-[36px] justify-center items-center bg-[#7658F2] rounded-full border-[1px] border-white">
                <SchoolIcon />
              </StyledView>
            </Marker>
          </MapView>
        </StyledView>
      </>
    ) : (
      <StyledView className="h-screen w-screen items-center justify-center">
        <StyledText className="text-lg text-black">No data</StyledText>
      </StyledView>
    )
  ) : (
    <StyledView className="bg-black/20 h-full z-50 w-screen absolute items-center justify-center">
      <ActivityIndicator size="large" color="#7658F2" />
    </StyledView>
  );
};

export default Tracking;
