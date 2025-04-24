import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { styles } from "../styles";
import { Button } from "@rneui/themed";
import { supabase } from "../lib/supabase";
import { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";

const bg_image = require("../assets/bg.png");
const google_icon = require("../assets/google_icon.png");

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { role } = useLocalSearchParams();

  useEffect(() => {
    if (!role || (role !== "manager" && role !== "driver")) {
      // If no valid role is provided, go back to the role selection
      router.replace("/");
    }
  }, [role]);

  const getRoleDestination = () => {
    if (role === "manager") return "/manager/overview";
    if (role === "driver") return "/driver/map";
    return "/";
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      // For demo purposes - simulating login and redirecting based on role
      setTimeout(() => {
        setLoading(false);
        router.push(getRoleDestination());
      }, 1500);

      // In a real implementation with Supabase:
      // await supabase.auth.signInWithOAuth({
      //   provider: 'google',
      //   options: {
      //     redirectTo: 'your-app-scheme://login-callback',
      //     queryParams: {
      //       role: role as string,
      //     },
      //   },
      // });
    } catch (error) {
      console.error("Error logging in:", error);
      setLoading(false);
    }
  };

  const roleText = role === "manager" ? "Gerente" : "Motorista";

  return (
    <View style={styles.container}>
      <Image source={bg_image} resizeMode="center" />

      <View
        style={{
          position: "absolute",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          width: "100%",
          height: "100%",
        }}
      />

      <View style={loginStyles.contentContainer}>
        <View style={loginStyles.headerContainer}>
          <Text style={styles.heading1}>CAMinhão</Text>
          <Text style={styles.heading2}>
            Faça login como {roleText} para continuar
          </Text>
        </View>

        <View style={loginStyles.formContainer}>
          <TouchableOpacity
            style={loginStyles.googleButton}
            onPress={handleGoogleLogin}
            disabled={loading}
          >
            <Image source={google_icon} style={loginStyles.googleIcon} />
            <Text style={loginStyles.googleButtonText}>
              {loading ? "Conectando..." : "Entrar com Google"}
            </Text>
          </TouchableOpacity>

          {loading && (
            <Button
              type="clear"
              loading
              loadingProps={{ size: "small", color: "#4285F4" }}
              containerStyle={loginStyles.loadingContainer}
            />
          )}

          <TouchableOpacity
            onPress={() => router.back()}
            style={loginStyles.backButton}
          >
            <Text style={loginStyles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const loginStyles = StyleSheet.create({
  contentContainer: {
    position: "absolute",
    width: "85%",
    padding: 20,
    gap: 60,
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerContainer: {
    alignItems: "center",
    gap: 16,
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
    gap: 20,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: "100%",
    justifyContent: "center",
    gap: 12,
  },
  googleIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  googleButtonText: {
    fontSize: 16,
    color: "#444",
    fontFamily: "JosefinSans-Bold",
  },
  loadingContainer: {
    marginTop: 10,
  },
  backButton: {
    marginTop: 10,
    padding: 8,
  },
  backButtonText: {
    color: "black",
    fontSize: 18,
    fontFamily: "JosefinSans-Regular",
    textDecorationLine: "underline",
  },
});
