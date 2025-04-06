import ParallaxScrollView from "@/components/ParallaxScrollView";
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
import { Alert, TouchableOpacity } from "react-native";

export default function ProfileScreen() {
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
      Alert.alert("User updated successfully.");
      setIsEditing(false);
    } catch {
      setError("Failed to update user.");
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

    setUser(undefined);
    setAuth(null);
    router.replace("/");
  };

  const handleAccountDeletion = async (userId: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure that you want to delete your account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await DeleteUser(userId);
              await storage.removeItem("token");
              await storage.removeItem("userId");
              setAuth(null);
              router.replace("/");
              Alert.alert("Success", "Your account has been deleted.");
            } catch {
              Alert.alert("Something went wrong. Please try again.");
            }
          },
        },
      ]
    );
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
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
        <ThemedText type="title">Profile</ThemedText>
      </ThemedView>
      <ThemedView style={globalStyles.container}>
        <ThemedText style={profileStyles.text}>
          <ThemedText type="subtitleSemiBold">Name:</ThemedText>
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
          <ThemedText type="subtitleSemiBold">Currency:</ThemedText>
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
            <TouchableOpacity
              style={[globalStyles.button, { flex: 1 }]}
              onPress={() =>
                handleUserUpdate(user?.id || "", {
                  name: editableName,
                  email: editableEmail,
                  currency: editableCurrency,
                })
              }
            >
              <ThemedText style={globalStyles.buttonText}>
                Save Changes
              </ThemedText>
            </TouchableOpacity>
          )}

          {isEditing && (
            <TouchableOpacity
              style={[
                globalStyles.button,
                { flex: 1, backgroundColor: "gray" },
              ]}
              onPress={handleCancelEdit}
            >
              <ThemedText style={globalStyles.buttonText}>Cancel</ThemedText>
            </TouchableOpacity>
          )}

          {!isEditing && (
            <TouchableOpacity
              style={globalStyles.button}
              onPress={() => setIsEditing(true)}
            >
              <ThemedText style={globalStyles.buttonText}>
                Edit Information
              </ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>
        <ThemedView
          style={{ flexDirection: "row", gap: 20, justifyContent: "center" }}
        >
          <TouchableOpacity
            style={[globalStyles.button, { flex: 1 }]}
            onPress={handleSignout}
          >
            <ThemedText style={globalStyles.buttonText}>Sign out</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[globalStyles.button, { flex: 1 }]}
            onPress={() => {
              handleAccountDeletion(user!.id!);
            }}
          >
            <ThemedText style={globalStyles.buttonText}>
              Remove Account
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}
