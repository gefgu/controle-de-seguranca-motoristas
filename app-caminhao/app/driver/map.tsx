import { View } from "react-native";
import { styles } from "../../styles";
import MapView, { Marker, enableLatestRenderer } from "react-native-maps";
import { GOOGLE_MAPS_DIRECTIONS_API_KEY } from "@env";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  watchPositionAsync,
  LocationAccuracy,
} from "expo-location";
import { useEffect, useRef, useState } from "react";
import MapViewDirections from "react-native-maps-directions";
import { Card, Text } from "@rneui/themed";
import { Icon, ListItem } from "@rneui/base";
import { Int32 } from "react-native/Libraries/Types/CodegenTypes";
import RouteCard from "../../components/RouteCard";
import { supabase } from "../../lib/supabase";
import Loading from "../../components/Loading";

enableLatestRenderer();

const truck_icon = require("../../assets/truck_icon.png");
const sleep_icon = require("../../assets/sleep.png");

function format_waypoint_address(lat: number, lon: number) {
  return `${lat},${lon}`;
}

const sleep_points = [
  { latitude: -25.4207369, longitude: -49.2819641 },
  { latitude: -25.4207369, longitude: -49.2790641 },
];

type RouteData = {
  destination: string;
  destination_lat: number;
  destination_lon: number;
  driver: string;
  id: string;
  origin: string;
  origin_lat: number;
  origin_lon: number;
};

async function getRoute(): Promise<RouteData> {
  const { data, error, status } = await supabase
    .from("routes")
    .select("*")
    .single();
  console.log(data);
  return data as RouteData;
}

export default function DriverMapView() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [data, setData] = useState<RouteData | null>(null);

  const mapRef = useRef<MapView>(null);

  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();

    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
      console.log(currentPosition);
    }
  }

  useEffect(() => {
    requestLocationPermissions();
  }, []);

  useEffect(() => {
    watchPositionAsync(
      {
        accuracy: LocationAccuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (response) => {
        setLocation(response);
        mapRef.current?.animateCamera({
          pitch: 70,
          center: response.coords,
        });
      }
    );
  }, []);

  useEffect(() => {
    getRoute().then((d) => setData(d));

    return () => setData(null);
  }, []);

  if (!data) return <Loading />;

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location?.coords.latitude,
            longitude: location?.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          camera={{ pitch: 70, center: location.coords, heading: 0 }}
        >
          <Marker
            coordinate={{
              latitude: location?.coords.latitude,
              longitude: location?.coords.longitude,
            }}
            title="Esse é Você"
            image={truck_icon}
          />
          {sleep_points.map((p) => (
            <Marker
              id={`${p.latitude}, ${p.longitude}`}
              coordinate={p}
              image={sleep_icon}
              title="Vc dormiu aqui..."
            />
          ))}
          <MapViewDirections
            origin={location.coords}
            destination={format_waypoint_address(
              data.destination_lat,
              data.destination_lon
            )}
            apikey={GOOGLE_MAPS_DIRECTIONS_API_KEY}
            strokeWidth={5}
            resetOnChange={false}
          />
          <Marker
            coordinate={{
              latitude: data.origin_lat,
              longitude: data.origin_lon,
            }}
            title={data.origin}
          />
          )
          <Marker
            coordinate={{
              latitude: data.destination_lat,
              longitude: data.destination_lon,
            }}
            title={data.destination}
            pinColor="green"
          />
        </MapView>
      )}

      <RouteCard
        origin_name={data.origin}
        destination_name={data.destination}
      />

      <View style={styles.truck_map_card}>
        <Icon name="truck" type="font-awesome" size={48} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Caminhão #1234
          </Text>
        </View>
      </View>
    </View>
  );
}
