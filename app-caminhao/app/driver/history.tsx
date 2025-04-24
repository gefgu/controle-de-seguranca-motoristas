import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { styles } from "../../styles";
import { router } from "expo-router";
import { Icon } from "@rneui/base";

const bg_image = require("../../assets/bg.png");

export default function DriverHistoryPage() {
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
          padding: 20,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={styles.heading1}>Histórico de Viagens</Text>
        <Text style={styles.heading2}>
          Em breve, você poderá visualizar suas viagens anteriores aqui.
        </Text>
      </View>
    </View>
  );
}
