import React, { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useArtwork } from "@/context/ArtworkContext";
import { Search, X } from "lucide-react";

interface GlobalSearchProps {
  placeholder?: string;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ placeholder = "Search artworks..." }) => {
  const { artworks, getLocationById, setSelectedArtwork } = useArtwork();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as typeof artworks;
    return artworks
      .map(a => ({
        item: a,
        score:
          (a.customId?.toLowerCase() === q ? 100 : 0) +
          (a.customId?.toLowerCase().includes(q) ? 40 : 0) +
          (a.artworkNumber?.toLowerCase().includes(q) ? 35 : 0) +
          (a.name.toLowerCase().includes(q) ? 30 : 0) +
          (a.artist.toLowerCase().includes(q) ? 25 : 0),
      }))
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(r => r.item);
  }, [artworks, query]);

  const onSelect = (id: string) => {
    const found = artworks.find(a => a.id === id);
    if (found) {
      setSelectedArtwork(found);
      setOpen(false);
      setQuery("");
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xs sm:w-40 lg:w-64">
      <div className="relative">
        <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="h-8 sm:h-9 pl-8 text-sm bg-background/50 border-border/50 focus:bg-background"
        />
        {query && (
          <button
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setQuery("")}
            aria-label="Clear"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {open && query && (
        <Card className="absolute z-50 mt-2 w-full border-border/50 bg-card/95 backdrop-blur-sm shadow-ios">
          <div className="max-h-80 overflow-auto py-1">
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">No results</div>
            ) : (
              filtered.map(a => (
                <button
                  key={a.id}
                  className="w-full text-left px-3 py-2 hover:bg-muted/60 transition-colors"
                  onClick={() => onSelect(a.id)}
                >
                  <div className="text-sm font-medium text-foreground line-clamp-1">{a.name}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    {a.artist} • {a.customId} • {getLocationById(a.containerId)?.name || "Unknown"}
                  </div>
                </button>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default GlobalSearch;


