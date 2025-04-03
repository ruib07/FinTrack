import { storage } from "@/utils/storage";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  userId: string | null;
  setAuth: (id: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadAuthData = async () => {
      const storedUserId = await storage.getItem("userId");

      setUserId(storedUserId);
    };

    loadAuthData();
  }, []);

  const setAuth = (id: string | null) => {
    setUserId(id);
  };

  return (
    <AuthContext.Provider value={{ userId, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error("useAuth must be used within an AuthProvider");

  return context;
};
