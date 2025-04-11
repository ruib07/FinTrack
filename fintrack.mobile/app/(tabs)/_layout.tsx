import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { storage } from "@/utils/storage";
import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";

export default function TabLayout() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const userId = await storage.getItem("userId");
      const userToken = await storage.getItem("token");
      setIsAuthenticated(!!(userId && userToken));
    };

    checkAuth();

    const interval = setInterval(checkAuth, 500);

    return () => clearInterval(interval);
  }, []);

  if (isAuthenticated === null) return null;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="languageselector"
        options={{
          title: "Language Selector",
          href: null,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: t("home"),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: t("categories"),
          href: isAuthenticated ? undefined : null,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="folder.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: t("transactions"),
          href: isAuthenticated ? undefined : null,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="dollarsign.circle.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="budgets"
        options={{
          title: t("budgets"),
          href: isAuthenticated ? undefined : null,
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name={Platform.OS === "ios" ? "target" : "analytics"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("profile"),
          href: isAuthenticated ? undefined : null,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="signin"
        options={{
          title: t("authentication"),
          href: isAuthenticated ? null : undefined,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="lock.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
