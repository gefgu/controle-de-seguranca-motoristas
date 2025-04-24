import { View, Text, Image, TouchableOpacity } from "react-native";
import { styles } from "../../styles";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { Icon } from "@rneui/base";

const bg_image = require("../../assets/bg.png");

export default function Overview() {
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

      <View
        style={{
          position: "absolute",
          width: "100%",
          padding: 20,
          paddingTop: 60,
          height: "100%",
        }}
      >
        <Text style={styles.heading1}>Área do Gerente</Text>
        <Text
          style={{
            ...styles.heading2,
            marginBottom: 40,
          }}
        >
          O que deseja visualizar hoje?
        </Text>

        <View style={{ gap: 20 }}>
          {/* Real-time status button */}
          <TouchableOpacity
            style={menuButtonStyle}
            onPress={() => router.push("/manager/realtime")}
          >
            <Icon name="truck" type="font-awesome" size={32} color="#333" />
            <View style={menuTextContainer}>
              <Text style={menuTitleStyle}>Status em Tempo Real</Text>
              <Text style={menuDescriptionStyle}>
                Acompanhe a localização e status de todos os motoristas ativos
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>

          {/* History button */}
          <TouchableOpacity
            style={menuButtonStyle}
            onPress={() => router.push("/manager/history")}
          >
            <Icon name="history" type="font-awesome" size={32} color="#333" />
            <View style={menuTextContainer}>
              <Text style={menuTitleStyle}>Histórico de Viagens</Text>
              <Text style={menuDescriptionStyle}>
                Consulte relatórios de viagens anteriores e eventos de
                sonolência
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>

          {/* Fleet summary button */}
          <TouchableOpacity
            style={menuButtonStyle}
            onPress={() => router.push("/manager/fleet")}
          >
            <Icon name="bar-chart" type="font-awesome" size={32} color="#333" />
            <View style={menuTextContainer}>
              <Text style={menuTitleStyle}>Resumo da Frota</Text>
              <Text style={menuDescriptionStyle}>
                Visualize estatísticas e indicadores de desempenho da sua frota
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Inline styles for menu items
const menuButtonStyle = {
  backgroundColor: "white",
  borderRadius: 10,
  padding: 16,
  flexDirection: "row",
  alignItems: "center" as const,
  elevation: 3,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
};

const menuTextContainer = {
  flex: 1,
  marginLeft: 16,
  marginRight: 8,
};

const menuTitleStyle = {
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 4,
  fontFamily: "Oswald-Bold",
};

const menuDescriptionStyle = {
  fontSize: 14,
  color: "#666",
  fontFamily: "JosefinSans-Regular",
};
