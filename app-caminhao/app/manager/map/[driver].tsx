import { View } from "react-native";
import { styles } from "../../../styles";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import { useEffect, useRef, useState } from "react";
import { Text } from "@rneui/themed";
import { Icon } from "@rneui/base";
import { supabase } from "../../../lib/supabase";
import Loading from "../../../components/Loading";
import { useLocalSearchParams } from "expo-router";
import { loadRouteData, RoutePoint } from "../../../lib/routeData";

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
    if (driver_id === "joao-silva" || driver_id === "joao-silva-real") {
      // For João Silva, use real-time tracking data from tracking_sample

      // Get initial data
      const fetchLatestTracking = async () => {
        try {
          const { data: trackingData, error } = await supabase
            .from("tracking_sample")
            .select("*")
            .eq("driver", "João Silva")
            .order("time", { ascending: false })
            .limit(1);

          if (error) {
            console.error(
              "Error fetching tracking from tracking_sample:",
              error
            );
            return;
          }

          if (trackingData && trackingData.length > 0) {
            const latest = trackingData[0];
            setData({
              id: latest.id,
              driver: latest.driver,
              lat: latest.lat,
              lon: latest.lon,
              time: latest.time,
              speed: latest.speed,
              is_sleeping: latest.is_sleeping,
            });

            if (latest.is_sleeping) {
              setSleepPoints((prev) => [
                ...prev,
                { latitude: latest.lat, longitude: latest.lon },
              ]);
            }
          }

          setLoading(false);
        } catch (error) {
          console.error(
            "Error fetching tracking data from tracking_sample:",
            error
          );
          setLoading(false);
        }
      };

      fetchLatestTracking();

      // Set up real-time subscription for tracking_sample
      const subscription = supabase
        .channel("tracking-sample-map-updates")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "tracking_sample",
            filter: "driver=eq.João Silva",
          },
          (payload) => {
            console.log("Map real-time update from tracking_sample:", payload);

            const trackingData = payload.new;

            setData({
              id: trackingData.id,
              driver: trackingData.driver,
              lat: trackingData.lat,
              lon: trackingData.lon,
              time: trackingData.time,
              speed: trackingData.speed,
              is_sleeping: trackingData.is_sleeping,
            });

            // Add sleep point if detected
            if (trackingData.is_sleeping) {
              setSleepPoints((prev) => [
                ...prev,
                {
                  latitude: trackingData.lat,
                  longitude: trackingData.lon,
                },
              ]);
            }

            // Animate map to new position
            mapRef.current?.animateCamera({
              pitch: 20,
              center: {
                latitude: trackingData.lat,
                longitude: trackingData.lon,
              },
            });
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // For other drivers, use simulated data
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
        }
        setLoading(false);
      };

      loadRoute();
    }
  }, [driver_id]);

  useEffect(() => {
    if (routePoints.length === 0) return;

    // Simulate movement along the route for non-real-time drivers
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
  }, [routePoints, currentPointIndex, driver_id]);

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
            {data.driver} - Caminhão #1234
          </Text>
          <Text>{`Velocidade: ${Math.round(data.speed)} km/h`}</Text>
          {data.is_sleeping && (
            <Text style={{ color: "red", fontWeight: "bold" }}>
              ⚠️ SONOLÊNCIA DETECTADA
            </Text>
          )}
          <Text style={{ fontSize: 12, color: "#666" }}>
            Última atualização:{" "}
            {new Date(data.time).toLocaleTimeString("pt-BR")}
          </Text>
        </View>
      </View>
    </View>
  );
}
