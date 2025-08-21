
// Base FileMaker Data API service
const API_BASE_URL = "https://your-instance.cloud.claris.com/fmi/data/vLatest";
const DATABASE = "ArtDB";
const LAYOUT = "Artwork";

interface ArtworkRecord {
  fieldData: {
    ArtworkID: string;
    Title: string;
    Artist: string;
    CurrentLocation: {
      warehouse: string;
      story: string;
      table: string;
      box: string;
    };
    ThumbnailURL?: string;
  };
  recordId: string;
  portalData?: any;
  modId?: string;
}

interface ApiResponse {
  response: {
    data?: ArtworkRecord[];
    messages: { code: string; message: string }[];
  };
}

// Hardcoded location options - could be fetched from API
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

// Format location for display
export const formatLocation = (location: ArtworkRecord['fieldData']['CurrentLocation']): string => {
  const parts = [location.warehouse];
  if (location.story) parts.push(location.story);
  if (location.table) parts.push(location.table);
  if (location.box) parts.push(location.box);
  return parts.join(' > ');
};

const handleApiResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.messages?.[0]?.message || "API request failed");
  }
  return response.json();
};

export const fetchArtworkByCode = async (artworkId: string, token: string): Promise<ArtworkRecord | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/databases/${DATABASE}/layouts/${LAYOUT}/records?query=[{"ArtworkID":"${artworkId}"}]`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    
    const data = await handleApiResponse(response) as ApiResponse;
    
    if (data.response.data && data.response.data.length > 0) {
      return data.response.data[0];
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching artwork:", error);
    throw error;
  }
};

export const updateArtworkLocation = async (
  recordId: string,
  newLocation: {
    warehouse: string;
    story: string;
    table: string;
    box: string;
  },
  token: string
): Promise<boolean> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/databases/${DATABASE}/layouts/${LAYOUT}/records/${recordId}`,
      {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fieldData: {
            CurrentLocation: newLocation
          }
        })
      }
    );
    
    await handleApiResponse(response);
    return true;
  } catch (error) {
    console.error("Error updating location:", error);
    throw error;
  }
};

export const bulkUpdateLocations = async (
  recordUpdates: { 
    recordId: string; 
    location: {
      warehouse: string;
      story: string;
      table: string;
      box: string;
    }
  }[],
  token: string
): Promise<boolean> => {
  // Group updates into batches of 100 (FileMaker limit)
  const batchSize = 100;
  const batches = [];
  
  for (let i = 0; i < recordUpdates.length; i += batchSize) {
    batches.push(recordUpdates.slice(i, i + batchSize));
  }
  
  try {
    for (const batch of batches) {
      const records = batch.map(item => ({
        recordId: item.recordId,
        fieldData: {
          CurrentLocation: item.location
        }
      }));
      
      const response = await fetch(
        `${API_BASE_URL}/databases/${DATABASE}/layouts/${LAYOUT}/records`,
        {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ records })
        }
      );
      
      await handleApiResponse(response);
    }
    
    return true;
  } catch (error) {
    console.error("Error in bulk update:", error);
    throw error;
  }
};
