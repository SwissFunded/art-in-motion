import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase, SUPABASE_TABLE } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";

export interface Artwork {
  id: string;
  customId: string; // Custom artwork ID for display
  name: string;
  artist: string;
  year: number;
  artworkNumber: string; // Artwork number/catalog number
  image?: string;
  locationId: string;
  containerType: "warehouse" | "etage" | "box";
  containerId: string;
}

export interface Location {
  id: string;
  name: string;
  type: "warehouse" | "etage" | "box";
  parentId?: string; // For hierarchy: etages within warehouses, boxes within etages
}

// Sample data with hierarchical structure
const initialLocations: Location[] = [
  // Warehouses
  { id: "w1", name: "Lagerhaus 1", type: "warehouse" },
  { id: "w2", name: "Lagerhaus 2", type: "warehouse" },
  { id: "w3", name: "Lagerhaus 3", type: "warehouse" },
  { id: "w4", name: "Lagerhaus 4", type: "warehouse" },
  
  // Etages (floors) in Warehouse 1
  { id: "e1", name: "Etage 1", type: "etage", parentId: "w1" },
  { id: "e2", name: "Etage 2", type: "etage", parentId: "w1" },
  { id: "e3", name: "Etage 3", type: "etage", parentId: "w1" },
  
  // Etages in Warehouse 2
  { id: "e4", name: "Etage 1", type: "etage", parentId: "w2" },
  { id: "e5", name: "Etage 2", type: "etage", parentId: "w2" },
  { id: "e6", name: "Etage 3", type: "etage", parentId: "w2" },
  
  // Etages in Warehouse 3
  { id: "e7", name: "Etage 1", type: "etage", parentId: "w3" },
  { id: "e8", name: "Etage 2", type: "etage", parentId: "w3" },
  
  // Etages in Warehouse 4
  { id: "e9", name: "Etage 1", type: "etage", parentId: "w4" },
  
  // Boxes directly in etages
  // Boxes in Etage 1 of Warehouse 1
  { id: "b1", name: "Box 1", type: "box", parentId: "e1" },
  { id: "b2", name: "Box 2", type: "box", parentId: "e1" },
  { id: "b3", name: "Box 3", type: "box", parentId: "e1" },
  { id: "b4", name: "Box 4", type: "box", parentId: "e1" },
  { id: "b5", name: "Box 5", type: "box", parentId: "e1" },
  { id: "b6", name: "Box 6", type: "box", parentId: "e1" },
  
  // Boxes in Etage 2 of Warehouse 1
  { id: "b7", name: "Box 7", type: "box", parentId: "e2" },
  { id: "b8", name: "Box 8", type: "box", parentId: "e2" },
  { id: "b9", name: "Box 9", type: "box", parentId: "e2" },
  { id: "b10", name: "Box 10", type: "box", parentId: "e2" },
  
  // Boxes in Etage 3 of Warehouse 1
  { id: "b11", name: "Box 11", type: "box", parentId: "e3" },
  { id: "b12", name: "Box 12", type: "box", parentId: "e3" },
  
  // Boxes in Etage 1 of Warehouse 2
  { id: "b13", name: "Box 13", type: "box", parentId: "e4" },
  { id: "b14", name: "Box 14", type: "box", parentId: "e4" },
  { id: "b15", name: "Box 15", type: "box", parentId: "e4" },
  { id: "b16", name: "Box 16", type: "box", parentId: "e4" },
  
  // Boxes in Etage 2 of Warehouse 2
  { id: "b17", name: "Box 17", type: "box", parentId: "e5" },
  { id: "b18", name: "Box 18", type: "box", parentId: "e5" },
  { id: "b19", name: "Box 19", type: "box", parentId: "e5" },
  
  // Boxes in Etage 3 of Warehouse 2
  { id: "b20", name: "Box 20", type: "box", parentId: "e6" },
  
  // Boxes in Etage 1 of Warehouse 3
  { id: "b21", name: "Box 21", type: "box", parentId: "e7" },
  { id: "b22", name: "Box 22", type: "box", parentId: "e7" },
  { id: "b23", name: "Box 23", type: "box", parentId: "e7" },
  
  // Boxes in Etage 2 of Warehouse 3
  { id: "b24", name: "Box 24", type: "box", parentId: "e8" },
  { id: "b25", name: "Box 25", type: "box", parentId: "e8" },
  { id: "b26", name: "Box 26", type: "box", parentId: "e8" },
  
  // Boxes in Etage 1 of Warehouse 4
  { id: "b27", name: "Box 27", type: "box", parentId: "e9" },
  { id: "b28", name: "Box 28", type: "box", parentId: "e9" },
  { id: "b29", name: "Box 29", type: "box", parentId: "e9" },
];

