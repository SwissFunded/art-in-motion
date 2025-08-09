import React, { useCallback, useMemo, useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { outline, boundingBox } from "@yudiel/react-qr-scanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useArtwork } from "@/context/ArtworkContext";
import { Camera, RefreshCcw, ShieldAlert } from "lucide-react";

interface QRCodeScannerProps {
  title?: string;
}

// QR Code payload expectations:
// We will support codes that contain either:
// - artwork customId (e.g., ART-2024-001)
// - artwork id (e.g., a1)
// - JSON string { customId: string } or { id: string }

export const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ title = "Scan QR Code" }) => {
  const { artworks, setSelectedArtwork } = useArtwork();
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");

  const constraints = useMemo(
    () => ({
      facingMode,
      aspectRatio: { ideal: 1.777 },
    }),
    [facingMode]
  );

  const parsePayload = (text: string): { id?: string; customId?: string } => {
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed === "object" && (parsed.id || parsed.customId)) {
        return { id: parsed.id, customId: parsed.customId };
      }
    } catch (_) {
      // not JSON → fall through
    }
    if (text.startsWith("ART-")) return { customId: text };
    if (/^[a-zA-Z]\d+$/i.test(text)) return { id: text };
    return { customId: text };
  };

  const findArtwork = useCallback(
    (payload: { id?: string; customId?: string }) => {
      if (payload.customId) {
        const found = artworks.find(a => a.customId?.toLowerCase() === payload.customId!.toLowerCase());
        if (found) return found;
      }
      if (payload.id) {
        const found = artworks.find(a => a.id.toLowerCase() === payload.id!.toLowerCase());
        if (found) return found;
      }
      return undefined;
    },
    [artworks]
  );

  const handleDecode = (result: string) => {
    if (!result || result === lastResult) return;
    setLastResult(result);
    setError(null);
    const payload = parsePayload(result);
    const artwork = findArtwork(payload);
    if (artwork) {
      setSelectedArtwork(artwork);
    } else {
      setError("Kein Kunstwerk mit diesem Code gefunden.");
    }
  };

  const handleError = (err: any) => {
    // Surface a readable error without spamming
    if (!error) setError("Kamera-Zugriff fehlgeschlagen oder nicht verfügbar.");
    // eslint-disable-next-line no-console
    console.error("QR Scanner error:", err);
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
            <Camera size={18} className="text-primary" />
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9"
              onClick={() => setFacingMode(prev => (prev === "environment" ? "user" : "environment"))}
              title="Kamera wechseln"
            >
              <RefreshCcw size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="rounded-lg overflow-hidden border border-border/50 bg-muted/40">
          <Scanner
            onScan={(detected) => {
              // get the first decoded text value
              const text = detected?.[0]?.rawValue ?? detected?.[0]?.content ?? "";
              if (text) handleDecode(text);
            }}
            onError={handleError}
            constraints={constraints as any}
            components={{ finder: false, tracker: (codes, ctx) => {
              // custom blue overlay
              ctx.lineWidth = 4;
              ctx.strokeStyle = "#1e66ff"; // blue
              boundingBox(codes, ctx);
              ctx.lineWidth = 2;
              ctx.strokeStyle = "#80aaff"; // lighter blue
              outline(codes, ctx);
            }}}
            containerStyle={{ width: "100%" }}
            videoStyle={{ width: "100%", height: "auto", objectFit: "cover" }}
          />
        </div>

        {lastResult && !error && (
          <p className="text-xs sm:text-sm text-muted-foreground mt-3 break-all">Zuletzt gescannt: {lastResult}</p>
        )}

        {error && (
          <div className="mt-3 flex items-start gap-2 text-destructive">
            <ShieldAlert size={16} className="mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QRCodeScanner;


