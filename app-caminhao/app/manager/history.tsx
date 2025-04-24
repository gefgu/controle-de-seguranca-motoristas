import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { styles } from "../../styles";
import { router } from "expo-router";
import { Icon } from "@rneui/base";
import { useState } from "react";
import TripCard, { TripData } from "../../components/TripCard";
import TripDetail from "../../components/TripDetail";

const bg_image = require("../../assets/bg.png");

// Sample data for past trips with driver information
const SAMPLE_TRIPS: (TripData & { driverName: string })[] = [
  {
    id: "1",
    title: "Curitiba - São Paulo",
    startDate: "24 de abril de 2025",
    startTime: "08:30",
    endTime: "17:45",
    description: "Transporte de produtos eletrônicos",
    distance: "408 km",
    sleepEvents: 3,
    sleepDuration: "45 min",
    origin: { latitude: -25.4284, longitude: -49.2733 },
    destination: { latitude: -23.5505, longitude: -46.6333 },
    sleepPoints: [
      { latitude: -24.785, longitude: -48.222 },
      { latitude: -24.1021, longitude: -47.5851 },
      { latitude: -23.878, longitude: -46.9945 },
    ],
    driverName: "João Silva",
  },
  {
    id: "2",
    title: "Joinville - Florianópolis",
    startDate: "20 de abril de 2025",
    startTime: "06:15",
    endTime: "10:30",
    description: "Transporte de alimentos refrigerados",
    distance: "188 km",
    sleepEvents: 1,
    sleepDuration: "12 min",
    origin: { latitude: -26.3034, longitude: -48.8458 },
    destination: { latitude: -27.5969, longitude: -48.5495 },
    sleepPoints: [{ latitude: -26.9124, longitude: -48.66 }],
    driverName: "Maria Oliveira",
  },
  {
    id: "3",
    title: "Porto Alegre - Caxias do Sul",
    startDate: "18 de abril de 2025",
    startTime: "09:00",
    endTime: "11:45",
    description: "Transporte de produtos têxteis",
    distance: "125 km",
    sleepEvents: 0,
    sleepDuration: "0 min",
    origin: { latitude: -30.0277, longitude: -51.2287 },
    destination: { latitude: -29.1684, longitude: -51.1796 },
    sleepPoints: [],
    driverName: "Carlos Santos",
  },
  {
    id: "4",
    title: "São Paulo - Rio de Janeiro",
    startDate: "15 de abril de 2025",
    startTime: "05:30",
    endTime: "12:15",
    description: "Transporte de equipamentos industriais",
    distance: "435 km",
    sleepEvents: 4,
    sleepDuration: "60 min",
    origin: { latitude: -23.5505, longitude: -46.6333 },
    destination: { latitude: -22.9068, longitude: -43.1729 },
    sleepPoints: [
      { latitude: -23.317, longitude: -46.0008 },
      { latitude: -23.0293, longitude: -45.5521 },
      { latitude: -22.8316, longitude: -44.2739 },
      { latitude: -22.8756, longitude: -43.6349 },
    ],
    driverName: "Ana Pereira",
  },
];

export default function ManagerHistoryPage() {
  const [selectedTrip, setSelectedTrip] = useState<TripData | null>(null);
  const [trips] = useState(SAMPLE_TRIPS);

  const handleSelectTrip = (trip: TripData): void => {
    setSelectedTrip(trip);
  };

  const handleBack = () => {
    if (selectedTrip) {
      setSelectedTrip(null);
    } else {
      router.back();
    }
  };

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

      <TouchableOpacity style={styles.backbutton} onPress={handleBack}>
        <Icon name="arrow-back" size={24} />
      </TouchableOpacity>

      {!selectedTrip ? (
        // Trip list view
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            padding: 20,
            paddingTop: 60,
          }}
        >
          <Text style={styles.heading1}>Histórico de Viagens</Text>
          <Text
            style={{
              ...styles.heading2,
              marginBottom: 20,
            }}
          >
            Histórico completo da frota
          </Text>

          <ScrollView>
            {trips.map((trip) => (
              <View key={trip.id}>
                <TripCard trip={trip} onPress={handleSelectTrip} />
                <Text
                  style={{
                    marginTop: -12,
                    marginBottom: 12,
                    marginLeft: 8,
                    fontSize: 12,
                    color: "#555",
                    fontFamily: "JosefinSans-Regular",
                  }}
                >
                  Motorista: {trip.driverName}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      ) : (
        // Trip detail view
        <TripDetail trip={selectedTrip} />
      )}
    </View>
  );
}
