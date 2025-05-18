
import React, { useState } from "react";
import { useArtwork, Location } from "@/context/ArtworkContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Box, Warehouse, FolderOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const WarehouseView: React.FC = () => {
  const { locations, getArtworksByContainer, setSelectedArtwork, getChildLocations } = useArtwork();
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>(locations.find(l => l.type === "warehouse")?.id || "");
  const [currentView, setCurrentView] = useState<{
    warehouseId: string;
    etageId?: string;
    shelfId?: string;
    boxId?: string;
  }>({ warehouseId: selectedWarehouse });

  const warehouses = locations.filter(loc => loc.type === "warehouse");
  
  const handleLocationClick = (location: Location) => {
    switch(location.type) {
      case "warehouse":
        setCurrentView({ warehouseId: location.id });
        setSelectedWarehouse(location.id);
        break;
      case "etage":
        setCurrentView({ warehouseId: currentView.warehouseId, etageId: location.id });
        break;
      case "shelf":
        setCurrentView({ 
          warehouseId: currentView.warehouseId, 
          etageId: currentView.etageId, 
          shelfId: location.id 
        });
        break;
      case "box":
        setCurrentView({ 
          warehouseId: currentView.warehouseId, 
          etageId: currentView.etageId, 
          shelfId: currentView.shelfId, 
          boxId: location.id 
        });
        break;
    }
  };

  const navigateBack = () => {
    if (currentView.boxId) {
      setCurrentView({ 
        warehouseId: currentView.warehouseId, 
        etageId: currentView.etageId, 
        shelfId: currentView.shelfId 
      });
    } else if (currentView.shelfId) {
      setCurrentView({ 
        warehouseId: currentView.warehouseId, 
        etageId: currentView.etageId 
      });
    } else if (currentView.etageId) {
      setCurrentView({ warehouseId: currentView.warehouseId });
    }
  };

  const renderLocationIcon = (locationType: string) => {
    switch(locationType) {
      case "warehouse": return <Warehouse size={18} />;
      case "etage": return <FolderOpen size={18} />;
      case "shelf": return <FolderOpen size={18} />;
      case "box": return <Box size={18} />;
      default: return <Box size={18} />;
    }
  };

  const renderLocationCard = (location: Location) => {
    const artworksInContainer = getArtworksByContainer(location.id);
    const childLocations = getChildLocations(location.id);
    const hasChildren = childLocations.length > 0;

    // Translations for location types
    const getLocationTypeLabel = (type: string, count: number = 1) => {
      switch(type) {
        case "warehouse": return count > 1 ? "Etagen" : "Etage";
        case "etage": return count > 1 ? "Regale" : "Regal";
        case "shelf": return count > 1 ? "Boxen" : "Box";
        default: return type;
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card 
          key={location.id} 
          className="mb-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => handleLocationClick(location)}
        >
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              {renderLocationIcon(location.type)}
              <span className="ml-2">{location.name}</span>
            </CardTitle>
            <div className="flex space-x-2">
              {hasChildren && (
                <Badge variant="outline">{childLocations.length} {getLocationTypeLabel(location.type, childLocations.length)}</Badge>
              )}
              <Badge>{artworksInContainer.length} Kunstwerk{artworksInContainer.length !== 1 ? 'e' : ''}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {artworksInContainer.length === 0 ? (
              <p className="text-sm text-gray-500">Keine Kunstwerke direkt hier gelagert.</p>
            ) : (
              <ul className="space-y-2">
                {artworksInContainer.map(artwork => (
                  <li 
                    key={artwork.id}
                    className="text-sm p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedArtwork(artwork);
                    }}
                  >
                    {artwork.name} - {artwork.artist}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderHierarchicalView = () => {
    if (currentView.boxId) {
      // Box view - show artworks in this box
      const box = locations.find(l => l.id === currentView.boxId);
      if (!box) return <div>Box nicht gefunden</div>;
      return (
        <div>
          <Button variant="outline" onClick={navigateBack} className="mb-4">
            <ArrowLeft className="mr-2" size={16} /> Zurück zum Regal
          </Button>
          <h2 className="text-lg font-medium mb-4">{box.name} Inhalt</h2>
          {renderLocationCard(box)}
        </div>
      );
    }
    
    if (currentView.shelfId) {
      // Shelf view - show boxes in this shelf
      const shelf = locations.find(l => l.id === currentView.shelfId);
      if (!shelf) return <div>Regal nicht gefunden</div>;
      const boxes = getChildLocations(currentView.shelfId);

      return (
        <div>
          <Button variant="outline" onClick={navigateBack} className="mb-4">
            <ArrowLeft className="mr-2" size={16} /> Zurück zur Etage
          </Button>
          <h2 className="text-lg font-medium mb-4">{shelf.name} Boxen</h2>
          {boxes.length === 0 ? (
            <p className="text-gray-500">Keine Boxen in diesem Regal.</p>
          ) : (
            boxes.map(box => renderLocationCard(box))
          )}
        </div>
      );
    }
    
    if (currentView.etageId) {
      // Etage view - show shelves in this etage
      const etage = locations.find(l => l.id === currentView.etageId);
      if (!etage) return <div>Etage nicht gefunden</div>;
      const shelves = getChildLocations(currentView.etageId);

      return (
        <div>
          <Button variant="outline" onClick={navigateBack} className="mb-4">
            <ArrowLeft className="mr-2" size={16} /> Zurück zum Lagerhaus
          </Button>
          <h2 className="text-lg font-medium mb-4">{etage.name} Regale</h2>
          {shelves.length === 0 ? (
            <p className="text-gray-500">Keine Regale in dieser Etage.</p>
          ) : (
            shelves.map(shelf => renderLocationCard(shelf))
          )}
        </div>
      );
    }
    
    // Warehouse view - show etages in this warehouse
    const etages = getChildLocations(currentView.warehouseId);
    const warehouse = locations.find(l => l.id === currentView.warehouseId);
    
    return (
      <div>
        <h2 className="text-lg font-medium mb-4">{warehouse?.name} Etagen</h2>
        {etages.length === 0 ? (
          <p className="text-gray-500">Keine Etagen in diesem Lagerhaus.</p>
        ) : (
          etages.map(etage => renderLocationCard(etage))
        )}
      </div>
    );
  };

  if (warehouses.length === 0) {
    return <div>Keine Lagerhäuser gefunden</div>;
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">Lagerhaus-Organisation</h1>
      
      <Tabs 
        value={selectedWarehouse} 
        onValueChange={(value) => {
          setSelectedWarehouse(value);
          setCurrentView({ warehouseId: value });
        }}
        className="w-full"
      >
        <TabsList className="mb-4">
          {warehouses.map(warehouse => (
            <TabsTrigger key={warehouse.id} value={warehouse.id}>
              {warehouse.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {warehouses.map(warehouse => (
          <TabsContent key={warehouse.id} value={warehouse.id} className="space-y-6">
            {renderHierarchicalView()}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
