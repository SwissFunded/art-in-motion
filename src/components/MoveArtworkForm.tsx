
import React, { useState } from "react";
import { useArtwork } from "@/context/ArtworkContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight } from "lucide-react";

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

  return (
    <Card>
      <CardContent className="p-4">
        <Tabs defaultValue="box" onValueChange={(value) => setContainerType(value as any)} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="box">Box</TabsTrigger>
            <TabsTrigger value="shelf">Shelf</TabsTrigger>
            <TabsTrigger value="etage">Etage</TabsTrigger>
            <TabsTrigger value="warehouse">Warehouse</TabsTrigger>
          </TabsList>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm mb-2">Select warehouse:</p>
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
              <div>
                <p className="text-sm mb-2">Select etage:</p>
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
                  )) : <p className="text-gray-500 text-sm">No etages found in this warehouse</p>}
                </div>
              </div>
            )}

            {(containerType === "shelf" || containerType === "box") && selectedEtage && (
              <div>
                <p className="text-sm mb-2">Select shelf:</p>
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
                  )) : <p className="text-gray-500 text-sm">No shelves found in this etage</p>}
                </div>
              </div>
            )}

            {containerType === "box" && selectedShelf && (
              <div>
                <p className="text-sm mb-2">Select box:</p>
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
                  )) : <p className="text-gray-500 text-sm">No boxes found on this shelf</p>}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6">
            <Button 
              disabled={isNextStepDisabled()} 
              onClick={handleMoveArtwork} 
              className="w-full"
            >
              Move Artwork <ArrowRight className="ml-2" size={16} />
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};
