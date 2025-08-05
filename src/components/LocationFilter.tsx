
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
      <h2 className="mb-3 text-base sm:text-lg font-medium text-foreground">Standorte</h2>
      <Tabs defaultValue="all">
        <TabsList className="mb-4 h-auto min-h-10 p-1 grid w-full overflow-x-auto" style={{ gridTemplateColumns: `repeat(${warehouses.length + 1}, minmax(80px, 1fr))` }}>
          <TabsTrigger 
            value="all" 
            onClick={() => onSelectLocation("all")}
            className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
          >
            Alle
          </TabsTrigger>
          {warehouses.map(warehouse => (
            <TabsTrigger 
              key={warehouse.id} 
              value={warehouse.id}
              onClick={() => onSelectLocation(warehouse.id)}
              className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
            >
              {warehouse.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </motion.div>
  );
};
