
import { useTranslation } from 'react-i18next'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Linking, StyleSheet } from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import { API_KEY, API_URL } from '@env'
import HomeIcon from "@icons/home-tracking.svg"
import SchoolIcon from "@icons/school-tracking.svg"
import { StyledText, StyledView } from '@common/StyledComponents';
import { storage } from '../../../utils/MMKVStore';
import { fetchData } from '../../../utils/dataFetch';

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
  const [waypoints, setWaypoints] = useState(null);

  useEffect(() => {
    const dataFetch = async () => {
      const url = `${API_URL}/rides/paths/`
      const token = storage.getString("accessToken");
      const headers = {
        "Authorization": `Bearer ${token}`,
      }

      const result = await fetchData(url, headers);

      if (result.success) {
        const realData = result.data.find((item) => item.paths.length > 0);
        setData(realData);
        const transformedData = realData.paths.map(item => ({
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.long)
        }));
        setWaypoints(transformedData);
        setloading(false)
      }

    }

    dataFetch();
  }, [])

  return !loading ? (
    <>
      <StyledView className='flex-1 relative -z-10'>
        <StyledView className='absolute w-full justify-center items-center top-7 z-50'>
          <StyledText className='bg-white text-black text-center text-[11px] font-poppi rounded-xl py-[2px] px-2'>{data.school.name}</StyledText>
        </StyledView>

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