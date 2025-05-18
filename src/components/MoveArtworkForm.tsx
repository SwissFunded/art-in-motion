
import React, { useState } from "react";
import { useArtwork } from "@/context/ArtworkContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface MoveArtworkFormProps {
  artworkId: string;
}

export const MoveArtworkForm: React.FC<MoveArtworkFormProps> = ({ artworkId }) => {
  const { locations, moveArtwork } = useArtwork();
  
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(null);
  const [selectedEtage, setSelectedEtage] = useState<string | null>(null);
  const [selectedShelf, setSelectedShelf] = useState<string | null>(null);
  const [selectedBox, setSelectedBox] = useState<string | null>(null);
  const [containerType, setContainerType] = useState<"warehouse" | "etage" | "shelf" | "box">("box");
  
  const warehouses = locations.filter(location => location.type === "warehouse");
  const etages = locations.filter(location => location.type === "etage" && location.parentId === selectedWarehouse);
  const shelves = locations.filter(location => location.type === "shelf" && location.parentId === selectedEtage);
  const boxes = locations.filter(location => location.type === "box" && location.parentId === selectedShelf);

  const handleMoveArtwork = () => {
    let targetContainerId: string | null = null;
    
    switch (containerType) {
      case "warehouse":
        targetContainerId = selectedWarehouse;
        break;
      case "etage":
        targetContainerId = selectedEtage;
        break;
      case "shelf":
        targetContainerId = selectedShelf;
        break;
      case "box":
        targetContainerId = selectedBox;
        break;
    }
    
    if (targetContainerId) {
      moveArtwork(artworkId, targetContainerId, containerType);
    }
  };

  const isNextStepDisabled = () => {
    switch (containerType) {
      case "warehouse": return !selectedWarehouse;
      case "etage": return !selectedEtage;
      case "shelf": return !selectedShelf;
      case "box": return !selectedBox;
      default: return true;
    }
  };

  // Translations for tabs
  const containerTypeLabels = {
    "box": "Box",
    "shelf": "Regal",
    "etage": "Etage",
    "warehouse": "Lagerhaus"
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card>
        <CardContent className="p-4">
          <Tabs defaultValue="box" onValueChange={(value) => setContainerType(value as any)} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="box">{containerTypeLabels.box}</TabsTrigger>
              <TabsTrigger value="shelf">{containerTypeLabels.shelf}</TabsTrigger>
              <TabsTrigger value="etage">{containerTypeLabels.etage}</TabsTrigger>
              <TabsTrigger value="warehouse">{containerTypeLabels.warehouse}</TabsTrigger>
            </TabsList>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm mb-2">Lagerhaus auswählen:</p>
                <div className="grid grid-cols-2 gap-2">
                  {warehouses.map(warehouse => (
                    <Button
                      key={warehouse.id}
                      variant={selectedWarehouse === warehouse.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setSelectedWarehouse(warehouse.id);
                        setSelectedEtage(null);
                        setSelectedShelf(null);
                        setSelectedBox(null);
                      }}
                      className="justify-start"
                    >
                      {warehouse.name}
                    </Button>
                  ))}
                </div>
              </div>

              {(containerType === "etage" || containerType === "shelf" || containerType === "box") && selectedWarehouse && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-sm mb-2">Etage auswählen:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {etages.length > 0 ? etages.map(etage => (
                      <Button
                        key={etage.id}
                        variant={selectedEtage === etage.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setSelectedEtage(etage.id);
                          setSelectedShelf(null);
                          setSelectedBox(null);
                        }}
                        className="justify-start"
                      >
                        {etage.name}
                      </Button>
                    )) : <p className="text-gray-500 text-sm">Keine Etagen in diesem Lagerhaus gefunden</p>}
                  </div>
                </motion.div>
              )}

              {(containerType === "shelf" || containerType === "box") && selectedEtage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-sm mb-2">Regal auswählen:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {shelves.length > 0 ? shelves.map(shelf => (
                      <Button
                        key={shelf.id}
                        variant={selectedShelf === shelf.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setSelectedShelf(shelf.id);
                          setSelectedBox(null);
                        }}
                        className="justify-start"
                      >
                        {shelf.name}
                      </Button>
                    )) : <p className="text-gray-500 text-sm">Keine Regale in dieser Etage gefunden</p>}
                  </div>
                </motion.div>
              )}

              {containerType === "box" && selectedShelf && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-sm mb-2">Box auswählen:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {boxes.length > 0 ? boxes.map(box => (
                      <Button
                        key={box.id}
                        variant={selectedBox === box.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedBox(box.id)}
                        className="justify-start"
                      >
                        {box.name}
                      </Button>
                    )) : <p className="text-gray-500 text-sm">Keine Boxen in diesem Regal gefunden</p>}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="mt-6">
              <Button 
                disabled={isNextStepDisabled()} 
                onClick={handleMoveArtwork} 
                className="w-full"
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
