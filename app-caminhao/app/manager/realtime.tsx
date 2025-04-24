import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { styles } from "../../styles";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { Icon } from "@rneui/base";
import TruckCard from "../../components/TruckCard";
import { Card } from "@rneui/themed";

const bg_image = require("../../assets/bg.png");

// Sample data for active drivers
const ACTIVE_DRIVERS = [
  {
    id: "1234",
    name: "João Silva",
    status: 1,
    location: "São Paulo → Curitiba",
    lastUpdate: "2 min atrás",
  },
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

export default function RealtimePage() {
  const [activeDrivers, setActiveDrivers] = useState(ACTIVE_DRIVERS);

  // Status descriptions for legend
  const statuses = [
    { status: 1, label: "Alerta", color: "#2ECC71" },
    { status: 2, label: "Atenção", color: "#F39C12" },
    { status: 3, label: "Sonolência Detectada", color: "#E74C3C" },
  ];

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
          {activeDrivers.length} motoristas em atividade
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
            {activeDrivers.map((driver) => (
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
                  onPress={() => router.push(`/manager/map/${driver.id}`)}
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
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 18,
                        fontFamily: "Oswald-Bold",
                      }}
                    >
                      {driver.name}
                    </Text>
                    <Text
                      style={{
                        color: "#666",
                        fontFamily: "JosefinSans-Regular",
                      }}
                    >
                      {driver.location}
                    </Text>
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
