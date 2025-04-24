import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { styles } from "../../styles";
import { router } from "expo-router";
import { Icon } from "@rneui/base";
import { Card } from "@rneui/themed";

const bg_image = require("../../assets/bg.png");

// Sample fleet statistics
const FLEET_STATS = {
  totalDrivers: 28,
  activeDrivers: 16,
  totalVehicles: 30,
  activeVehicles: 16,
  averageTripDuration: "6.5 horas",
  averageTripDistance: "420 km",
  totalTripsThisMonth: 237,
  sleepEvents: {
    total: 142,
    average: "0.6 por viagem",
    criticalIncidents: 18,
  },
  // Monthly trip count
  monthlyTrips: [164, 179, 198, 237],
  // Monthly sleep incidents
  monthlySleepEvents: [98, 110, 135, 142],
};

export default function FleetSummaryPage() {
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

      <ScrollView
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          padding: 20,
          paddingTop: 60,
        }}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >
        <Text style={styles.heading1}>Resumo da Frota</Text>
        <Text
          style={{
            ...styles.heading2,
            marginBottom: 20,
          }}
        >
          Visão geral e estatísticas
        </Text>

        {/* Fleet Overview Card */}
        <Card
          containerStyle={{ borderRadius: 8, marginTop: 0, marginBottom: 16 }}
        >
          <Card.Title>Visão Geral da Frota</Card.Title>
          <Card.Divider />

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <View
              style={{
                alignItems: "center",
                flex: 1,
                minWidth: 100,
                marginBottom: 8,
              }}
            >
              <Text style={{ fontSize: 12, color: "#777" }}>Motoristas</Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  minWidth: 75,
                  textAlign: "center",
                }}
              >
                {FLEET_STATS.totalDrivers}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#555",
                  minWidth: 75,
                  textAlign: "center",
                }}
              >
                {FLEET_STATS.activeDrivers} ativos
              </Text>
            </View>

            <View
              style={{
                alignItems: "center",
                flex: 1,
                minWidth: 100,
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "#777",
                  minWidth: 75,
                  textAlign: "center",
                }}
              >
                Veículos
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  minWidth: 75,
                  textAlign: "center",
                }}
              >
                {FLEET_STATS.totalVehicles}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#555",
                  minWidth: 75,
                  textAlign: "center",
                }}
              >
                {FLEET_STATS.activeVehicles} ativos
              </Text>
            </View>

            <View
              style={{
                alignItems: "center",
                flex: 1,
                minWidth: 100,
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "#777",
                  minWidth: 100,
                  textAlign: "center",
                }}
              >
                Viagens no Mês
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  minWidth: 75,
                  textAlign: "center",
                }}
              >
                {FLEET_STATS.totalTripsThisMonth}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#555",
                  minWidth: 75,
                  textAlign: "center",
                }}
              >
                +
                {Math.round(
                  ((FLEET_STATS.totalTripsThisMonth -
                    FLEET_STATS.monthlyTrips[2]) /
                    FLEET_STATS.monthlyTrips[2]) *
                    100
                )}
                % do mês anterior
              </Text>
            </View>
          </View>
        </Card>

        {/* Trip Statistics Card */}
        <Card containerStyle={{ borderRadius: 8, marginBottom: 16 }}>
          <Card.Title>Estatísticas de Viagens</Card.Title>
          <Card.Divider />

          <View style={{ marginBottom: 16 }}>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text style={{ flex: 1, minWidth: 180, marginRight: 8 }}>
                Duração média das viagens:
              </Text>
              <Text style={{ fontWeight: "bold" }}>
                {FLEET_STATS.averageTripDuration}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text style={{ flex: 1, minWidth: 180, marginRight: 8 }}>
                Distância média percorrida:
              </Text>
              <Text style={{ fontWeight: "bold" }}>
                {FLEET_STATS.averageTripDistance}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Text style={{ flex: 1, minWidth: 180, marginRight: 8 }}>
                Total de viagens nos últimos 4 meses:
              </Text>
              <Text style={{ fontWeight: "bold" }}>
                {FLEET_STATS.monthlyTrips.reduce((sum, val) => sum + val, 0)}
              </Text>
            </View>
          </View>

          {/* Simple bar chart for monthly trips */}
          <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
            Viagens por Mês
          </Text>
          <View
            style={{
              flexDirection: "row",
              height: 100,
              alignItems: "flex-end",
              marginBottom: 8,
            }}
          >
            {FLEET_STATS.monthlyTrips.map((value, index) => (
              <View
                key={index}
                style={{ flex: 1, alignItems: "center", marginHorizontal: 4 }}
              >
                <View
                  style={{
                    width: "70%",
                    height: `${
                      (value / Math.max(...FLEET_STATS.monthlyTrips)) * 100
                    }%`,
                    backgroundColor: "#3498db",
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                  }}
                />
                <Text style={{ fontSize: 10, marginTop: 4 }}>
                  {["Jan", "Fev", "Mar", "Abr"][index]}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Sleep Events Card */}
        <Card containerStyle={{ borderRadius: 8, marginBottom: 16 }}>
          <Card.Title>Eventos de Sonolência</Card.Title>
          <Card.Divider />

          <View style={{ marginBottom: 16 }}>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text style={{ flex: 1, minWidth: 170, marginRight: 8 }}>
                Total de eventos detectados:
              </Text>
              <Text style={{ fontWeight: "bold" }}>
                {FLEET_STATS.sleepEvents.total}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text style={{ flex: 1, minWidth: 170, marginRight: 8 }}>
                Média por viagem:
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                  minWidth: 120,
                  textAlign: "center",
                }}
              >
                {FLEET_STATS.sleepEvents.average}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Text style={{ flex: 1, minWidth: 170, marginRight: 8 }}>
                Incidentes críticos (mais de 3 eventos):
              </Text>
              <Text style={{ fontWeight: "bold", color: "#e74c3c" }}>
                {FLEET_STATS.sleepEvents.criticalIncidents}
              </Text>
            </View>
          </View>

          {/* Simple bar chart for monthly sleep events */}
          <Text style={{ fontWeight: "bold", marginBottom: 32 }}>
            Eventos de Sonolência por Mês
          </Text>
          <View
            style={{
              flexDirection: "row",
              height: 100,
              alignItems: "flex-end",
              marginBottom: 8,
            }}
          >
            {FLEET_STATS.monthlySleepEvents.map((value, index) => (
              <View
                key={index}
                style={{ flex: 1, alignItems: "center", marginHorizontal: 4 }}
              >
                <View
                  style={{
                    width: "70%",
                    height: `${
                      (value / Math.max(...FLEET_STATS.monthlySleepEvents)) *
                      100
                    }%`,
                    backgroundColor: "#e74c3c",
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                  }}
                />
                <Text style={{ fontSize: 10, marginTop: 4 }}>
                  {["Jan", "Fev", "Mar", "Abr"][index]}
                </Text>
              </View>
            ))}
          </View>

          <Text
            style={{
              fontSize: 12,
              color: "#777",
              fontStyle: "italic",
              marginTop: 8,
            }}
          >
            Os eventos de sonolência aumentaram 5.2% em relação ao mês anterior.
            Recomendamos ações de conscientização com os motoristas.
          </Text>
        </Card>

        {/* Safety Recommendations Card */}
        <Card containerStyle={{ borderRadius: 8, marginBottom: 64 }}>
          <Card.Title>Recomendações de Segurança</Card.Title>
          <Card.Divider />

          <View style={{ marginBottom: 8 }}>
            <Text style={{ marginBottom: 12 }}>
              Com base nos dados coletados, recomendamos:
            </Text>

            <View style={{ marginLeft: 8 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  marginBottom: 8,
                }}
              >
                <Icon
                  name="check-circle"
                  size={16}
                  color="#27ae60"
                  style={{ marginRight: 8, marginTop: 2 }}
                />
                <Text style={{ flex: 1 }}>
                  Programar mais pausas para motoristas em rotas longas
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  marginBottom: 8,
                }}
              >
                <Icon
                  name="check-circle"
                  size={16}
                  color="#27ae60"
                  style={{ marginRight: 8, marginTop: 2 }}
                />
                <Text style={{ flex: 1 }}>
                  Realizar treinamento específico sobre sonolência ao volante
                </Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <Icon
                  name="check-circle"
                  size={16}
                  color="#27ae60"
                  style={{ marginRight: 8, marginTop: 2 }}
                />
                <Text style={{ flex: 1 }}>
                  Verificar condições de descanso dos motoristas nos pontos de
                  parada
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}