const initialArtworks: Artwork[] = [
  // Artworks in Warehouse 1
  {
    id: "a1",
    customId: "ART-2024-001",
    name: "Sonnenblumen",
    artist: "Klaus Meyer",
    year: 2020,
    artworkNumber: "KM-2020-01",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/47/Vincent_Willem_van_Gogh_128.jpg",
    locationId: "w1",
    containerType: "box",
    containerId: "b1"
  },
  {
    id: "a2",
    customId: "ART-2024-002",
    name: "Berglandschaft",
    artist: "Lena Schmidt",
    year: 2018,
    artworkNumber: "LS-2018-01",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/23/Fernand_L%C3%A9ger_-_Le_grand_d%C3%A9jeuner.jpg",
    locationId: "w1",
    containerType: "box",
    containerId: "b2"
  },
  {
    id: "a3",
    customId: "ART-2024-003",
    name: "Waldweg",
    artist: "Klaus Meyer",
    year: 2021,
    artworkNumber: "KM-2021-01",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Edgar_Degas_-_Blue_Dancers_-_Google_Art_Project.jpg",
    locationId: "w1",
    containerType: "box",
    containerId: "b3"
  },
  {
    id: "a4",
    customId: "ART-2024-004",
    name: "Stadtleben",
    artist: "Sarah Müller",
    year: 2019,
    artworkNumber: "SM-2019-01",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Claude_Monet_-_Impression%2C_Sunrise_-_Google_Art_Project.jpg",
    locationId: "w1",
    containerType: "box",
    containerId: "b4"
  },
  {
    id: "a5",
    customId: "ART-2024-005",
    name: "Segelboot",
    artist: "Thomas Weber",
    year: 2022,
    artworkNumber: "TW-2022-01",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6d/JMW_Turner_-_The_Fighting_Temeraire.jpg",
    locationId: "w1",
    containerType: "box",
    containerId: "b5"
  },
  {
    id: "a6",
    customId: "ART-2024-006",
    name: "Wolkenhimmel",
    artist: "Lena Schmidt",
    year: 2017,
    artworkNumber: "LS-2017-01",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
    locationId: "w1",
    containerType: "box",
    containerId: "b6"
  },
  {
    id: "a7",
    customId: "ART-2024-007",
    name: "Herbstwald",
    artist: "Klaus Meyer",
    year: 2019,
    artworkNumber: "KM-2019-01",
    locationId: "w1",
    containerType: "box",
    containerId: "b7"
  },
  {
    id: "a8",
    customId: "ART-2024-008",
    name: "Winterlandschaft",
    artist: "Sarah Müller",
    year: 2020,
    artworkNumber: "SM-2020-01",
    locationId: "w1",
    containerType: "box",
    containerId: "b8"
  },
  
  // Artworks in Warehouse 2
  {
    id: "a9",
    customId: "ART-2024-009",
    name: "Abstrakte Komposition",
    artist: "Martin Fischer",
    year: 2021,
    artworkNumber: "MF-2021-01",
    locationId: "w2",
    containerType: "box",
    containerId: "b13"
  },
  {
    id: "a10",
    customId: "ART-2024-010",
    name: "Moderne Stadt",
    artist: "Julia König",
    year: 2022,
    artworkNumber: "JK-2022-01",
    locationId: "w2",
    containerType: "box",
    containerId: "b14"
  },
  {
    id: "a11",
    customId: "ART-2024-011",
    name: "Wasserspiegelung",
    artist: "Martin Fischer",
    year: 2019,
    artworkNumber: "MF-2019-01",
    locationId: "w2",
    containerType: "etage",
    containerId: "e5"
  },
  {
    id: "a12",
    customId: "ART-2024-012",
    name: "Portraitstudie",
    artist: "Julia König",
    year: 2020,
    artworkNumber: "JK-2020-01",
    locationId: "w2",
    containerType: "etage",
    containerId: "e6"
  },
  
  // Artworks in Warehouse 3
  {
    id: "a13",
    customId: "ART-2024-013",
    name: "Farbexplosion",
    artist: "Felix Wagner",
    year: 2021,
    artworkNumber: "FW-2021-01",
    locationId: "w3",
    containerType: "box",
    containerId: "b21"
  },
  {
    id: "a14",
    customId: "ART-2024-014",
    name: "Geometrische Formen",
    artist: "Hannah Becker",
    year: 2020,
    artworkNumber: "HB-2020-01",
    locationId: "w3",
    containerType: "box",
    containerId: "b22"
  },
  {
    id: "a15",
    customId: "ART-2024-015",
    name: "Lichtspiel",
    artist: "Felix Wagner",
    year: 2022,
    artworkNumber: "FW-2022-01",
    locationId: "w3",
    containerType: "etage",
    containerId: "e8"
  },
  
  // Artworks in Warehouse 4
  {
    id: "a16",
    customId: "ART-2024-016",
    name: "Ozeanwellen",
    artist: "Eva Schulz",
    year: 2018,
    artworkNumber: "ES-2018-01",
    locationId: "w4",
    containerType: "warehouse",
    containerId: "w4"
  },
  {
    id: "a17",
    customId: "ART-2024-017",
    name: "Nebel im Tal",
    artist: "David Richter",
    year: 2023,
    artworkNumber: "DR-2023-01",
    locationId: "w4",
    containerType: "etage",
    containerId: "e9"
  }
];

