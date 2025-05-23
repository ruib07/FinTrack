import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedModal } from "@/components/ThemedModal";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Signup } from "@/services/authentications.service";
import formStyles from "@/styles/formStyles";
import globalStyles from "@/styles/globalStyles";
import { IUser } from "@/types/user";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Image, TouchableOpacity } from "react-native";

export default function SignupScreen() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [currency, setCurrency] = useState("");
  const colorScheme = useColorScheme();

  const iconColor = colorScheme === "light" ? "black" : "#9BA1A6";

  const handleSignup = async () => {
    const newUser: IUser = {
      name,
      email,
      password,
      currency,
    };

    try {
      await Signup(newUser);
      router.push("/(tabs)/languageselector");
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
          {t("signup")}
        </ThemedText>
        <ThemedView style={formStyles.formField}>
          <ThemedInput
            onChangeText={setName}
            placeholder={t("labels.name")}
            value={name}
          />
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
          <ThemedText type="default" style={{ marginBottom: 8 }}>
            {t("selection.chooseCurrency")}
          </ThemedText>
          <ThemedModal
            selectedValue={currency}
            onValueChange={(itemValue) => setCurrency(itemValue)}
            items={[
              { label: t("selection.currencySelection"), value: "" },
              { label: "EUR (€)", value: "EUR" },
              { label: "USD ($)", value: "USD" },
              { label: "BRL (R$)", value: "BRL" },
            ]}
          />
        </ThemedView>
        <ThemedButton title={t("createAccount")} onPress={handleSignup} />
        <ThemedView
          style={{ marginTop: 8, flexDirection: "row", alignItems: "center" }}
        >
          <ThemedText>{t("alreadyHaveAccount")}</ThemedText>
          <ThemedText
            type="link"
            style={{ marginLeft: 5 }}
            onPress={() => router.push("/signin")}
          >
            {t("clickHere")}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}
