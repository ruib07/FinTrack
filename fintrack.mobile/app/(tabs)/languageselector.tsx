import { HelloWave } from "@/components/HelloWave";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedModal } from "@/components/ThemedModal";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthContext";
import i18n from "@/locales/i18n";
import { GetUserById } from "@/services/users.service";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

export default function LanguageSelectorScreen() {
  const { t } = useTranslation();
  const { userId } = useAuth();
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [items, setItems] = useState([
    { label: t("portuguese"), value: "pt" },
    { label: t("english"), value: "en" },
  ]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setUser(null);
        return;
      }

      try {
        const response = await GetUserById(userId);
        setUser(response.data);
      } catch {
        setError("Failed to load user.");
      }
    };

    fetchUser();
  }, [userId]);

  if (!user) {
    return (
      <ThemedText type="subtitle" style={{ textAlign: "center" }}>
        Loading...
      </ThemedText>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">
        {t("welcome")} {user.name}!
        <HelloWave />
      </ThemedText>

      <ThemedText type="defaultSemiBold" style={{ marginTop: 20 }}>
        {t("choose")}:
      </ThemedText>
      <ThemedModal
        selectedValue={value}
        onValueChange={(value) => i18n.changeLanguage(value)}
        items={items}
      />

      <ThemedButton
        title={t("languageSelection")}
        style={{ marginTop: 10 }}
        onPress={() => router.push("/")}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dropDown: {
    marginTop: 20,
    paddingHorizontal: 40,
  },
});
