import { Link } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../styles";

export default function MenuCard({
  text,
  href,
  inverted = false,
}: {
  text: string;
  href: string;
  inverted: boolean;
}) {
  return (
    <Link href={href} asChild>
      <TouchableOpacity
        style={
          inverted
            ? styles.menu_card
            : { ...styles.menu_card, ...styles.menu_card_inverted }
        }
      >
        <Text
          style={
            inverted ? styles.menu_card_text : styles.menu_card_text_inverted
          }
        >
          {text}
        </Text>
      </TouchableOpacity>
    </Link>
  );
}
