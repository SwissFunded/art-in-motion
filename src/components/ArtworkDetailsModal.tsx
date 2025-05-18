
import React from "react";
import { useArtwork } from "@/context/ArtworkContext";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MoveArtworkForm } from "./MoveArtworkForm";

export const ArtworkDetailsModal: React.FC = () => {
  const { selectedArtwork, setSelectedArtwork, getLocationName } = useArtwork();

  if (!selectedArtwork) return null;

  const containerName = getLocationName(selectedArtwork.containerId);

  return (
    <Dialog open={!!selectedArtwork} onOpenChange={(open) => !open && setSelectedArtwork(null)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{selectedArtwork.name}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Artist</h3>
              <p>{selectedArtwork.artist}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Year</h3>
              <p>{selectedArtwork.year}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Current Location</h3>
              <p>{selectedArtwork.containerType}: {containerName}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Move Artwork</h3>
            <MoveArtworkForm artworkId={selectedArtwork.id} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setSelectedArtwork(null)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
