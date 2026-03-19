import React, {useEffect, useState, useRef, useMemo} from 'react';
import {StyleSheet, View, ActivityIndicator, Text} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Supercluster from 'supercluster';
import {useTranslation} from 'react-i18next';
import {fetchData} from '@utils/fetchData';
import {API_URL} from '@env';

const INITIAL_REGION = {
  latitude: 40.4093,
  longitude: 49.8671,
  latitudeDelta: 0.2,
  longitudeDelta: 0.2,
};

const toGeoJSON = points =>
  points.map(p => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [Number(p.longitude), Number(p.latitude)],
    },
    properties: {id: p.id, name: p.name, address: p.address, ...p},
  }));

const Branches = () => {
  const {t} = useTranslation();
  const mapRef = useRef(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState(INITIAL_REGION);

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

  const points = useMemo(() => {
    return locations.filter(
      loc => Number(loc.latitude) && Number(loc.longitude),
    );
  }, [locations]);

  const supercluster = useMemo(() => {
    const sc = new Supercluster({radius: 60, maxZoom: 16});
    sc.load(toGeoJSON(points));
    return sc;
  }, [points]);

  const zoom = useMemo(
    () => Math.round(Math.log2(360 / region.longitudeDelta) + 1),
    [region.longitudeDelta],
  );

  const clusters = useMemo(() => {
    const bbox = [
      region.longitude - region.longitudeDelta / 2,
      region.latitude - region.latitudeDelta / 2,
      region.longitude + region.longitudeDelta / 2,
      region.latitude + region.latitudeDelta / 2,
    ];
    return supercluster.getClusters(bbox, zoom);
  }, [supercluster, region, zoom]);

  const handleClusterPress = cluster => {
    const {cluster_id} = cluster.properties;
    const expansionZoom = Math.min(
      supercluster.getClusterExpansionZoom(cluster_id),
      16,
    );
    const [longitude, latitude] = cluster.geometry.coordinates;

    mapRef.current?.animateToRegion({
      latitude,
      longitude,
      latitudeDelta:
        region.latitudeDelta / Math.pow(2, expansionZoom - zoom),
      longitudeDelta:
        region.longitudeDelta / Math.pow(2, expansionZoom - zoom),
    });
  };

  const initialRegion = useMemo(() => {
    if (points.length === 0) return INITIAL_REGION;
    const first = points[0];
    return {
      latitude: Number(first.latitude) || INITIAL_REGION.latitude,
      longitude: Number(first.longitude) || INITIAL_REGION.longitude,
      latitudeDelta: 0.2,
      longitudeDelta: 0.2,
    };
  }, [points]);

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#66B600" />
        </View>
      )}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        showsCompass={false}
        scrollEnabled={true}
        onRegionChangeComplete={setRegion}>
        {clusters.map(cluster => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const {cluster: isCluster, point_count, id} = cluster.properties;

          if (isCluster) {
            return (
              <Marker
                key={`cluster-${cluster.id}`}
                coordinate={{latitude, longitude}}
                onPress={() => handleClusterPress(cluster)}
                tracksViewChanges={false}>
                <View style={styles.clusterMarker}>
                  <Text style={styles.clusterText}>{point_count}</Text>
                </View>
              </Marker>
            );
          }

          return (
            <Marker
              key={`point-${id}`}
              coordinate={{latitude, longitude}}
              title={cluster.properties.name}
              description={cluster.properties.address}
              tracksViewChanges={false}
              image={require('@images/burda-location-icon.png')}
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
  clusterMarker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#66B600',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  clusterText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default Branches;
