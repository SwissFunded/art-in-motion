
import React, { useState } from "react";
import { useArtwork } from "@/context/ArtworkContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface MoveArtworkFormProps {
  artworkId: string;
}

export const MoveArtworkForm: React.FC<MoveArtworkFormProps> = ({ artworkId }) => {
  const { locations, moveArtwork } = useArtwork();
  const [containerType, setContainerType] = useState<"warehouse" | "table" | "stage">("warehouse");
  const [containerId, setContainerId] = useState<string>("");

  const filteredLocations = locations.filter(loc => loc.type === containerType);

  const handleMove = () => {
    if (containerId) {
      moveArtwork(artworkId, containerId, containerType);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="container-type">Container Type</Label>
        <Select 
          value={containerType} 
          onValueChange={(value: "warehouse" | "table" | "stage") => {
            setContainerType(value);
            setContainerId("");
          }}
        >
          <SelectTrigger id="container-type">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="warehouse">Warehouse</SelectItem>
            <SelectItem value="table">Table</SelectItem>
            <SelectItem value="stage">Stage</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="container-location">Location</Label>
        <Select value={containerId} onValueChange={setContainerId}>
          <SelectTrigger id="container-location">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {filteredLocations.map(location => (
              <SelectItem key={location.id} value={location.id}>
                {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        onClick={handleMove}
        disabled={!containerId}
        className="w-full"
      >
        Move Artwork
      </Button>
    </div>
  );
};
