
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

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export const ArtworkDetailsModal: React.FC = () => {
  const { selectedArtwork, setSelectedArtwork, getLocationName } = useArtwork();

  if (!selectedArtwork) return null;

  const containerName = getLocationName(selectedArtwork.containerId);

  return (
    <Dialog open={!!selectedArtwork} onOpenChange={(open) => !open && setSelectedArtwork(null)}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg sm:text-xl pr-8">{selectedArtwork.name}</DialogTitle>
        </DialogHeader>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="pb-4"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-1">
              <Card className="overflow-hidden bg-muted/20 border-border/50">
                <img 
                  src={selectedArtwork.image || `https://picsum.photos/seed/${encodeURIComponent(selectedArtwork.id)}/600/800`} 
                  alt={`${selectedArtwork.name} – Artwork image`}
                  className="w-full h-48 sm:h-64 lg:h-80 object-cover"
                />
              </Card>
            </div>
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500">Artwork ID</h3>
                  <p className="font-mono text-xs sm:text-sm">{selectedArtwork.customId}</p>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500">Artwork Number</h3>
                  <p className="font-mono text-xs sm:text-sm">{selectedArtwork.artworkNumber}</p>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500">Künstler</h3>
                  <p className="text-sm sm:text-base">{selectedArtwork.artist}</p>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500">Jahr</h3>
                  <p className="text-sm sm:text-base">{selectedArtwork.year}</p>
                </div>
                <div className="sm:col-span-2">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500">Aktueller Standort</h3>
                  <p className="text-sm sm:text-base">
                    {(selectedArtwork.containerType === "warehouse" ? "Lagerhaus" : 
                      selectedArtwork.containerType === "etage" ? "Etage" : "Box")}:
                    {" "}{containerName}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
        </motion.div>
        <DialogFooter className="pt-4">
          <Button 
            onClick={() => setSelectedArtwork(null)}
            className="w-full sm:w-auto touch-manipulation h-11"
          >
            Schließen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
