
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
        className="cursor-pointer hover:shadow-md transition-shadow duration-200"
        onClick={() => setSelectedArtwork(artwork)}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{artwork.name}</CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm text-gray-500">Künstler: {artwork.artist}</p>
          <p className="text-sm text-gray-500">Jahr: {artwork.year}</p>
        </CardContent>
        <CardFooter className="pt-0 flex justify-between items-center">
          <div>
            <Badge variant={
              artwork.containerType === "warehouse" ? "outline" : 
              (artwork.containerType === "etage" ? "secondary" : 
              artwork.containerType === "shelf" ? "default" : "outline")
            }>
              {containerTypeTranslations[artwork.containerType] || artwork.containerType}: {containerName}
            </Badge>
            <p className="text-xs text-gray-500 mt-1">{getLocationPath()}</p>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
