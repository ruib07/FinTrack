import { HelloWave } from "@/components/HelloWave";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedModal } from "@/components/ThemedModal";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import i18n from "@/locales/i18n";
import { storage } from "@/utils/storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

export default function LanguageSelectorScreen() {
  const { t } = useTranslation();
  const [value, setValue] = useState(i18n.language);
  const [items, setItems] = useState([
    { label: t("portuguese"), value: "pt" },
    { label: t("english"), value: "en" },
  ]);

  useEffect(() => {
    setItems([
      { label: t("portuguese"), value: "pt" },
      { label: t("english"), value: "en" },
    ]);
  }, [i18n.language]);

  const handleLanguageChange = async (lang: string) => {
    setValue(lang);
    await storage.setItem("language", lang);
    await i18n.changeLanguage(lang);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">
        {t("welcome")}!
        <HelloWave />
      </ThemedText>

      <ThemedText type="defaultSemiBold" style={{ marginTop: 20 }}>
        {t("choose")}:
      </ThemedText>
      <ThemedModal
        selectedValue={value}
        onValueChange={handleLanguageChange}
        items={items}
      />

      <ThemedButton
        title={t("selection.choose")}
        style={{ marginTop: 10 }}
        onPress={async () => {
          await handleLanguageChange(value);
          router.push("/(tabs)/signin");
        }}
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
});
