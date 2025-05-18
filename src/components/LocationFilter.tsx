
import React from "react";
import { useArtwork, Location } from "@/context/ArtworkContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

interface LocationFilterProps {
  onSelectLocation: (locationId: string) => void;
  selectedLocation: string;
}

export const LocationFilter: React.FC<LocationFilterProps> = ({ onSelectLocation, selectedLocation }) => {
  const { locations } = useArtwork();
  
  const warehouses = locations.filter(loc => loc.type === "warehouse");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6"
    >
      <h2 className="mb-4 text-lg font-medium">Standorte</h2>
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger 
            value="all" 
            onClick={() => onSelectLocation("all")}
            className={selectedLocation === "all" ? "border-b-2 border-primary" : ""}
          >
            Alle
          </TabsTrigger>
          {warehouses.map(warehouse => (
            <TabsTrigger 
              key={warehouse.id} 
              value={warehouse.id}
              onClick={() => onSelectLocation(warehouse.id)}
              className={selectedLocation === warehouse.id ? "border-b-2 border-primary" : ""}
            >
              {warehouse.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </motion.div>
  );
};
