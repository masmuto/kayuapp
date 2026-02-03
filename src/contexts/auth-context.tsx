"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "cashier";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Permission mapping
const permissions = {
  admin: [
    "dashboard:view",
    "inventory:view",
    "inventory:add",
    "inventory:edit",
    "inventory:delete",
    "sales:view",
    "sales:add",
    "sales:edit",
    "sales:delete",
    "contacts:view",
    "contacts:add",
    "contacts:edit",
    "contacts:delete",
    "expenses:view",
    "expenses:add",
    "expenses:edit",
    "expenses:delete",
    "reports:view",
    "reports:export",
    "settings:view",
    "settings:edit",
    "users:view",
    "users:add",
    "users:edit",
    "users:delete",
  ],
  cashier: [
    "dashboard:view",
    "inventory:view",
    "sales:view",
    "sales:add",
    "contacts:view",
    "contacts:add",
    "reports:view",
  ],
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Use setTimeout to avoid synchronous setState in effect
        setTimeout(() => setUser(parsedUser), 0);
      } catch (error) {
        localStorage.removeItem("user");
      }
    }
    // Use setTimeout to avoid synchronous setState in effect
    setTimeout(() => setIsLoading(false), 0);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock authentication - in real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user database
    const mockUsers = [
      {
        id: "1",
        email: "admin@kayulog.com",
        name: "Administrator",
        role: "admin" as const,
        password: "admin123",
      },
      {
        id: "2",
        email: "kasir@kayulog.com",
        name: "Kasir",
        role: "cashier" as const,
        password: "kasir123",
      },
    ];

    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return permissions[user.role].includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}