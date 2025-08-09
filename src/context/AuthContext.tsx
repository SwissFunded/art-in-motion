import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user" | "viewer";
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for testing
const DEMO_USERS: Array<User & { password: string }> = [
  {
    id: "1",
    email: "admin@artinmotion.com",
    password: "admin123",
    name: "Admin User",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
  },
  {
    id: "2", 
    email: "curator@artinmotion.com",
    password: "curator123",
    name: "Art Curator",
    role: "user",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150"
  },
  {
    id: "3",
    email: "viewer@artinmotion.com", 
    password: "viewer123",
    name: "Gallery Viewer",
    role: "viewer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored authentication on mount
  useEffect(() => {
    const checkStoredAuth = () => {
      try {
        const storedUser = localStorage.getItem("art-in-motion-user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error("Error loading stored auth:", error);
        localStorage.removeItem("art-in-motion-user");
      } finally {
        setIsLoading(false);
      }
    };

    checkStoredAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check demo users
      const demoUser = DEMO_USERS.find(u => u.email === email && u.password === password);
      
      if (demoUser) {
        const { password: _, ...userWithoutPassword } = demoUser;
        setUser(userWithoutPassword);
        localStorage.setItem("art-in-motion-user", JSON.stringify(userWithoutPassword));
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { 
          success: false, 
          error: "Invalid email or password. Try admin@artinmotion.com / admin123" 
        };
      }
    } catch (error) {
      setIsLoading(false);
      return { 
        success: false, 
        error: "Login failed. Please try again." 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("art-in-motion-user");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("art-in-motion-user", JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Helper hook for checking user permissions
export const usePermissions = () => {
  const { user } = useAuth();
  
  return {
    canEdit: user?.role === "admin" || user?.role === "user",
    canDelete: user?.role === "admin",
    canView: !!user,
    isAdmin: user?.role === "admin",
    isUser: user?.role === "user", 
    isViewer: user?.role === "viewer"
  };
};
