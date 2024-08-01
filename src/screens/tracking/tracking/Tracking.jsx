
import { useTranslation } from 'react-i18next'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Linking, StyleSheet } from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import { API_KEY, API_URL } from '@env'
import HomeIcon from "@icons/home-tracking.svg"
import DotsIcon from '@icons/dots-ride.svg';
import CompletedIcon from '@icons/complete-pin-ride.svg';
import IncompletedIcon from '@icons/incomplete-pin-ride.svg';
import ArrowLeftIcon from "@icons/arrow-left.svg"
import ArrowRigthIcon from "@icons/arrow-right.svg"
import SchoolIcon from "@icons/school-tracking.svg"
import { StyledText, StyledView } from '@common/StyledComponents';
import { storage } from '@utils/MMKVStore';
import { fetchData } from '@utils/dataFetch';
import { jwtDecode } from 'jwt-decode';
import { StyledTouchableOpacity } from '@common/StyledComponents';

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
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#aadaff"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f0f0f0"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e0e0e0"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c0e0b0"
      }
    ]
  }
]

const Tracking = () => {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setloading] = useState(true);
  const [userType, setUserType] = useState(null);
  const [activeStudent, setActiveStudent] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [ridesArray, setRidesArray] = useState(null);
  const [waypoints, setWaypoints] = useState(null);

  const handleWaze = (lat, long) => {
    const url = `https://waze.com/ul?ll=${lat},${long}`
    console.log(url);
    Linking.openURL(url);
  }
  const handleStateChange = async (activeStudent) => {
    console.log(activeStudent)
    const url = `${API_URL}/rides/${activeStudent.id}/${activeStudent.status === "pending" ? "onway" : "complete"}/`
    console.log(url)
    const token = storage.getString("accessToken");
    const lang = storage.getString("selectedLanguage");
    const headers = {
      "Authorization": `Bearer ${token}`,
      "Accept-Language": lang
    }

  }

  const handleActiveStudenChange = (increment) => {
    increment
      ? activeIndex < ridesArray.length - 1 ? setActiveIndex(activeIndex + 1) : setActiveIndex(0)
      : activeIndex > 0 ? setActiveIndex(activeIndex - 1) : setActiveIndex(ridesArray.length - 1);
    console.log(activeIndex)
  }

  useEffect(() => {
    const dataFetch = async () => {
      const url = `${API_URL}/rides/paths/`
      const token = storage.getString("accessToken");
      const decode = jwtDecode(token);
      setUserType(decode.user_type);
      const headers = {
        "Authorization": `Bearer ${token}`,
      }

      const result = await fetchData(url, headers);

      if (result.success) {
        const realData = result.data.find((item) => item.paths.length > 0);
        setData(realData);
        const transformedPaths = realData.paths.map((item) => ({
          name: item.child.name,
          surname: item.child.surname,
          lat: item.lat,
          long: item.long
        }))

        const transformedData = realData.paths.map(item => ({
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.long)
        }));
        setRidesArray([...transformedPaths, { name: realData.school.name, surname: "", lat: realData.school.lat, long: realData.school.long }])
        console.log(ridesArray)
        setWaypoints(transformedData);
        setloading(false)
      }

    }

    dataFetch();
  }, [])

  const renderItem = ({ item }) => {
    return (
      <StyledView className="w-full p-4">
        <StyledView className="flex-row items-center gap-2">
          <StyledView className="w-[2%] justify-center items-center">
            {item.status === "completed" ? <CompletedIcon /> : <IncompletedIcon />}
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
  //
  return !loading ? (
    <>
      <StyledView className='flex-1 relative -z-10'>
        {userType === "driver" ?
          <StyledView className='absolute w-full justify-center px-2  items-center bottom-7 z-50'>
            <StyledView className="flex-row justify-between bg-white py-4 px-2 w-full border-[1px] border-[#EDEFF3] rounded-[18px]">
              <StyledTouchableOpacity onPress={() => handleActiveStudenChange(false)} className='justify-center'>
                <ArrowLeftIcon />
              </StyledTouchableOpacity>

              <StyledView className='justify-center items-center'>
                <StyledText className="text-black text-sm my-1 font-poppi-bold">{ridesArray[activeIndex].name} {ridesArray[activeIndex].surname}</StyledText>
                <StyledText className="text-black text-sm my-1 font-poppi-medium">Uzeyir Hajibeyov 57</StyledText>

                <StyledView className='flex-row gap-1 justify-between w-[90%] my-1'>
                  <StyledTouchableOpacity onPress={() => handleWaze(ridesArray[activeIndex].lat, ridesArray[activeIndex].long)} className='px-2  w-1/2 py-4 bg-[#7658F2] rounded-[5px] justify-center items-center'>
                    <StyledText numberOfLines={1} className="text-white font-poppi-medium text-sm">{t("attributes.openInWaze")}</StyledText>
                  </StyledTouchableOpacity>

                  <StyledTouchableOpacity onPress={() => handleStateChange(data.paths[activeIndex])} className='px-5 py-4 bg-[#FFFFFF] w-[45%]  border-[1px] border-[#7658F2] rounded-[5px] items-center justify-center'>
                    <StyledText numberOfLines={1} className="text-[#7658F2] font-poppi-medium text-sm">{data.paths[2].status === "pending" ? t("attributes.endRide") : t("attributes.arrived")}</StyledText>
                  </StyledTouchableOpacity>
                </StyledView>
              </StyledView>

              <StyledTouchableOpacity onPress={() => handleActiveStudenChange(true)} className='justify-center '>
                <ArrowRigthIcon />
              </StyledTouchableOpacity>

            </StyledView>

          </StyledView>
          :
          <StyledView className='absolute w-full justify-center px-2 items-center top-7 z-50'>
            <StyledView className="h-max max-h-[200px] bg-white">
              <FlatList
                data={data.paths}
                renderItem={renderItem}
              />
            </StyledView>
          </StyledView>}


        <MapView
          customMapStyle={mapStyle}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: parseFloat(data.paths[0].lat),
            longitude: parseFloat(data.paths[0].long),
            latitudeDelta: 0.0421,
            longitudeDelta: 0.02,
          }}
        >
          <MapViewDirections
            origin={{ latitude: parseFloat(data.paths[0].lat), longitude: parseFloat(data.paths[0].long) }}
            waypoints={waypoints}
            destination={{ latitude: parseFloat(data.school.lat), longitude: parseFloat(data.school.long) }}
            apikey={API_KEY}
            strokeColor={'#6A5ACD'}
            strokeWidth={6}
          />
          <Marker
            coordinate={{ latitude: parseFloat(data.paths[0].lat), longitude: parseFloat(data.paths[0].long) }}
          >
            <StyledView className="w-[36px] justify-center items-center h-[36px] bg-[#7658F2] rounded-full border-[1px] border-white">
              <HomeIcon />
            </StyledView>
          </Marker>
          <Marker
            coordinate={{ latitude: parseFloat(data.school.lat), longitude: parseFloat(data.school.long) }}
          >
            <StyledView className="w-[36px] h-[36px] justify-center items-center bg-[#7658F2] rounded-full border-[1px] border-white">
              <SchoolIcon />
            </StyledView>
          </Marker>
        </MapView>
      </StyledView>
    </>
  ) : (
    <StyledView className='bg-black/20 h-full z-50 w-screen absolute items-center justify-center'>
      <ActivityIndicator size="large" color="#7658F2" />
    </StyledView>
  )
}

export default Tracking