import React, { useState, lazy, Suspense } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/I18nContext";
import { Camera } from "lucide-react";
const QRCodeScanner = lazy(() => import("./QRCodeScanner"));

export const QRCodeScanSection: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  return (
    <section className="flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4 text-foreground">{t('qr.scanTitle')}</h2>
      <Button
        className="h-14 sm:h-14 px-8 sm:px-12 text-lg sm:text-xl"
        onClick={() => setOpen(true)}
      >
        <Camera size={24} className="mr-2" /> {t('qr.openCamera')}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[95vw] max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('qr.scanTitle')}</DialogTitle>
          </DialogHeader>
          <Suspense fallback={<div className="p-6 text-center text-sm text-muted-foreground">{t('qr.loading')}</div>}>
            <QRCodeScanner title="Scan QR Code" />
          </Suspense>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default QRCodeScanSection;


