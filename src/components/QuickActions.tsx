import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QRCodeScanner } from "./QRCodeScanner";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Home, Camera, Mail } from "lucide-react";
import { useI18n } from "@/context/I18nContext";

export const QuickActions: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 sm:h-9 sm:w-9 rounded-full"
        onClick={() => setOpen(true)}
        aria-label="Open quick actions"
      >
        <MoreHorizontal size={18} />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[90vw] max-w-sm">
          <DialogHeader>
            <DialogTitle>{t('quick.title')}</DialogTitle>
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
              <Home size={18} className="mr-2" /> {t('quick.returnHome')}
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-11"
              onClick={() => {
                setOpen(false);
                setScannerOpen(true);
              }}
            >
              <Camera size={18} className="mr-2" /> {t('quick.scanQr')}
            </Button>
            <Button variant="outline" className="w-full justify-start h-11" asChild>
              <a href="mailto:support@artinmotion.app" className="inline-flex items-center w-full">
                <Mail size={18} className="mr-2" /> {t('quick.contactUs')}
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


