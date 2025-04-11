import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SendEmail } from "@/services/resetPasswords.service";
import formStyles from "@/styles/formStyles";
import globalStyles from "@/styles/globalStyles";
import { ISendEmail } from "@/types/resetPassword";
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Image } from "react-native";

export default function RecoverPasswordScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");

  const handleEmailRequest = async () => {
    const emailReq: ISendEmail = { email };

    try {
      await SendEmail(emailReq);
      Alert.alert(t("sendEmailSuccess"));
      router.push("/(tabs)/signin");
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
          {t("recoverPassword")}
        </ThemedText>
        <ThemedView style={formStyles.formField}>
          <ThemedInput
            onChangeText={setEmail}
            placeholder="Email"
            value={email}
            keyboardType="email-address"
          />
        </ThemedView>
        <ThemedButton title={t("sendEmail")} onPress={handleEmailRequest} />
      </ThemedView>
    </ParallaxScrollView>
  );
}
