import React, { useState, lazy, Suspense } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
const QRCodeScanner = lazy(() => import("./QRCodeScanner"));

export const QRCodeScanSection: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <section className="flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4 text-foreground">Scan QR Code</h2>
      <Button
        className="h-14 sm:h-14 px-8 sm:px-12 text-lg sm:text-xl"
        onClick={() => setOpen(true)}
      >
        <Camera size={24} className="mr-2" /> Open Camera
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[95vw] max-w-2xl">
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
          </DialogHeader>
          <Suspense fallback={<div className="p-6 text-center text-sm text-muted-foreground">Loading camera…</div>}>
            <QRCodeScanner title="Scan QR Code" />
          </Suspense>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default QRCodeScanSection;


