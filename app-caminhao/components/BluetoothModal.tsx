import { View, Text, FlatList, TouchableOpacity } from "react-native";
import useBLE from "../useBLE";
import { useEffect } from "react";
import MenuCard from "./MenuCard";
import { styles } from "../styles";

export default function BluetoothModal() {
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    disconnectFromDevice,
  } = useBLE();

  useEffect(() => {
    requestPermissions();
    scanForPeripherals();
  }, []);

  return (
    <View style={{ ...styles.container, gap: 32 }}>
      <Text>Bluetooth Modal</Text>
      {connectedDevice ? (
        <Text>Connected</Text>
      ) : (
        <View>
          {allDevices.map((d) => (
            <Text key={d?.id}>{d?.localName ?? d?.id}</Text>
          ))}
        </View>
      )}
      <MenuCard text="Motorista" href="/driver/map" />
    </View>
  );
}
