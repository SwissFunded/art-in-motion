
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
      className="container mx-auto py-8 px-4"
    >
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Kunstwerk-Organizer</h1>
        <p className="text-gray-500">Verwalten und organisieren Sie Ihre physischen Kunstwerke in Lagerhäusern, Etagen, Regalen und Boxen.</p>
      </motion.div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="warehouses">Lagerhäuser</TabsTrigger>
          <TabsTrigger value="artworks">Alle Kunstwerke</TabsTrigger>
        </TabsList>
        
        <TabsContent value="warehouses">
          <WarehouseView />
        </TabsContent>
        
        <TabsContent value="artworks">
          <ArtworksList />
        </TabsContent>
      </Tabs>
      
      <ArtworkDetailsModal />
    </motion.div>
  );
};
