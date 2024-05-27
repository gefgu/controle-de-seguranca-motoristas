import { View, Text, TouchableOpacity, Image } from "react-native";

const truck_icon = require("../../assets/truck_icon.png");
const sleep_icon = require("../../assets/sleep.png");

const styles = {
  container: {
    backgroundColor: "white",
    elevation: 5,
    shadowColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 16,
    //borderRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.75,
    shadowRadius: 4,
    //borderColor: "black",
    //borderWidth: 1,
  },
};

export default function TruckCard({ status }: { status: number}) {
  return (
    <TouchableOpacity style={styles.container}>
      <Text>Caminhão</Text>
      {/* {status === 0 && <Image source={require('./images.jpeg')} />} */}
      {status === 1 && <Image source={require('./1.jpg')} />}
      {status === 2 && <Image source={require('./2.jpg')} />}
      {status === 3 && <Image source={require('./3.jpg')} />}
    </TouchableOpacity>
  );
}
