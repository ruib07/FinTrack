import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedModal } from "@/components/ThemedModal";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAuth } from "@/context/AuthContext";
import { DeleteUser, GetUserById, UpdateUser } from "@/services/users.service";
import globalStyles from "@/styles/globalStyles";
import profileStyles from "@/styles/profileStyles";
import { IUser } from "@/types/user";
import { storage } from "@/utils/storage";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

export default function ProfileScreen() {
  const { t } = useTranslation();
  const [user, setUser] = useState<IUser>();
  const [, setError] = useState<string | null>(null);
  const { setAuth } = useAuth();
  const [editableName, setEditableName] = useState<string>("");
  const [editableEmail, setEditableEmail] = useState<string>("");
  const [editableCurrency, setEditableCurrency] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [originalName, setOriginalName] = useState<string>("");
  const [originalEmail, setOriginalEmail] = useState<string>("");
  const [originalCurrency, setOriginalCurrency] = useState<string>("");

  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        const userId = await storage.getItem("userId");

        if (!userId) {
          setUser(undefined);
          setEditableName("");
          setEditableEmail("");
          setEditableCurrency("");
          return;
        }

        try {
          const response = await GetUserById(userId);
          setUser(response.data);
          setEditableName(response.data.name);
          setEditableEmail(response.data.email);
          setEditableCurrency(response.data.currency);
          setOriginalName(response.data.name);
          setOriginalEmail(response.data.email);
          setOriginalCurrency(response.data.currency);
        } catch {
          setError("Failed to load user.");
        }
      };

      fetchUser();
    }, [])
  );

  const handleUserUpdate = async (
    userId: string,
    updateUser: Partial<IUser>
  ) => {
    try {
      const updateUserData = {
        ...user,
        ...updateUser,
      };

      await UpdateUser(userId, updateUserData);
      Alert.alert(t("userUpdated"));
      setIsEditing(false);
    } catch {
      setError(t("errorUserUpdate"));
    }
  };

  const handleCancelEdit = () => {
    setEditableName(originalName);
    setEditableEmail(originalEmail);
    setEditableCurrency(originalCurrency);
    setIsEditing(false);
  };

  const handleSignout = async () => {
    await storage.removeItem("token");
    await storage.removeItem("userId");
    await storage.removeItem("currency");

    setUser(undefined);
    setAuth(null);
    router.replace("/");
  };

  const handleAccountDeletion = async (userId: string) => {
    Alert.alert(
      t("messages.confirmDeletion"),
      t("confirmAccountDeletionMessage"),
      [
        { text: t("actions.cancel"), style: "cancel" },
        {
          text: t("actions.delete"),
          style: "destructive",
          onPress: async () => {
            try {
              await DeleteUser(userId);
              await storage.removeItem("token");
              await storage.removeItem("userId");
              await storage.removeItem("currency");
              await storage.removeItem("language");

              setAuth(null);
              router.replace("/");
              Alert.alert(t("messages.success"), t("accountRemoved"));
            } catch {
              Alert.alert(
                t("messages.errorMessage" + " " + t("messages.tryAgain"))
              );
            }
          },
        },
      ]
    );
  };

  return (
    <ParallaxScrollView
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={profileStyles.headerImage}
        />
      }
    >
      <ThemedView style={profileStyles.titleContainer}>
        <ThemedText type="title">{t("profile")}</ThemedText>
      </ThemedView>
      <ThemedView style={globalStyles.container}>
        <ThemedText style={profileStyles.text}>
          <ThemedText type="subtitleSemiBold">{t("labels.name")}:</ThemedText>
        </ThemedText>
        <ThemedInput
          style={{ marginBottom: 20 }}
          value={editableName}
          onChangeText={setEditableName}
          editable={isEditing}
        />
        <ThemedText style={profileStyles.text}>
          <ThemedText type="subtitleSemiBold">Email:</ThemedText>
        </ThemedText>
        <ThemedInput
          value={editableEmail}
          onChangeText={setEditableEmail}
          editable={isEditing}
        />
        <ThemedText style={[profileStyles.text, { marginTop: 4 }]}>
          <ThemedText type="subtitleSemiBold">
            {t("labels.currency")}:
          </ThemedText>
        </ThemedText>
        {isEditing ? (
          <ThemedModal
            selectedValue={editableCurrency}
            onValueChange={setEditableCurrency}
            items={[
              { label: "EUR (€)", value: "EUR" },
              { label: "USD ($)", value: "USD" },
              { label: "BRL (R$)", value: "BRL" },
            ]}
          />
        ) : (
          <ThemedText>{editableCurrency}</ThemedText>
        )}
      </ThemedView>
      <ThemedView style={globalStyles.container}>
        <ThemedView style={{ flexDirection: "row", gap: 10 }}>
          {isEditing && (
            <ThemedButton
              title={t("saveChanges")}
              onPress={() =>
                handleUserUpdate(user?.id || "", {
                  name: editableName,
                  email: editableEmail,
                  currency: editableCurrency,
                })
              }
            />
          )}

          {isEditing && (
            <ThemedButton
              title={t("actions.cancel")}
              style={{ flex: 1, backgroundColor: "gray" }}
              onPress={handleCancelEdit}
            />
          )}

          {!isEditing && (
            <ThemedButton
              title={t("editInformation")}
              onPress={() => setIsEditing(true)}
            />
          )}
        </ThemedView>
        <ThemedView
          style={{ flexDirection: "row", gap: 20, justifyContent: "center" }}
        >
          <ThemedButton title={t("signout")} onPress={handleSignout} />
          <ThemedButton
            title={t("removeAccount")}
            onPress={() => {
              handleAccountDeletion(user!.id!);
            }}
          />
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}
