
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";

export interface Artwork {
  id: string;
  name: string;
  artist: string;
  year: number;
  image?: string;
  locationId: string;
  containerType: "warehouse" | "etage" | "shelf" | "box";
  containerId: string;
}

export interface Location {
  id: string;
  name: string;
  type: "warehouse" | "etage" | "shelf" | "box";
  parentId?: string; // For hierarchy: etages within warehouses, shelves within etages, etc.
}

// Sample data with hierarchical structure
const initialLocations: Location[] = [
  // Warehouses
  { id: "w1", name: "Warehouse 1", type: "warehouse" },
  { id: "w2", name: "Warehouse 2", type: "warehouse" },
  { id: "w3", name: "Warehouse 3", type: "warehouse" },
  { id: "w4", name: "Warehouse 4", type: "warehouse" },
  
  // Etages (floors) in Warehouse 1
  { id: "e1", name: "Etage 1", type: "etage", parentId: "w1" },
  { id: "e2", name: "Etage 2", type: "etage", parentId: "w1" },
  
  // Etages in Warehouse 2
  { id: "e3", name: "Etage 1", type: "etage", parentId: "w2" },
  { id: "e4", name: "Etage 2", type: "etage", parentId: "w2" },
  
  // Shelves in Etage 1 of Warehouse 1
  { id: "s1", name: "Shelf A", type: "shelf", parentId: "e1" },
  { id: "s2", name: "Shelf B", type: "shelf", parentId: "e1" },
  
  // Shelves in Etage 2 of Warehouse 1
  { id: "s3", name: "Shelf A", type: "shelf", parentId: "e2" },
  
  // Boxes in Shelf A of Etage 1
  { id: "b1", name: "Box 1", type: "box", parentId: "s1" },
  { id: "b2", name: "Box 2", type: "box", parentId: "s1" },
  
  // Boxes in Shelf B of Etage 1
  { id: "b3", name: "Box 1", type: "box", parentId: "s2" },
];

const initialArtworks: Artwork[] = [
  {
    id: "a1",
    name: "Artwork 1",
    artist: "Artist A",
    year: 2020,
    locationId: "w1",
    containerType: "box",
    containerId: "b1"
  },
  {
    id: "a2",
    name: "Artwork 2",
    artist: "Artist B",
    year: 2018,
    locationId: "w1",
    containerType: "box",
    containerId: "b2"
  },
  {
    id: "a3",
    name: "Artwork 3",
    artist: "Artist A",
    year: 2021,
    locationId: "w1",
    containerType: "box",
    containerId: "b3"
  },
  {
    id: "a4",
    name: "Artwork 4",
    artist: "Artist C",
    year: 2019,
    locationId: "w2",
    containerType: "etage",
    containerId: "e3"
  },
  {
    id: "a5",
    name: "Artwork 5",
    artist: "Artist D",
    year: 2022,
    locationId: "w3",
    containerType: "warehouse",
    containerId: "w3"
  },
  {
    id: "a6",
    name: "Artwork 6",
    artist: "Artist B",
    year: 2017,
    locationId: "w1",
    containerType: "box",
    containerId: "b1"
  },
];

interface ArtworkContextType {
  artworks: Artwork[];
  locations: Location[];
  moveArtwork: (artworkId: string, newContainerId: string, containerType: "warehouse" | "etage" | "shelf" | "box") => void;
  getLocationById: (id: string) => Location | undefined;
  getLocationName: (containerId: string) => string;
  getArtworksByLocation: (locationId: string) => Artwork[];
  getArtworksByContainer: (containerId: string) => Artwork[];
  getChildLocations: (parentId: string) => Location[];
  selectedArtwork: Artwork | null;
  setSelectedArtwork: (artwork: Artwork | null) => void;
}

const ArtworkContext = createContext<ArtworkContextType | undefined>(undefined);

export const ArtworkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [artworks, setArtworks] = useState<Artwork[]>(initialArtworks);
  const [locations] = useState<Location[]>(initialLocations);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const { toast } = useToast();

  const moveArtwork = (artworkId: string, newContainerId: string, containerType: "warehouse" | "etage" | "shelf" | "box") => {
    const container = locations.find(l => l.id === newContainerId);
    if (!container) return;

    setArtworks(prevArtworks => {
      return prevArtworks.map(artwork => {
        if (artwork.id === artworkId) {
          toast({
            title: "Artwork Moved",
            description: `${artwork.name} moved to ${container.name}`,
          });
          return {
            ...artwork,
            locationId: container.parentId || newContainerId,
            containerType,
            containerId: newContainerId
          };
        }
        return artwork;
      });
    });
  };

  const getLocationById = (id: string) => {
    return locations.find(location => location.id === id);
  };

  const getLocationName = (containerId: string) => {
    const location = locations.find(l => l.id === containerId);
    return location ? location.name : "Unknown";
  };

  const getArtworksByLocation = (locationId: string) => {
    return artworks.filter(artwork => artwork.locationId === locationId);
  };

  const getArtworksByContainer = (containerId: string) => {
    return artworks.filter(artwork => artwork.containerId === containerId);
  };

  const getChildLocations = (parentId: string) => {
    return locations.filter(location => location.parentId === parentId);
  };

  return (
    <ArtworkContext.Provider
      value={{
        artworks,
        locations,
        moveArtwork,
        getLocationById,
        getLocationName,
        getArtworksByLocation,
        getArtworksByContainer,
        getChildLocations,
        selectedArtwork,
        setSelectedArtwork
      }}
    >
      {children}
    </ArtworkContext.Provider>
  );
};

export const useArtwork = (): ArtworkContextType => {
  const context = useContext(ArtworkContext);
  if (context === undefined) {
    throw new Error("useArtwork must be used within an ArtworkProvider");
  }
  return context;
};
