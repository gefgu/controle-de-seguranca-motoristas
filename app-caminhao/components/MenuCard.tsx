import { Link } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";

const styles = {
  menu_card: {
    backgroundColor: "white",
    elevation: 5,
    shadowColor: "#000",
    padding: 24,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.75,
    shadowRadius: 4,
    borderColor: "black",
    borderWidth: 1,
  },
};

export default function MenuCard({
  text,
  href,
}: {
  text: string;
  href: string;
}) {
  return (
    <Link href={href} asChild>
      <TouchableOpacity style={styles.menu_card}>
        <Text>{text}</Text>
      </TouchableOpacity>
    </Link>
  );
}
