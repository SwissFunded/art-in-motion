
import React, { useState } from "react";
import { useArtwork, Location } from "@/context/ArtworkContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Warehouse, Table, MoveUp } from "lucide-react";

export const WarehouseView: React.FC = () => {
  const { locations, getArtworksByContainer, setSelectedArtwork } = useArtwork();
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>(locations.find(l => l.type === "warehouse")?.id || "");

  const warehouses = locations.filter(loc => loc.type === "warehouse");
  const tables = locations.filter(loc => loc.type === "table" && loc.parentId === selectedWarehouse);
  const stages = locations.filter(loc => loc.type === "stage" && loc.parentId === selectedWarehouse);

  const renderLocationCard = (location: Location, icon: React.ReactNode) => {
    const artworksInContainer = getArtworksByContainer(location.id);

    return (
      <Card key={location.id} className="mb-4">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            {icon}
            <span className="ml-2">{location.name}</span>
          </CardTitle>
          <Badge>{artworksInContainer.length} artwork{artworksInContainer.length !== 1 ? 's' : ''}</Badge>
        </CardHeader>
        <CardContent>
          {artworksInContainer.length === 0 ? (
            <p className="text-sm text-gray-500">No artworks currently stored here.</p>
          ) : (
            <ul className="space-y-2">
              {artworksInContainer.map(artwork => (
                <li 
                  key={artwork.id}
                  className="text-sm p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                  onClick={() => setSelectedArtwork(artwork)}
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

  if (warehouses.length === 0) {
    return <div>No warehouses found</div>;
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">Warehouse View</h1>
      
      <Tabs 
        value={selectedWarehouse} 
        onValueChange={setSelectedWarehouse}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-medium mb-4">Tables</h2>
                {tables.length === 0 ? (
                  <p className="text-gray-500">No tables in this warehouse.</p>
                ) : (
                  tables.map(table => renderLocationCard(table, <Table size={18} />))
                )}
              </div>
              
              <div>
                <h2 className="text-lg font-medium mb-4">Stages</h2>
                {stages.length === 0 ? (
                  <p className="text-gray-500">No stages in this warehouse.</p>
                ) : (
                  stages.map(stage => renderLocationCard(stage, <MoveUp size={18} />))
                )}
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-medium mb-4">Warehouse Storage</h2>
              {renderLocationCard(warehouse, <Warehouse size={18} />)}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
