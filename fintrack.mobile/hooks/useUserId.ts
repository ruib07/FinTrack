import { storage } from "@/utils/storage";
import { useEffect, useState } from "react";

export const useUserId = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadUserId = async () => {
      const storedUserId = await storage.getItem("userId");
      setUserId(storedUserId);
    };

    loadUserId();
  }, []);

  return { userId };
};
