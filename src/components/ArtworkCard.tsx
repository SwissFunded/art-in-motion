
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Artwork, useArtwork } from "@/context/ArtworkContext";
import { motion } from "framer-motion";

interface ArtworkCardProps {
  artwork: Artwork;
}

export const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork }) => {
  const { getLocationName, setSelectedArtwork, getLocationById } = useArtwork();

  const containerName = getLocationName(artwork.containerId);
  const container = getLocationById(artwork.containerId);
  
  // Generate the complete location path
  const getLocationPath = () => {
    let path = containerName;
    let currentContainer = container;
    
    if (!currentContainer) return path;
    
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

  // Container type translations
  const containerTypeTranslations: Record<string, string> = {
    "warehouse": "Lagerhaus",
    "etage": "Etage",
    "box": "Box"
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <Card 
        className="cursor-pointer transition-all duration-300 ease-out active:scale-[0.98] border-border/50 hover:border-border hover:shadow-ios bg-card/50 backdrop-blur-sm h-full flex flex-col touch-manipulation"
        onClick={() => setSelectedArtwork(artwork)}
      >
        <CardHeader className="p-3 sm:p-5 flex-1">
          <CardTitle className="text-base sm:text-lg font-semibold text-card-foreground line-clamp-2 mb-2 sm:mb-3">
            {artwork.name}
          </CardTitle>
          <div className="space-y-1.5 sm:space-y-2">
            <p className="text-xs text-muted-foreground font-mono truncate">
              ID: {artwork.customId}
            </p>
            <p className="text-xs text-muted-foreground font-mono truncate">
              Nr: {artwork.artworkNumber}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              <span className="font-medium">Künstler:</span> {artwork.artist}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              <span className="font-medium">Jahr:</span> {artwork.year}
            </p>
          </div>
        </CardHeader>
        <CardFooter className="p-3 sm:p-5 pt-0 space-y-2 sm:space-y-3">
          <div className="w-full">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-medium">
              {containerTypeTranslations[artwork.containerType] || artwork.containerType}
            </Badge>
          </div>
          <div className="w-full">
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              📍 {getLocationPath()}
            </p>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
