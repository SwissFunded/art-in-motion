
import React, { useState } from "react";
import { useArtwork } from "@/context/ArtworkContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface MoveArtworkFormProps {
  artworkId: string;
  onComplete?: () => void;
}

export const MoveArtworkForm: React.FC<MoveArtworkFormProps> = ({ artworkId, onComplete }) => {
  const { locations, moveArtwork } = useArtwork();
  
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(null);
  const [selectedEtage, setSelectedEtage] = useState<string | null>(null);
  const [selectedBox, setSelectedBox] = useState<string | null>(null);
  const [containerType, setContainerType] = useState<"warehouse" | "etage" | "box">("warehouse");
  
  const warehouses = locations.filter(location => location.type === "warehouse");
  const etages = locations.filter(location => location.type === "etage" && location.parentId === selectedWarehouse);
  const boxes = locations.filter(location => location.type === "box" && location.parentId === selectedEtage);

  const handleMoveArtwork = () => {
    let targetContainerId: string | null = null;
    
    switch (containerType) {
      case "warehouse":
        targetContainerId = selectedWarehouse;
        break;
      case "etage":
        targetContainerId = selectedEtage;
        break;
      case "box":
        targetContainerId = selectedBox;
        break;
    }
    
    if (targetContainerId) {
      moveArtwork(artworkId, targetContainerId, containerType);
      onComplete?.();
    }
  };

  const isNextStepDisabled = () => {
    switch (containerType) {
      case "warehouse": return !selectedWarehouse;
      case "etage": return !selectedEtage;
      case "box": return !selectedBox;
      default: return true;
    }
  };

  // Translations for tabs
  const containerTypeLabels = {
    "warehouse": "Lagerhaus",
    "etage": "Etage",
    "box": "Box"
  } as const;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card>
        <CardContent className="p-3 sm:p-4">
          <Tabs defaultValue="warehouse" onValueChange={(value) => setContainerType(value as any)} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4 h-10 sm:h-11">
              <TabsTrigger value="warehouse" className="text-xs sm:text-sm">{containerTypeLabels.warehouse}</TabsTrigger>
              <TabsTrigger value="etage" className="text-xs sm:text-sm">{containerTypeLabels.etage}</TabsTrigger>
              <TabsTrigger value="box" className="text-xs sm:text-sm">{containerTypeLabels.box}</TabsTrigger>
            </TabsList>
            
            <div className="space-y-3 sm:space-y-4">
              <div>
                <p className="text-sm mb-2">Lagerhaus auswählen:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {warehouses.map(warehouse => (
                    <Button
                      key={warehouse.id}
                      variant={selectedWarehouse === warehouse.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setSelectedWarehouse(warehouse.id);
                        setSelectedEtage(null);
                        setSelectedBox(null);
                      }}
                      className="justify-start h-10 touch-manipulation"
                    >
                      {warehouse.name}
                    </Button>
                  ))}
                </div>
              </div>

              {(containerType === "etage" || containerType === "box") && selectedWarehouse && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-sm mb-2">Etage auswählen:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {etages.length > 0 ? etages.map(etage => (
                      <Button
                        key={etage.id}
                        variant={selectedEtage === etage.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setSelectedEtage(etage.id);
                          setSelectedBox(null);
                        }}
                        className="justify-start h-10 touch-manipulation"
                      >
                        {etage.name}
                      </Button>
                    )) : <p className="text-gray-500 text-sm">Keine Etagen in diesem Lagerhaus gefunden</p>}
                  </div>
                </motion.div>
              )}

              {(containerType === "box") && selectedEtage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-sm mb-2">Box auswählen:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {boxes.length > 0 ? boxes.map(box => (
                      <Button
                        key={box.id}
                        variant={selectedBox === box.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedBox(box.id)}
                        className="justify-start h-10 touch-manipulation"
                      >
                        {box.name}
                      </Button>
                    )) : <p className="text-gray-500 text-sm">Keine Boxen in dieser Etage gefunden</p>}
                  </div>
                </motion.div>
              )}

              {/* Shelf step removed from UI */}
            </div>

            <div className="mt-4 sm:mt-6">
              <Button 
                disabled={isNextStepDisabled()} 
                onClick={handleMoveArtwork} 
                className="w-full h-11 touch-manipulation"
              >
                Kunstwerk verschieben <ArrowRight className="ml-2" size={16} />
              </Button>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};
