
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
import { motion } from "framer-motion";

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
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="py-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Künstler</h3>
              <p>{selectedArtwork.artist}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Jahr</h3>
              <p>{selectedArtwork.year}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Aktueller Standort</h3>
              <p>{selectedArtwork.containerType === "warehouse" ? "Lagerhaus" : 
                 selectedArtwork.containerType === "etage" ? "Etage" :
                 selectedArtwork.containerType === "shelf" ? "Regal" : "Box"}: {containerName}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Kunstwerk verschieben</h3>
            <MoveArtworkForm artworkId={selectedArtwork.id} />
          </div>
        </motion.div>
        <DialogFooter>
          <Button onClick={() => setSelectedArtwork(null)}>Schließen</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
