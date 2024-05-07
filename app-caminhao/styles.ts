import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    flex: 1,
    width: "100%",
  },
  route_card: {
    // position: "absolute",
    backgroundColor: "white",
    elevation: 5,
    shadowColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.75,
    shadowRadius: 4,
    maxHeight: 200,
    position: "absolute",
    top: "5%",
    left: "2%",
    right: "2%",
  },
  route_card_title: {
    fontWeight: "bold",
    fontSize: 18,
    fontFamily: "Inter",
  },
});
