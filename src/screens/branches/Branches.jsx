import React, {useEffect, useState, useMemo} from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {useTranslation} from 'react-i18next';
import {fetchData} from '@utils/fetchData';
import {API_URL} from '@env';

const Branches = () => {
  const {t} = useTranslation();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLocations = async () => {
      try {
        const result = await fetchData({
          url: `${API_URL}/locations/`,
          tokenRequired: true,
        });

        if (result?.success && Array.isArray(result.data?.results)) {
          setLocations(result.data.results);
        }
      } catch (e) {
        console.warn('Error fetching locations:', e?.message || e);
      } finally {
        setLoading(false);
      }
    };

    getLocations();
  }, []);

  const initialRegion = useMemo(() => {
    if (locations.length === 0) {
      // Bakü fallback
      return {
        latitude: 40.4093,
        longitude: 49.8671,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
    }
    const first = locations[0];
    return {
      latitude: Number(first.latitude) || 40.4093,
      longitude: Number(first.longitude) || 49.8671,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    };
  }, [locations]);

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#66B600" />
        </View>
      )}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        showsCompass={false}
        scrollEnabled={true}
        onPanDrag={() => {}}>
        {locations.map(location => {
          const lat = Number(location.latitude);
          const lng = Number(location.longitude);
          if (!lat || !lng) {
            return null;
          }
          return (
            <Marker
              key={location.id}
              coordinate={{latitude: lat, longitude: lng}}
              title={location.name}
              tracksViewChanges={false}
              image={require('@images/burda-location-icon.png')}
              description={location.address}
            />
          );
        })}
      </MapView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});

export default Branches;
