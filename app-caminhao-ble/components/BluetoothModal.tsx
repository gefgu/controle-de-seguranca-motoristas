import { View, Text, FlatList } from "react-native";
import useBLE from "useBLE";

export default function BluetoothModal() {
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    disconnectFromDevice,
  } = useBLE();

  return (
    <View>
      {connectedDevice ? (
        <Text>Connected</Text>
      ) : (
        <View>
          {allDevices.map((d) => (
            <Text>{d.localName}</Text>
          ))}
        </View>
      )}
    </View>
  );
}
