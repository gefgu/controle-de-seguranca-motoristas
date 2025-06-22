import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { styles } from "../../styles";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { Icon } from "@rneui/base";
import TruckCard from "../../components/TruckCard";
import { Card } from "@rneui/themed";
import { supabase } from "../../lib/supabase";

const bg_image = require("../../assets/bg.png");

// Sample data for other drivers (static)
const OTHER_DRIVERS = [
  {
    id: "5678",
    name: "Maria Oliveira",
    status: 2,
    location: "Rio de Janeiro → Belo Horizonte",
    lastUpdate: "5 min atrás",
  },
  {
    id: "9012",
    name: "Carlos Santos",
    status: 3,
    location: "Florianópolis → Joinville",
    lastUpdate: "1 min atrás",
  },
  {
    id: "3456",
    name: "Ana Pereira",
    status: 1,
    location: "Porto Alegre → Caxias do Sul",
    lastUpdate: "15 min atrás",
  },
];

// Type for real-time driver data
type RealTimeDriver = {
  id: string;
  name: string;
  status: number;
  location: string;
  lastUpdate: string;
  lat?: number;
  lon?: number;
  speed?: number;
  is_sleeping?: boolean;
};

export default function RealtimePage() {
  const [realTimeDriver, setRealTimeDriver] = useState<RealTimeDriver | null>(
    null
  );
  const [allDrivers, setAllDrivers] = useState<RealTimeDriver[]>(OTHER_DRIVERS);

  // Status descriptions for legend
  const statuses = [
    { status: 1, label: "Alerta", color: "#2ECC71" },
    { status: 2, label: "Atenção", color: "#F39C12" },
    { status: 3, label: "Sonolência Detectada", color: "#E74C3C" },
  ];

  useEffect(() => {
    // Set up real-time subscription for João Silva's tracking data from tracking_sample table
    const subscription = supabase
      .channel("tracking-sample-updates")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "tracking_sample",
          filter: "driver=eq.João Silva",
        },
        (payload) => {
          console.log(
            "Real-time tracking update from tracking_sample:",
            payload
          );

          const trackingData = payload.new;

          // Update João Silva's data with real-time info
          const updatedDriver: RealTimeDriver = {
            id: "joao-silva-real",
            name: "João Silva",
            status: trackingData.is_sleeping ? 3 : 1, // 3 if sleeping, 1 if alert
            location: "Curitiba → São Paulo (Real-time)",
            lastUpdate: "Agora mesmo",
            lat: trackingData.lat,
            lon: trackingData.lon,
            speed: trackingData.speed,
            is_sleeping: trackingData.is_sleeping,
          };

          setRealTimeDriver(updatedDriver);

          // Update the combined drivers list
          setAllDrivers((prevDrivers) => {
            const otherDrivers = prevDrivers.filter(
              (d) => d.id !== "joao-silva-real"
            );
            return [updatedDriver, ...otherDrivers];
          });
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Get the most recent tracking data for João Silva on component mount
  useEffect(() => {
    const fetchLatestTracking = async () => {
      try {
        const { data, error } = await supabase
          .from("tracking_sample")
          .select("*")
          .eq("driver", "João Silva")
          .order("time", { ascending: false })
          .limit(1);

        if (error) {
          console.error(
            "Error fetching latest tracking from tracking_sample:",
            error
          );
          return;
        }

        if (data && data.length > 0) {
          const trackingData = data[0];

          const updatedDriver: RealTimeDriver = {
            id: "joao-silva-real",
            name: "João Silva",
            status: trackingData.is_sleeping ? 3 : 1,
            location: "Curitiba → São Paulo (Real-time)",
            lastUpdate:
              new Date(trackingData.time).toLocaleTimeString("pt-BR") +
              " atrás",
            lat: trackingData.lat,
            lon: trackingData.lon,
            speed: trackingData.speed,
            is_sleeping: trackingData.is_sleeping,
          };

          setRealTimeDriver(updatedDriver);
          setAllDrivers((prevDrivers) => {
            const otherDrivers = prevDrivers.filter(
              (d) => d.id !== "joao-silva-real"
            );
            return [updatedDriver, ...otherDrivers];
          });
        }
      } catch (error) {
        console.error(
          "Error fetching tracking data from tracking_sample:",
          error
        );
      }
    };

    fetchLatestTracking();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={bg_image} resizeMode="center" />

      <View
        style={{
          position: "absolute",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          width: "100%",
          height: "100%",
        }}
      />

      <TouchableOpacity style={styles.backbutton} onPress={() => router.back()}>
        <Icon name="arrow-back" size={24} />
      </TouchableOpacity>

      <View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          padding: 20,
          paddingTop: 60,
        }}
      >
        <Text style={styles.heading1}>Status em Tempo Real</Text>
        <Text
          style={{
            ...styles.heading2,
            marginBottom: 20,
          }}
        >
          {allDrivers.length} motoristas em atividade
        </Text>

        {/* Status legend */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: "rgba(255,255,255,0.8)",
            padding: 10,
            borderRadius: 8,
            marginBottom: 20,
          }}
        >
          {statuses.map((item) => (
            <View
              key={item.status}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: item.color,
                  marginRight: 4,
                }}
              />
              <Text style={{ fontSize: 12, width: 80 }}>{item.label}</Text>
            </View>
          ))}
        </View>

        <ScrollView>
          <View style={{ gap: 16 }}>
            {allDrivers.map((driver) => (
              <Card
                key={driver.id}
                containerStyle={{
                  borderRadius: 8,
                  padding: 0,
                  margin: 0,
                  marginBottom: 16,
                  overflow: "hidden",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    if (driver.id === "joao-silva-real") {
                      router.push(`/manager/map/joao-silva`);
                    } else {
                      router.push(`/manager/map/${driver.id}`);
                    }
                  }}
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "center",
                    padding: 12,
                    borderLeftWidth: 5,
                    borderLeftColor:
                      driver.status === 3
                        ? "#E74C3C"
                        : driver.status === 2
                        ? "#F39C12"
                        : "#2ECC71",
                  }}
                >
                  {/* Truck icon and status */}
                  <View
                    style={{
                      marginRight: 12,
                      marginBottom: 8,
                      flexBasis: 60,
                      alignSelf: "flex-start",
                    }}
                  >
                    {/* <TruckCard status={driver.status} driver_id={driver.id} /> */}
                  </View>

                  {/* Driver info section */}
                  <View
                    style={{
                      flex: 1,
                      flexBasis: "70%",
                      flexShrink: 1,
                      marginBottom: 8,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 4,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 18,
                          fontFamily: "Oswald-Bold",
                        }}
                      >
                        {driver.name}
                      </Text>
                    </View>
                    <Text
                      style={{
                        color: "#666",
                        fontFamily: "JosefinSans-Regular",
                      }}
                    >
                      {driver.location}
                    </Text>

                    {/* Show additional real-time info for João Silva */}
                    {driver.id === "joao-silva-real" &&
                      driver.speed !== undefined && (
                        <Text
                          style={{
                            fontSize: 12,
                            color: "#444",
                            fontFamily: "JosefinSans-Regular",
                            marginTop: 2,
                          }}
                        >
                          Velocidade: {Math.round(driver.speed)} km/h
                          {driver.is_sleeping && " • SONOLENTO"}
                        </Text>
                      )}

                    <Text
                      style={{
                        fontSize: 12,
                        color: "#999",
                        fontFamily: "JosefinSans-Regular",
                      }}
                    >
                      Última atualização: {driver.lastUpdate}
                    </Text>
                  </View>

                  {/* Chevron icon */}
                  <View
                    style={{
                      flexBasis: 24,
                      alignSelf: "center",
                      marginLeft: "auto",
                    }}
                  >
                    <Icon name="chevron-right" size={24} color="#999" />
                  </View>
                </TouchableOpacity>
              </Card>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
