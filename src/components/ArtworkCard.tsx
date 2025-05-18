
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Artwork, useArtwork } from "@/context/ArtworkContext";

interface ArtworkCardProps {
  artwork: Artwork;
}

export const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork }) => {
  const { getLocationName, setSelectedArtwork } = useArtwork();

  const containerName = getLocationName(artwork.containerId);

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={() => setSelectedArtwork(artwork)}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{artwork.name}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-500">Artist: {artwork.artist}</p>
        <p className="text-sm text-gray-500">Year: {artwork.year}</p>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between items-center">
        <Badge variant={artwork.containerType === "warehouse" ? "outline" : 
               (artwork.containerType === "table" ? "secondary" : "default")}>
          {artwork.containerType}: {containerName}
        </Badge>
      </CardFooter>
    </Card>
  );
};
