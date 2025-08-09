import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QRCodeScanner } from "./QRCodeScanner";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Home, Camera, Mail } from "lucide-react";

export const QuickActions: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="h-8 sm:h-9"
        onClick={() => setOpen(true)}
        aria-label="Open quick actions"
      >
        <MoreHorizontal size={18} />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[90vw] max-w-sm">
          <DialogHeader>
            <DialogTitle>Quick Actions</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start h-11"
              onClick={() => {
                navigate("/");
                setOpen(false);
              }}
            >
              <Home size={18} className="mr-2" /> Return to Home
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-11"
              onClick={() => {
                setOpen(false);
                setScannerOpen(true);
              }}
            >
              <Camera size={18} className="mr-2" /> Scan QR Code
            </Button>
            <Button variant="outline" className="w-full justify-start h-11" asChild>
              <a href="mailto:support@artinmotion.app" className="inline-flex items-center w-full">
                <Mail size={18} className="mr-2" /> Contact us
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={scannerOpen} onOpenChange={setScannerOpen}>
        <DialogContent className="w-[95vw] max-w-2xl">
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
          </DialogHeader>
          <QRCodeScanner />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuickActions;