interface ArtworkContextType {
  artworks: Artwork[];
  locations: Location[];
  moveArtwork: (artworkId: string, newContainerId: string, containerType: "warehouse" | "etage" | "box") => void;
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
  const [artworks, setArtworks] = useState<Artwork[]>(initialArtworks.map(a => ({ ...a, image: undefined })));
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const { data: locs, error: locErr } = await supabase
          .from('locations')
          .select('id,name,type,parentId');
        if (!locErr && Array.isArray(locs) && locs.length) {
          setLocations(locs as Location[]);
        }

        // Align to user's table schema: id, "Nummer", artist_name, location_raw, location_normalized, exhibitions
        // We'll map these into our Artwork shape with sensible defaults
        const { data: rows, error: artErr } = await supabase
          .from(SUPABASE_TABLE)
          .select('id, Nummer, artist_name, location_raw, location_normalized, exhibitions');
        if (!artErr && Array.isArray(rows) && rows.length) {
          const mapped: Artwork[] = rows.map((r: any, idx: number) => {
            const customId = String(r.Nummer ?? r.id ?? idx + 1);
            const locationNorm: string = r.location_normalized || r.location_raw || '';
            // Try to resolve container by normalized name
            const resolved = locations.find(l => l.name.toLowerCase() === locationNorm.toLowerCase());
            const containerId = resolved?.id || 'b1';
            const containerType = resolved?.type || 'box';
            return {
              id: String(r.id ?? customId),
              customId: String(customId),
              name: String(r.exhibitions || `Artwork ${customId}`),
              artist: String(r.artist_name || 'Unknown Artist'),
              year: new Date().getFullYear(),
              artworkNumber: String(customId),
              image: undefined,
              locationId: resolved?.parentId || 'w1',
              containerType: containerType as any,
              containerId,
            } as Artwork;
          });
          setArtworks(mapped);
        }
      } catch (e) {
        // keep fallback
      }
    };
    load();
  }, []);

  const moveArtwork = (artworkId: string, newContainerId: string, containerType: "warehouse" | "etage" | "box") => {
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
