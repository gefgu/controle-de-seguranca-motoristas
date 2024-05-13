import { View, Text, TouchableOpacity } from "react-native";

const styles = {
  container: {
    backgroundColor: "white",
    elevation: 5,
    shadowColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.75,
    shadowRadius: 4,
  },
};

export default function TruckCard() {
  return (
    <TouchableOpacity style={styles.container}>
      <Text>Caminhão</Text>
    </TouchableOpacity>
  );
}
