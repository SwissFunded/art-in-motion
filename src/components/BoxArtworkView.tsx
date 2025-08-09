import React, { useState } from "react";
import { useArtwork, Artwork } from "@/context/ArtworkContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin } from "lucide-react";
import { MoveArtworkDialog } from "./MoveArtworkDialog";
import { motion } from "framer-motion";

interface BoxArtworkViewProps {
  boxId: string;
  onBack: () => void;
}

export const BoxArtworkView: React.FC<BoxArtworkViewProps> = ({ boxId, onBack }) => {
  const { locations, getArtworksByContainer, getLocationById } = useArtwork();
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [selectedArtworkForMove, setSelectedArtworkForMove] = useState<Artwork | null>(null);

  const box = locations.find(l => l.id === boxId);
  const artworksInBox = getArtworksByContainer(boxId);

  if (!box) return <div>Box nicht gefunden</div>;

  const getLocationPath = (containerId: string): string => {
    const container = getLocationById(containerId);
    if (!container) return "Unbekannt";
    
    let path = container.name;
    let currentContainer = container;
    
    // Build path from bottom to top
    while (currentContainer?.parentId) {
      const parent = getLocationById(currentContainer.parentId);
      if (parent) {
        path = `${parent.name} > ${path}`;
        currentContainer = parent;
      } else {
        break;
      }
    }
    
    return path;
  };

  const handleMoveArtwork = (artwork: Artwork) => {
    setSelectedArtworkForMove(artwork);
    setMoveDialogOpen(true);
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      <Button 
        variant="outline" 
        onClick={onBack} 
        className="w-full sm:w-auto h-11 text-sm border-border/50 hover:bg-muted touch-manipulation"
      >
        <ArrowLeft className="mr-2" size={16} /> Zurück
      </Button>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg sm:text-xl font-medium mb-2 text-foreground">{box.name.toUpperCase()}</h2>
          <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
            <MapPin size={14} className="mr-1 shrink-0" />
            <span className="truncate">{getLocationPath(boxId)}</span>
          </div>
        </div>
        <Badge className="bg-primary/10 text-primary border-primary/20 font-medium text-xs sm:text-sm shrink-0 self-start sm:self-center">
          {artworksInBox.length} {artworksInBox.length === 1 ? "Kunstwerk" : "Kunstwerke"}
        </Badge>
      </div>

      {artworksInBox.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Keine Kunstwerke in dieser Box</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:gap-6">
          {artworksInBox.map(artwork => (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card className="border-border/50 hover:border-border transition-colors">
                <CardContent className="p-4 sm:p-6">
                  <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Artwork Image */}
                    <div className="lg:col-span-1">
                      <Card className="overflow-hidden bg-muted/30 border-border/50">
                        <img
                          src={artwork.image || `https://picsum.photos/400/300?random=${artwork.id}`}
                          alt={`${artwork.name} – Artwork image`}
                          className="w-full h-48 sm:h-64 lg:h-full object-cover"
                        />
                      </Card>
                    </div>
                    
                    {/* Artwork Details */}
                    <div className="lg:col-span-2 flex flex-col justify-between">
                      <div>
                        <div className="mb-4">
                          <CardTitle className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                            {artwork.name}
                          </CardTitle>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
                          <div>
                            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Artwork ID</h3>
                            <p className="text-foreground font-mono text-xs sm:text-sm">{artwork.customId}</p>
                          </div>
                          <div>
                            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Artwork Number</h3>
                            <p className="text-foreground font-mono text-xs sm:text-sm">{artwork.artworkNumber}</p>
                          </div>
                          <div>
                            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Künstler</h3>
                            <p className="text-foreground text-sm sm:text-base">{artwork.artist}</p>
                          </div>
                          <div>
                            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Jahr</h3>
                            <p className="text-foreground text-sm sm:text-base">{artwork.year}</p>
                          </div>
                          <div className="sm:col-span-2">
                            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Latest Location</h3>
                            <p className="text-foreground text-sm sm:text-base truncate">
                              {getLocationPath(artwork.containerId)}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Change Location Button */}
                      <div className="flex justify-stretch sm:justify-end">
                        <Button 
                          onClick={() => handleMoveArtwork(artwork)}
                          className="w-full sm:w-auto touch-manipulation h-11"
                        >
                          Change Location
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Move Artwork Dialog */}
      {selectedArtworkForMove && (
        <MoveArtworkDialog
          isOpen={moveDialogOpen}
          onClose={() => {
            setMoveDialogOpen(false);
            setSelectedArtworkForMove(null);
          }}
          artworkId={selectedArtworkForMove.id}
          artworkName={selectedArtworkForMove.name}
        />
      )}
    </div>
  );
};
