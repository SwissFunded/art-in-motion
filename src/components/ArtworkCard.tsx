
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
    "shelf": "Regal",
    "box": "Box"
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="cursor-pointer hover:shadow-md transition-all duration-200 active:scale-[0.98] border-border bg-card"
        onClick={() => setSelectedArtwork(artwork)}
      >
        <CardHeader className="pb-3 px-4 py-4 sm:px-6">
          <CardTitle className="text-base sm:text-lg text-card-foreground line-clamp-2">{artwork.name}</CardTitle>
        </CardHeader>
        <CardContent className="pb-3 px-4 sm:px-6">
          <p className="text-sm text-muted-foreground">Künstler: {artwork.artist}</p>
          <p className="text-sm text-muted-foreground">Jahr: {artwork.year}</p>
        </CardContent>
        <CardFooter className="pt-0 px-4 pb-4 sm:px-6 flex flex-col items-start gap-2">
          <Badge 
            variant={
              artwork.containerType === "warehouse" ? "outline" : 
              (artwork.containerType === "etage" ? "secondary" : 
              artwork.containerType === "shelf" ? "default" : "outline")
            }
            className="text-xs"
          >
            {containerTypeTranslations[artwork.containerType] || artwork.containerType}: {containerName}
          </Badge>
          <p className="text-xs text-muted-foreground line-clamp-2 w-full">{getLocationPath()}</p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
