
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArtworksList } from "./ArtworksList";
import { WarehouseView } from "./WarehouseView";
import { ArtworkDetailsModal } from "./ArtworkDetailsModal";
import { motion, useScroll, useTransform } from "framer-motion";
import { Input } from "@/components/ui/input";
import { GlobalSearch } from "./GlobalSearch";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { QuickActions } from "./QuickActions";

export const Layout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("warehouses");
  const { scrollY } = useScroll();
  const headerBg = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 0.95)"]
  );
  const { user, logout } = useAuth();
  
  return (
    <div className="min-h-screen w-full bg-background">
      {/* Sticky header section */}
      <motion.header 
        className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-md"
        style={{ backgroundColor: headerBg }}
      >
        <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <motion.div 
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-3 sm:gap-4 max-w-7xl mx-auto"
          >
            <div className="hidden sm:block" />
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground tracking-tight">Art-In-Motion</h1>
              <p className="text-muted-foreground text-xs sm:text-sm">Manage your art collection</p>
            </div>
            <div className="flex justify-center sm:justify-end items-center gap-2">
              <GlobalSearch />
              <QuickActions />
              {user ? (
                <button
                  onClick={logout}
                  className="ml-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="ml-2 text-xs sm:text-sm text-primary hover:underline"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Main content area */}
      <main className="flex-1 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6 max-w-7xl mx-auto"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6 h-10 sm:h-12 p-1 bg-muted rounded-xl">
              <TabsTrigger 
                value="warehouses" 
                className="text-sm font-medium rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground"
              >
                Lagerhäuser
              </TabsTrigger>
              <TabsTrigger 
                value="artworks" 
                className="text-sm font-medium rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground"
              >
                Alle Kunstwerke
              </TabsTrigger>
            </TabsList>
          
            <TabsContent value="warehouses" className="mt-0 focus:outline-none">
              <WarehouseView />
            </TabsContent>
            
            <TabsContent value="artworks" className="mt-0 focus:outline-none">
              <ArtworksList />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      
      <ArtworkDetailsModal />
    </div>
  );
};
