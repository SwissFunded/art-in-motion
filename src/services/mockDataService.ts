
// Mock data service to replace FileMaker API for testing purposes

export interface MockArtwork {
  recordId: string;
  fieldData: {
    ArtworkID: string;
    Title: string;
    Artist: string;
    CurrentLocation: {
      warehouse: string;
      story?: string;
      table?: string;
      box?: string;
    };
    ThumbnailURL?: string;
  };
}

// Sample artwork data
const SAMPLE_ARTWORKS: MockArtwork[] = [
  {
    recordId: "1",
    fieldData: {
      ArtworkID: "ART-1001",
      Title: "Starry Night",
      Artist: "Vincent van Gogh",
      CurrentLocation: {
        warehouse: "Gallery A",
        story: "Story 1",
        table: "Table A",
        box: "Box 3"
      },
      ThumbnailURL: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=150&auto=format&fit=crop"
    }
  },
  {
    recordId: "2",
    fieldData: {
      ArtworkID: "ART-1002",
      Title: "Mona Lisa",
      Artist: "Leonardo da Vinci",
      CurrentLocation: {
        warehouse: "Storage Room 1",
        story: "Story 3",
        table: "Table C",
        box: "Box 1"
      },
      ThumbnailURL: "https://images.unsplash.com/photo-1623857584158-23c769acb3c6?q=80&w=150&auto=format&fit=crop"
    }
  },
  {
    recordId: "3",
    fieldData: {
      ArtworkID: "ART-1003",
      Title: "The Persistence of Memory",
      Artist: "Salvador Dalí",
      CurrentLocation: {
        warehouse: "Restoration Studio",
        story: "Story 2",
        table: "Table B",
        box: "Box 4"
      },
      ThumbnailURL: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=150&auto=format&fit=crop"
    }
  },
  {
    recordId: "4",
    fieldData: {
      ArtworkID: "ART-1004",
      Title: "The Night Watch",
      Artist: "Rembrandt",
      CurrentLocation: {
        warehouse: "Gallery B",
        story: "Story 5",
        table: "Table E",
        box: "Box 2"
      },
      ThumbnailURL: "https://images.unsplash.com/photo-1577083552431-73ab7fee5e8a?q=80&w=150&auto=format&fit=crop"
    }
  },
  {
    recordId: "5",
    fieldData: {
      ArtworkID: "ART-1005",
      Title: "Girl with a Pearl Earring",
      Artist: "Johannes Vermeer",
      CurrentLocation: {
        warehouse: "Archive",
        story: "Story 4",
        table: "Table D",
        box: "Box 5"
      },
      ThumbnailURL: "https://images.unsplash.com/photo-1579762593175-20226054cad0?q=80&w=150&auto=format&fit=crop"
    }
  }
];

// Warehouse location structure
export const WAREHOUSE_LOCATIONS = [
  "Gallery A", 
  "Gallery B", 
  "Gallery C", 
  "Storage Room 1",
  "Storage Room 2",
  "Restoration Studio",
  "Shipping/Receiving", 
  "Archive", 
  "Vault",
  "Exhibition Hall"
];

// Each warehouse location has multiple stories
export const STORIES = ["Story 1", "Story 2", "Story 3", "Story 4", "Story 5"];

// Each story has multiple tables
export const TABLES = ["Table A", "Table B", "Table C", "Table D", "Table E"];

// Each table has multiple boxes
export const BOXES = ["Box 1", "Box 2", "Box 3", "Box 4", "Box 5"];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Format location for display
export const formatLocation = (location: MockArtwork['fieldData']['CurrentLocation']): string => {
  const parts = [location.warehouse];
  if (location.story) parts.push(location.story);
  if (location.table) parts.push(location.table);
  if (location.box) parts.push(location.box);
  return parts.join(' > ');
};

// Mock implementation of fetchArtworkByCode
export const mockFetchArtworkByCode = async (artworkId: string): Promise<MockArtwork | null> => {
  // Simulate API delay
  await delay(800);
  
  const artwork = SAMPLE_ARTWORKS.find(
    item => item.fieldData.ArtworkID.toLowerCase() === artworkId.toLowerCase()
  );
  
  return artwork || null;
};

// Mock implementation of updateArtworkLocation
export const mockUpdateArtworkLocation = async (
  recordId: string,
  newLocation: {
    warehouse: string;
    story: string;
    table: string;
    box: string;
  }
): Promise<boolean> => {
  // Simulate API delay
  await delay(1000);
  
  const artwork = SAMPLE_ARTWORKS.find(item => item.recordId === recordId);
  
  if (artwork) {
    artwork.fieldData.CurrentLocation = newLocation;
    return true;
  }
  
  return false;
};

// Mock implementation of bulkUpdateLocations
export const mockBulkUpdateLocations = async (
  recordUpdates: { 
    recordId: string; 
    location: {
      warehouse: string;
      story: string;
      table: string;
      box: string;
    }
  }[]
): Promise<boolean> => {
  // Simulate API delay
  await delay(1500);
  
  for (const update of recordUpdates) {
    const artwork = SAMPLE_ARTWORKS.find(item => item.recordId === update.recordId);
    if (artwork) {
      artwork.fieldData.CurrentLocation = update.location;
    }
  }
  
  return true;
};

// Function to simulate scanning a QR code from our sample data
export const simulateScan = (): string => {
  const randomIndex = Math.floor(Math.random() * SAMPLE_ARTWORKS.length);
  return SAMPLE_ARTWORKS[randomIndex].fieldData.ArtworkID;
};
