import { View } from "react-native";
import { styles } from "../../../styles";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
// import { GOOGLE_MAPS_DIRECTIONS_API_KEY } from "@env";

import { useEffect, useRef, useState } from "react";
import { Card, Text } from "@rneui/themed";
import { Icon, ListItem } from "@rneui/base";
import { supabase } from "../../../lib/supabase";
import Loading from "../../../components/Loading";
import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import { loadRouteData, RoutePoint } from "../../../lib/routeData";

// enableLatestRenderer();

const truck_icon = require("../../../assets/truck_icon.png");
const sleep_icon = require("../../../assets/sleep.png");

type SleepPoint = {
  latitude: number;
  longitude: number;
};

type TrackingData = {
  id: string;
  driver: string;
  lat: number;
  lon: number;
  time: string;
  speed: number;
  is_sleeping: boolean;
};

export default function DriverMapView() {
  const params = useLocalSearchParams();
  const driver_id = params["driver"] as string;
  const [data, setData] = useState<TrackingData | null>(null);
  const [sleepPoints, setSleepPoints] = useState<SleepPoint[]>([]);
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
  const [currentPointIndex, setCurrentPointIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    const loadRoute = async () => {
      const points = await loadRouteData();
      setRoutePoints(points);

      if (points.length > 0) {
        // Set initial position
        setData({
          id: "demo-1",
          driver: driver_id,
          lat: points[0].lat,
          lon: points[0].lon,
          time: new Date().toISOString(),
          speed: 60,
          is_sleeping: false,
        });
        setLoading(false);
      }
    };

    loadRoute();
  }, []);

  useEffect(() => {
    if (routePoints.length === 0) return;

    // Simulate movement along the route
    const intervalId = setInterval(() => {
      const nextIndex = (currentPointIndex + 1) % routePoints.length;
      const point = routePoints[nextIndex];

      // 0.01% chance of sleep point
      const isSleeping = Math.random() < 0.0001;

      // Update current location
      setData({
        id: `demo-${nextIndex}`,
        driver: driver_id,
        lat: point.lat,
        lon: point.lon,
        time: new Date().toISOString(),
        speed: 60 + Math.floor(Math.random() * 20), // Random speed between 60-80
        is_sleeping: isSleeping,
      });

      // Add a sleep point if detected
      if (isSleeping) {
        setSleepPoints((prevPoints) => [
          ...prevPoints,
          { latitude: point.lat, longitude: point.lon },
        ]);
      }

      // Animate the map to follow the truck
      mapRef.current?.animateCamera({
        pitch: 20,
        center: { latitude: point.lat, longitude: point.lon },
      });

      setCurrentPointIndex(nextIndex);
    }, 1000); // Move every second

    return () => clearInterval(intervalId);
  }, [routePoints, currentPointIndex]);

  if (loading || !data) return <Loading />;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: data.lat,
          longitude: data.lon,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        provider={PROVIDER_GOOGLE}
      >
        <Marker
          coordinate={{
            latitude: data.lat,
            longitude: data.lon,
          }}
          title={`Speed: ${data.speed}. Carga: Desconhecida`}
          image={truck_icon}
        />
        {sleepPoints.map((p, index) => (
          <Marker
            key={`sleep-${index}`}
            coordinate={{ latitude: p.latitude, longitude: p.longitude }}
            image={sleep_icon}
            title="Sonolência Detectada"
          />
        ))}
      </MapView>

      <View style={styles.truck_map_card}>
        <Icon name="truck" type="font-awesome" size={48} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Caminhão #1234
          </Text>
          <Text>{`Velocidade: ${data.speed} km/h`}</Text>
        </View>
      </View>
    </View>
  );
}
