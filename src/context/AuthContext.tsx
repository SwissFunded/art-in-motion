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
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
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
  const [users, setUsers] = useState<Array<User & { password: string }>>([]);

  // Initialize users and check for stored authentication on mount
  useEffect(() => {
    const init = () => {
      try {
        // bootstrap users
        const storedUsers = localStorage.getItem("art-in-motion-users");
        if (storedUsers) {
          setUsers(JSON.parse(storedUsers));
        } else {
          localStorage.setItem("art-in-motion-users", JSON.stringify(DEMO_USERS));
          setUsers(DEMO_USERS);
        }

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

    init();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check stored users
      const allUsers: Array<User & { password: string }> = users.length ? users : DEMO_USERS;
      const demoUser = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      
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

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      const current = (JSON.parse(localStorage.getItem("art-in-motion-users") || "null") as Array<User & { password: string }>) || DEMO_USERS;
      const exists = current.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        setIsLoading(false);
        return { success: false, error: "Email already in use" };
      }
      const newUser: User & { password: string } = {
        id: String(Date.now()),
        email,
        password,
        name,
        role: "user",
        avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name || email)}`
      };
      const updated = [...current, newUser];
      localStorage.setItem("art-in-motion-users", JSON.stringify(updated));
      setUsers(updated);

      const { password: _pw, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem("art-in-motion-user", JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return { success: true };
    } catch (err) {
      setIsLoading(false);
      return { success: false, error: "Sign up failed. Please try again." };
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
    register,
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
