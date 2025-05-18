
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";

export interface Artwork {
  id: string;
  name: string;
  artist: string;
  year: number;
  image?: string;
  locationId: string;
  containerType: "warehouse" | "table" | "stage";
  containerId: string;
}

export interface Location {
  id: string;
  name: string;
  type: "warehouse" | "table" | "stage";
  parentId?: string; // For tables within warehouses
}

// Sample data
const initialLocations: Location[] = [
  { id: "w1", name: "Warehouse 1", type: "warehouse" },
  { id: "w2", name: "Warehouse 2", type: "warehouse" },
  { id: "t1", name: "Table A", type: "table", parentId: "w1" },
  { id: "t2", name: "Table B", type: "table", parentId: "w1" },
  { id: "t3", name: "Table C", type: "table", parentId: "w2" },
  { id: "s1", name: "Stage 1", type: "stage", parentId: "w1" },
  { id: "s2", name: "Stage 2", type: "stage", parentId: "w2" },
];

const initialArtworks: Artwork[] = [
  {
    id: "a1",
    name: "Artwork 1",
    artist: "Artist A",
    year: 2020,
    locationId: "w1",
    containerType: "warehouse",
    containerId: "w1"
  },
  {
    id: "a2",
    name: "Artwork 2",
    artist: "Artist B",
    year: 2018,
    locationId: "w1",
    containerType: "table",
    containerId: "t1"
  },
  {
    id: "a3",
    name: "Artwork 3",
    artist: "Artist A",
    year: 2021,
    locationId: "w1",
    containerType: "table",
    containerId: "t2"
  },
  {
    id: "a4",
    name: "Artwork 4",
    artist: "Artist C",
    year: 2019,
    locationId: "w2",
    containerType: "warehouse",
    containerId: "w2"
  },
  {
    id: "a5",
    name: "Artwork 5",
    artist: "Artist D",
    year: 2022,
    locationId: "w2",
    containerType: "table",
    containerId: "t3"
  },
  {
    id: "a6",
    name: "Artwork 6",
    artist: "Artist B",
    year: 2017,
    locationId: "w1",
    containerType: "stage",
    containerId: "s1"
  },
];

interface ArtworkContextType {
  artworks: Artwork[];
  locations: Location[];
  moveArtwork: (artworkId: string, newContainerId: string, containerType: "warehouse" | "table" | "stage") => void;
  getLocationById: (id: string) => Location | undefined;
  getLocationName: (containerId: string) => string;
  getArtworksByLocation: (locationId: string) => Artwork[];
  getArtworksByContainer: (containerId: string) => Artwork[];
  selectedArtwork: Artwork | null;
  setSelectedArtwork: (artwork: Artwork | null) => void;
}

const ArtworkContext = createContext<ArtworkContextType | undefined>(undefined);

export const ArtworkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [artworks, setArtworks] = useState<Artwork[]>(initialArtworks);
  const [locations] = useState<Location[]>(initialLocations);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const { toast } = useToast();

  const moveArtwork = (artworkId: string, newContainerId: string, containerType: "warehouse" | "table" | "stage") => {
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
