
import React, { useState } from "react";
import { useArtwork } from "@/context/ArtworkContext";
import { ArtworkCard } from "./ArtworkCard";
import { LocationFilter } from "./LocationFilter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const ArtworksList: React.FC = () => {
  const { artworks } = useArtwork();
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredArtworks = artworks.filter(artwork => {
    const locationMatch = selectedLocation === "all" || artwork.locationId === selectedLocation;
    const searchMatch = artwork.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        artwork.artist.toLowerCase().includes(searchQuery.toLowerCase());
    return locationMatch && searchMatch;
  });

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Artworks</h1>
        <div className="max-w-xs">
          <Label htmlFor="search" className="sr-only">Search</Label>
          <Input
            id="search"
            type="text"
            placeholder="Search by name or artist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>
      </div>

      <LocationFilter 
        onSelectLocation={setSelectedLocation}
        selectedLocation={selectedLocation}
      />

      {filteredArtworks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No artworks found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArtworks.map(artwork => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      )}
    </div>
  );
};
