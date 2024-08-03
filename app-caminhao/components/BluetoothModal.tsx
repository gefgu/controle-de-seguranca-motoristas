import { View, Text, FlatList, TouchableOpacity } from "react-native";
import useBLE from "../useBLE";
import { useEffect } from "react";
import MenuCard from "./MenuCard";

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
    <View>
      <Text>Bluetooth Modal</Text>
      {connectedDevice ? (
        <Text>Connected</Text>
      ) : (
        <View>
          {allDevices.map((d) => (
            <Text>{d.localName}</Text>
          ))}
        </View>
      )}
      <MenuCard text="Motorista" href="/driver/map" />
    </View>
  );
}
