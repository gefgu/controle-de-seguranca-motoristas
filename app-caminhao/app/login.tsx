import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import { styles } from "../styles";
import { Button } from "@rneui/themed";
import { supabase } from "../lib/supabase";
import { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

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

    // Configure Google Sign-In
    GoogleSignin.configure({
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
      webClientId:
        "122332547153-as5siuc9haa7tg9mc2s0oam0fgb3851u.apps.googleusercontent.com",
      offlineAccess: true,
      hostedDomain: "",
      forceCodeForRefreshToken: true,
      accountName: "",
      googleServicePlistPath: "",
    });
  }, [role]);

  const getRoleDestination = () => {
    if (role === "manager") return "/manager/overview";
    if (role === "driver") return "/driver/menu";
    return "/";
  };

  // Temporary bypass function for development
  const handleTemporaryBypass = () => {
    Alert.alert(
      "Desenvolvimento",
      "Google Sign-In em configuração. Prosseguir temporariamente?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Prosseguir",
          onPress: () => {
            console.log("Bypassing authentication for development");
            router.push(getRoleDestination());
          },
        },
      ]
    );
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      if (userInfo.data?.idToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: userInfo.data.idToken,
        });

        if (error) {
          console.error("Error logging in:", error);
          Alert.alert("Error", error.message);
          setLoading(false);
          return;
        }

        console.log("Successfully signed in:", data.user);
        router.push(getRoleDestination());
      } else {
        throw new Error("No ID token present!");
      }
    } catch (error: any) {
      console.error("Error logging in:", error);
      setLoading(false);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("User cancelled sign-in");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Sign-in already in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("Error", "Google Play Services not available");
      } else if (error.message === "DEVELOPER_ERROR") {
        // Handle DEVELOPER_ERROR specifically
        Alert.alert(
          "Configuração em Andamento",
          "Google Sign-In ainda está sendo configurado. Deseja prosseguir temporariamente?",
          [
            { text: "Tentar Novamente", onPress: () => handleGoogleLogin() },
            { text: "Prosseguir", onPress: handleTemporaryBypass },
          ]
        );
      } else {
        // For any other error, offer to proceed
        Alert.alert(
          "Erro de Autenticação",
          "Ocorreu um erro no login. Deseja prosseguir temporariamente?",
          [
            { text: "Tentar Novamente", onPress: () => handleGoogleLogin() },
            { text: "Prosseguir", onPress: handleTemporaryBypass },
          ]
        );
      }
    }
  };

  // Define a user-friendly text for the role
  const roleText =
    role === "manager" ? "Gestor" : role === "driver" ? "Motorista" : "usuário";

  return (
    <View style={styles.container}>
      <Image source={bg_image} resizeMode="center" />

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

          {/* Add a temporary bypass button for development */}
          <TouchableOpacity
            style={loginStyles.bypassButton}
            onPress={handleTemporaryBypass}
          >
            <Text style={loginStyles.bypassButtonText}>
              Prosseguir sem Login (Dev)
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
  bypassButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  bypassButtonText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "JosefinSans-Regular",
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
