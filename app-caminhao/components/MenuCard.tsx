import { Link } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../styles";

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
        <Text style={styles.menu_card_text}>{text}</Text>
      </TouchableOpacity>
    </Link>
  );
}
