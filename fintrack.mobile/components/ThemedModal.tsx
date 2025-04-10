import { useThemeColor } from "@/hooks/useThemeColor";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import ModalSelector from "react-native-modal-selector";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export type ThemedModalProps = {
  selectedValue: string;
  onValueChange: (itemValue: string) => void;
  items: { label: string; value: string }[];
};

export function ThemedModal({
  selectedValue,
  onValueChange,
  items,
}: ThemedModalProps) {
  const itemsWithKey = items.map((item) => ({
    ...item,
    key: item.value,
  }));
  const backgroundColor = useThemeColor({}, "background");
  const { t } = useTranslation();

  return (
    <ThemedView style={styles.container}>
      <ModalSelector
        data={itemsWithKey}
        initValue={selectedValue}
        onChange={(option) => onValueChange(option.value)}
        cancelText={t("actions.cancel")}
        overlayStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
        optionContainerStyle={{
          maxHeight: 200,
        }}
        cancelStyle={{
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 8,
          alignSelf: "center",
        }}
      >
        <ThemedView
          style={[styles.selectedValue, { backgroundColor: backgroundColor }]}
        >
          <ThemedText>
            {selectedValue || t("selection.choose") + "..."}
          </ThemedText>
        </ThemedView>
      </ModalSelector>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 10,
  },
  selectedValue: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});
