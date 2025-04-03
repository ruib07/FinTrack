import AsyncStorage from "@react-native-async-storage/async-storage";

export const storage = {
  async getItem(key: string) {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error("Error: ", error);
      return null;
    }
  },

  async setItem(key: string, value: string) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error("Error: ", error);
    }
  },

  async removeItem(key: string) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("Error: ", error);
    }
  },
};
