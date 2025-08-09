import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MoveArtworkForm } from "./MoveArtworkForm";
import { motion } from "framer-motion";

interface MoveArtworkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  artworkId: string;
  artworkName: string;
}

export const MoveArtworkDialog: React.FC<MoveArtworkDialogProps> = ({
  isOpen,
  onClose,
  artworkId,
  artworkName
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg sm:text-xl pr-8">
            Kunstwerk verschieben: {artworkName}
          </DialogTitle>
        </DialogHeader>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="pb-4"
        >
          <MoveArtworkForm artworkId={artworkId} onComplete={onClose} />
        </motion.div>
        
        <DialogFooter className="pt-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-full sm:w-auto touch-manipulation h-11"
          >
            Abbrechen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
