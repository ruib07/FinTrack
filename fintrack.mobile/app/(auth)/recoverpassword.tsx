import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SendEmail } from "@/services/resetPasswords.service";
import formStyles from "@/styles/formStyles";
import globalStyles from "@/styles/globalStyles";
import { ISendEmail } from "@/types/resetPassword";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Image, TouchableOpacity } from "react-native";

export default function RecoverPasswordScreen() {
  const [email, setEmail] = useState("");

  const handleEmailRequest = async () => {
    const emailReq: ISendEmail = { email };

    try {
      await SendEmail(emailReq);
      Alert.alert("Email sent successfully.");
      router.push("/(tabs)/signin");
    } catch {
      Alert.alert("Something went wrong.");
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/fintrack-banner.jpg")}
          style={globalStyles.fintrackBanner}
        />
      }
    >
      <ThemedView style={globalStyles.container}>
        <ThemedText type="title" style={{ marginBottom: 10 }}>
          Recover Password
        </ThemedText>
        <ThemedView style={formStyles.formField}>
          <ThemedInput
            onChangeText={setEmail}
            placeholder="Email"
            value={email}
            keyboardType="email-address"
          />
        </ThemedView>
        <TouchableOpacity
          style={globalStyles.button}
          onPress={handleEmailRequest}
        >
          <ThemedText style={globalStyles.buttonText}>Send Email</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}
