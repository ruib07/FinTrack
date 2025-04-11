import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Signin } from "@/services/authentications.service";
import formStyles from "@/styles/formStyles";
import globalStyles from "@/styles/globalStyles";
import { ISignin } from "@/types/authentication";
import { storage } from "@/utils/storage";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Image, TouchableOpacity } from "react-native";

export default function SigninScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const colorScheme = useColorScheme();
  const { setAuth } = useAuth();

  const iconColor = colorScheme === "light" ? "black" : "#9BA1A6";

  const handleSignin = async () => {
    const signin: ISignin = {
      email,
      password,
    };

    try {
      const signinResponse = await Signin(signin);
      const token = signinResponse.data.token;
      const user = signinResponse.data.user;

      await storage.setItem("token", token);
      await storage.setItem("userId", user.id);
      await storage.setItem("currency", user.currency);

      setAuth(user.id);
      setEmail("");
      setPassword("");

      router.push("/");
    } catch {
      Alert.alert(t("messages.errorMessage"));
    }
  };

  return (
    <ParallaxScrollView
      headerImage={
        <Image
          source={require("@/assets/images/fintrack-banner.jpg")}
          style={globalStyles.fintrackBanner}
        />
      }
    >
      <ThemedView style={globalStyles.container}>
        <ThemedText type="title" style={{ marginBottom: 10 }}>
          {t("signin")}
        </ThemedText>
        <ThemedView style={formStyles.formField}>
          <ThemedInput
            onChangeText={setEmail}
            placeholder="Email"
            value={email}
            keyboardType="email-address"
          />
          <ThemedView style={formStyles.formField}>
            <ThemedInput
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
              placeholder={t("labels.password")}
              value={password}
            />
            <TouchableOpacity
              style={formStyles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <MaterialIcons
                name={showPassword ? "visibility-off" : "visibility"}
                size={24}
                color={iconColor}
              />
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
        <ThemedView
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <ThemedText
            type="link"
            onPress={() => router.push("/(auth)/recoverpassword")}
          >
            {t("forgotPassword")}
          </ThemedText>
        </ThemedView>
        <ThemedButton title={t("signin")} onPress={handleSignin} />
        <ThemedView
          style={{ marginTop: 8, flexDirection: "row", alignItems: "center" }}
        >
          <ThemedText>{t("dontHaveAccount")}</ThemedText>
          <ThemedText
            type="link"
            style={{ marginLeft: 5 }}
            onPress={() => router.push("/signup")}
          >
            {t("clickHere")}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}
