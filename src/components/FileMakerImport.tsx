import React, { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, Image, MapPin, Database, AlertCircle, CheckCircle, X } from "lucide-react";
import { useI18n } from "@/context/I18nContext";
import { parseFileMakerFile, validateFileMakerFile, FileMakerData } from "@/lib/fileMakerParser";



export const FileMakerImport: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [importedData, setImportedData] = useState<FileMakerData | null>(null);
  const [previewData, setPreviewData] = useState<FileMakerData | null>(null);
  const { t } = useI18n();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const fmp12File = files.find(file => file.name.endsWith('.fmp12'));
    
    if (fmp12File) {
      await processFileMakerFile(fmp12File);
    } else {
      setErrorMessage('Please drop a .fmp12 file');
      setImportStatus('error');
    }
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.fmp12')) {
      await processFileMakerFile(file);
    } else {
      setErrorMessage('Please select a .fmp12 file');
      setImportStatus('error');
    }
  };

  const processFileMakerFile = async (file: File) => {
    try {
      // Validate file first
      if (!validateFileMakerFile(file)) {
        setErrorMessage('Invalid FileMaker file. Please select a valid .fmp12 file.');
        setImportStatus('error');
        return;
      }

      setImportStatus('processing');
      setImportProgress(0);
      setErrorMessage('');

      // Parse the FileMaker file
      setImportProgress(20);
      const fileMakerData = await parseFileMakerFile(file);
      
      setImportProgress(80);
      await new Promise(resolve => setTimeout(resolve, 500));

      setPreviewData(fileMakerData);
      setImportProgress(100);
      setImportStatus('success');

    } catch (error) {
      console.error('FileMaker import error:', error);
      setErrorMessage('Error processing FileMaker file. Please try again.');
      setImportStatus('error');
    }
  };

  const confirmImport = () => {
    if (previewData) {
      setImportedData(previewData);
      // Here you would typically save the data to your application state
      // or send it to your backend
      console.log('Importing FileMaker data:', previewData);
      
      // Reset for next import
      setPreviewData(null);
      setImportStatus('idle');
      setImportProgress(0);
    }
  };

  const resetImport = () => {
    setPreviewData(null);
    setImportedData(null);
    setImportStatus('idle');
    setImportProgress(0);
    setErrorMessage('');
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 sm:h-9 sm:w-9 rounded-full opacity-50 hover:opacity-100"
        onClick={() => setOpen(true)}
        aria-label="FileMaker Import (Hidden)"
        title="FileMaker Import (Hidden)"
      >
        <Database size={18} />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Database size={20} />
              FileMaker Data Import
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* File Upload Area */}
            <div className="space-y-4">
              <Label htmlFor="file-upload" className="text-sm font-medium">
                Select .fmp12 File
              </Label>
              
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">
                  Drop your .fmp12 file here
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  or click to browse
                </p>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".fmp12"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Browse Files
                </Button>
              </div>
            </div>

            {/* Progress and Status */}
            {importStatus === 'processing' && (
              <div className="space-y-2">
                <Label>Processing FileMaker data...</Label>
                <Progress value={importProgress} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  {importProgress < 50 
                    ? 'Reading file in chunks...' 
                    : 'Extracting artworks, images, and location data...'
                  }
                </p>
                {importProgress < 50 && (
                  <p className="text-xs text-muted-foreground">
                    Large file detected - processing in chunks for better performance
                  </p>
                )}
              </div>
            )}

            {/* Error Display */}
            {importStatus === 'error' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {/* Success Display */}
            {importStatus === 'success' && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  FileMaker data processed successfully! Review the data below.
                </AlertDescription>
              </Alert>
            )}

            {/* Data Preview */}
            {previewData && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Data Preview</h3>
                  <div className="flex gap-2">
                    <Button onClick={confirmImport} size="sm">
                      Confirm Import
                    </Button>
                    <Button onClick={resetImport} variant="outline" size="sm">
                      Reset
                    </Button>
                  </div>
                </div>

                                 {/* Artworks Preview */}
                 <div className="space-y-3">
                   <h4 className="font-medium flex items-center gap-2">
                     <Image size={16} />
                     Artworks ({previewData.artworks.length})
                   </h4>
                   <div className="grid gap-3 max-h-40 overflow-y-auto">
                     {previewData.artworks.map((artwork) => (
                       <div key={artwork.id} className="p-3 border rounded-lg bg-muted/30">
                         <div className="space-y-2">
                           <div className="flex items-start justify-between">
                             <div className="space-y-1">
                               <p className="font-medium">{artwork.title}</p>
                               <p className="text-sm text-muted-foreground">
                                 {artwork.artist} • {artwork.location}
                               </p>
                             </div>
                             {artwork.value && (
                               <span className="text-sm font-medium text-green-600">
                                 {artwork.value}
                               </span>
                             )}
                           </div>
                           <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                             <span>{artwork.dimensions}</span>
                             <span>{artwork.medium}</span>
                             <span>{artwork.year}</span>
                             <span>{artwork.category}</span>
                           </div>
                           {artwork.description && (
                             <p className="text-xs text-muted-foreground line-clamp-2">
                               {artwork.description}
                             </p>
                           )}
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>

                                 {/* Locations Preview */}
                 <div className="space-y-3">
                   <h4 className="font-medium flex items-center gap-2">
                     <MapPin size={16} />
                     Locations ({previewData.locations.length})
                   </h4>
                   <div className="grid gap-3 max-h-40 overflow-y-auto">
                     {previewData.locations.map((location) => (
                       <div key={location.id} className="p-3 border rounded-lg bg-muted/30">
                         <div className="space-y-2">
                           <div className="flex items-start justify-between">
                             <div className="space-y-1">
                               <p className="font-medium">{location.name}</p>
                               <p className="text-sm text-muted-foreground">
                                 {location.type || 'Location'}
                               </p>
                             </div>
                           </div>
                           <div className="space-y-1">
                             {location.address && (
                               <p className="text-sm text-muted-foreground">{location.address}</p>
                             )}
                             {location.city && location.country && (
                               <p className="text-xs text-muted-foreground">
                                 {location.city}, {location.country}
                               </p>
                             )}
                             {location.coordinates && (
                               <p className="text-xs text-muted-foreground">
                                 Coordinates: {location.coordinates.lat.toFixed(4)}, {location.coordinates.lng.toFixed(4)}
                               </p>
                             )}
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
              </div>
            )}

            {/* Imported Data Summary */}
            {importedData && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="font-medium text-green-800">Import Complete!</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-green-700">
                    Successfully imported {importedData.artworks.length} artworks and {importedData.locations.length} locations.
                  </p>
                  {importedData.metadata && (
                    <div className="text-xs text-green-600 space-y-1">
                      <p>Source: {importedData.metadata.sourceFile}</p>
                      <p>Import Date: {new Date(importedData.metadata.importDate).toLocaleString()}</p>
                    </div>
                  )}
                </div>
                <Button 
                  onClick={resetImport} 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                >
                  Import Another File
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FileMakerImport;
