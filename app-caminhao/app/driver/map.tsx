import { View, Image } from "react-native";
import { styles } from "../../styles";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  watchPositionAsync,
  LocationAccuracy,
} from "expo-location";
import { useEffect, useRef, useState } from "react";
import MapViewDirections from "react-native-maps-directions";
import { Text, Button } from "@rneui/themed";
import { Icon } from "@rneui/base";
import RouteCard from "../../components/RouteCard";
import { supabase } from "../../lib/supabase";
import Loading from "../../components/Loading";

const truck_icon = require("../../assets/truck_icon.png");
const sleep_icon = require("../../assets/sleep.png");
const bg_image = require("../../assets/bg.png");
const GOOGLE_MAPS_DIRECTIONS_API_KEY =
  process.env.GOOGLE_MAPS_DIRECTIONS_API_KEY;

function format_waypoint_address(lat: number, lon: number) {
  return `${lat},${lon}`;
}

const sleep_points = [{ latitude: -25.4207369, longitude: -49.2819641 }];

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
  // const { data, error, status } = await supabase
  //   .from("routes")
  //   .select("*")
  //   .single();
  // return data as RouteData;
  return {
    destination: "São Paulo",
    destination_lat: -23.5505,
    destination_lon: -46.6333,
    driver: "1234",
    id: "1",
    origin: "Curitiba",
    origin_lat: -25.4284,
    origin_lon: -49.2733,
  };
}

export default function DriverMapView() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [data, setData] = useState<RouteData | null>(null);
  const [sleepPoints, setSleepPoints] = useState(sleep_points);
  const [lastSleepTime, setLastSleepTime] = useState<number | null>(null);
  const [isSleeping, setIsSleeping] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);

  const mapRef = useRef<MapView>(null);

  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();

    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
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

  // Simulating connection with a timeout
  useEffect(() => {
    // Simulate connection process with a 3-second timeout
    const timer = setTimeout(() => {
      setIsConnecting(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function logRoute() {
      if (!data || !location) return;

      const currentTime = Date.now();

      if (isSleeping) {
        if (!lastSleepTime || currentTime - lastSleepTime >= 10000) {
          setSleepPoints([
            ...sleepPoints,
            {
              latitude: location.coords.latitude as number,
              longitude: location.coords.longitude as number,
            },
          ]);

          const { status, error } = await supabase.from("tracking").insert({
            driver: data.driver,
            lat: location.coords.latitude,
            lon: location.coords.longitude,
            speed: location.coords.speed,
            is_sleeping: isSleeping,
            road_index: 2, // to be cleaned
          });

          setLastSleepTime(currentTime);
        }
      } else {
        const { status, error } = await supabase.from("tracking").insert({
          driver: data.driver,
          lat: location.coords.latitude,
          lon: location.coords.longitude,
          speed: location.coords.speed,
          is_sleeping: isSleeping,
        });
      }
    }

    const intervalId = setInterval(logRoute, 5000);
    return () => clearInterval(intervalId);
  }, [location, data, isSleeping, lastSleepTime, sleepPoints]);

  // Toggle sleep status for testing
  const toggleSleepStatus = () => {
    setIsSleeping(!isSleeping);
  };

  if (isConnecting) {
    return (
      <View style={styles.container}>
        <Image source={bg_image} resizeMode="center" />
        <View
          style={{
            position: "absolute",
            backgroundColor: "rgba(255, 255, 255, 0.4)",
            width: "100%",
            height: "100%",
            zIndex: 1,
          }}
        />
        <View
          style={{
            position: "absolute",
            flex: 1,
            justifyContent: "space-around",
            zIndex: 2,
          }}
        >
          <Text style={{ ...styles.heading1 }}>
            Conectando Com Detector De Sonolência...
          </Text>
          <Button
            title="Solid"
            type="clear"
            loading
            style={{ backgroundColor: "white" }}
            loadingProps={{ size: "large" }}
          />
        </View>
      </View>
    );
  }

  if (!data) return <Loading />;

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          provider={PROVIDER_GOOGLE}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Esse é Você"
            image={truck_icon}
          />
          {sleepPoints.map((p, index) => (
            <Marker
              coordinate={p}
              image={sleep_icon}
              title="Sonolência Detectada"
              key={`sleep-${index}`}
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
            Caminhão #1234 - Status: {isSleeping ? "Dormindo" : "Alerta"}
          </Text>
          {/* <Button
            title={isSleeping ? "Marcar como Alerta" : "Simular Sonolência"}
            onPress={toggleSleepStatus}
            buttonStyle={{
              backgroundColor: isSleeping ? "green" : "red",
              borderRadius: 5,
              marginTop: 5,
            }}
            size="sm"
          /> */}
        </View>
      </View>
    </View>
  );
}
