
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArtworksList } from "./ArtworksList";
import { WarehouseView } from "./WarehouseView";
import { ArtworkDetailsModal } from "./ArtworkDetailsModal";

export const Layout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("warehouses");
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Artwork Organizer</h1>
        <p className="text-gray-500">Manage and organize your physical artworks across warehouses, etages, shelves, and boxes.</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          <TabsTrigger value="artworks">All Artworks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="warehouses">
          <WarehouseView />
        </TabsContent>
        
        <TabsContent value="artworks">
          <ArtworksList />
        </TabsContent>
      </Tabs>
      
      <ArtworkDetailsModal />
    </div>
  );
};
