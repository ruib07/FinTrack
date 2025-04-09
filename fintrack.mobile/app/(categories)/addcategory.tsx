import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedModal } from "@/components/ThemedModal";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { CreateCategory } from "@/services/categories.service";
import formStyles from "@/styles/formStyles";
import globalStyles from "@/styles/globalStyles";
import { ICategory } from "@/types/category";
import { storage } from "@/utils/storage";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Image } from "react-native";

export default function AddCategoryScreen() {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [icon, setIcon] = useState("");

  const handleCategoryCreation = async () => {
    const userId = await storage.getItem("userId");

    if (!userId) return;

    const newCategory: ICategory = {
      name,
      type,
      icon: icon.trim() !== "" ? icon : null,
      user_id: userId,
    };

    try {
      await CreateCategory(newCategory);
      Alert.alert("Category created sucessfully.");
      router.push("/(tabs)/categories");
    } catch {
      Alert.alert("Something went wrong.");
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
          Category Creation
        </ThemedText>
        <ThemedView style={formStyles.formField}>
          <ThemedInput onChangeText={setName} placeholder="Name" value={name} />
          <ThemedInput
            onChangeText={setIcon}
            placeholder="Icon (optional)"
            value={icon}
          />
        </ThemedView>
        <ThemedText type="default" style={{ marginBottom: 8 }}>
          Choose your type:
        </ThemedText>
        <ThemedModal
          selectedValue={type}
          onValueChange={(itemValue) => setType(itemValue)}
          items={[
            { label: "Select a type...", value: "" },
            { label: "Income", value: "income" },
            { label: "Expense", value: "expense" },
          ]}
        />
        <ThemedButton
          title="Create Category"
          onPress={handleCategoryCreation}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}
