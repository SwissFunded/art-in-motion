
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArtworksList } from "./ArtworksList";
import { WarehouseView } from "./WarehouseView";
import { ArtworkDetailsModal } from "./ArtworkDetailsModal";
import { motion } from "framer-motion";

export const Layout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("warehouses");
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-background"
    >
      <div className="container mx-auto py-4 px-3 sm:py-8 sm:px-4">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-foreground">Kunstwerk-Organizer</h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Verwalten und organisieren Sie Ihre physischen Kunstwerke in Lagerhäusern, Etagen, Regalen und Boxen.
          </p>
        </motion.div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6 h-11 sm:h-10">
            <TabsTrigger value="warehouses" className="text-sm sm:text-base">Lagerhäuser</TabsTrigger>
            <TabsTrigger value="artworks" className="text-sm sm:text-base">Alle Kunstwerke</TabsTrigger>
          </TabsList>
        
          <TabsContent value="warehouses" className="mt-0">
            <WarehouseView />
          </TabsContent>
          
          <TabsContent value="artworks" className="mt-0">
            <ArtworksList />
          </TabsContent>
        </Tabs>
      </div>
      
      <ArtworkDetailsModal />
    </motion.div>
  );
};
