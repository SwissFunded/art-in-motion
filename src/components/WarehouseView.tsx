
import React, { useState } from "react";
import { useArtwork, Location } from "@/context/ArtworkContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Box, Warehouse, FolderOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

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

    return (
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
              <Badge variant="outline">{childLocations.length} {location.type === "warehouse" ? "etages" : location.type === "etage" ? "shelves" : "boxes"}</Badge>
            )}
            <Badge>{artworksInContainer.length} artwork{artworksInContainer.length !== 1 ? 's' : ''}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {artworksInContainer.length === 0 ? (
            <p className="text-sm text-gray-500">No artworks directly stored here.</p>
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
    );
  };

  const renderHierarchicalView = () => {
    if (currentView.boxId) {
      // Box view - show artworks in this box
      const box = locations.find(l => l.id === currentView.boxId);
      if (!box) return <div>Box not found</div>;
      return (
        <div>
          <Button variant="outline" onClick={navigateBack} className="mb-4">
            <ArrowLeft className="mr-2" size={16} /> Back to Shelf
          </Button>
          <h2 className="text-lg font-medium mb-4">{box.name} Contents</h2>
          {renderLocationCard(box)}
        </div>
      );
    }
    
    if (currentView.shelfId) {
      // Shelf view - show boxes in this shelf
      const shelf = locations.find(l => l.id === currentView.shelfId);
      if (!shelf) return <div>Shelf not found</div>;
      const boxes = getChildLocations(currentView.shelfId);

      return (
        <div>
          <Button variant="outline" onClick={navigateBack} className="mb-4">
            <ArrowLeft className="mr-2" size={16} /> Back to Etage
          </Button>
          <h2 className="text-lg font-medium mb-4">{shelf.name} Boxes</h2>
          {boxes.length === 0 ? (
            <p className="text-gray-500">No boxes on this shelf.</p>
          ) : (
            boxes.map(box => renderLocationCard(box))
          )}
        </div>
      );
    }
    
    if (currentView.etageId) {
      // Etage view - show shelves in this etage
      const etage = locations.find(l => l.id === currentView.etageId);
      if (!etage) return <div>Etage not found</div>;
      const shelves = getChildLocations(currentView.etageId);

      return (
        <div>
          <Button variant="outline" onClick={navigateBack} className="mb-4">
            <ArrowLeft className="mr-2" size={16} /> Back to Warehouse
          </Button>
          <h2 className="text-lg font-medium mb-4">{etage.name} Shelves</h2>
          {shelves.length === 0 ? (
            <p className="text-gray-500">No shelves on this etage.</p>
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
        <h2 className="text-lg font-medium mb-4">{warehouse?.name} Etages</h2>
        {etages.length === 0 ? (
          <p className="text-gray-500">No etages in this warehouse.</p>
        ) : (
          etages.map(etage => renderLocationCard(etage))
        )}
      </div>
    );
  };

  if (warehouses.length === 0) {
    return <div>No warehouses found</div>;
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">Warehouse Organization</h1>
      
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
