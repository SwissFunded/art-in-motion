
import React from "react";
import { useArtwork, Location } from "@/context/ArtworkContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useI18n } from "@/context/I18nContext";

interface LocationFilterProps {
  onSelectLocation: (locationId: string) => void;
  selectedLocation: string;
}

export const LocationFilter: React.FC<LocationFilterProps> = ({ onSelectLocation, selectedLocation }) => {
  const { locations } = useArtwork();
  const { t } = useI18n();
  
  const warehouses = locations.filter(loc => loc.type === "warehouse");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6"
    >
      <h3 className="section-header">{t('location.header')}</h3>
      <Tabs defaultValue="all">
        <TabsList className="h-12 p-1 grid w-full bg-muted rounded-xl overflow-x-auto" style={{ gridTemplateColumns: `repeat(${warehouses.length + 1}, minmax(80px, 1fr))` }}>
          <TabsTrigger 
            value="all" 
            onClick={() => onSelectLocation("all")}
            className="text-sm font-medium px-3 py-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-ios data-[state=active]:text-foreground whitespace-nowrap"
          >
            {t('location.all')}
          </TabsTrigger>
          {warehouses.map(warehouse => (
            <TabsTrigger 
              key={warehouse.id} 
              value={warehouse.id}
              onClick={() => onSelectLocation(warehouse.id)}
              className="text-sm font-medium px-3 py-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-ios data-[state=active]:text-foreground whitespace-nowrap"
            >
              {warehouse.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </motion.div>
  );
};
