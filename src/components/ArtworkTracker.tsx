import React, { useState, useCallback } from 'react';
import QRScanner from './QRScanner';
import RecordDetails from './RecordDetails';
import BatchQueue from './BatchQueue';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import { 
  fetchArtworkByCode, 
  updateArtworkLocation, 
  bulkUpdateLocations,
  formatLocation
} from '../services/fileMakerApi';
import {
  mockFetchArtworkByCode,
  mockUpdateArtworkLocation,
  mockBulkUpdateLocations,
  simulateScan
} from '../services/mockDataService';
import { Layers, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QueuedItem {
  artworkId: string;
  recordId: string;
  title: string;
}

interface Artwork {
  artworkId: string;
  recordId: string;
  title: string;
  artist: string;
  currentLocation: {
    warehouse: string;
    story?: string;
    table?: string;
    box?: string;
  };
  thumbnailUrl?: string;
}

const ArtworkTracker: React.FC = () => {
  const { token, clearToken, useDemoMode } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [currentView, setCurrentView] = useState<'scanner' | 'details'>('scanner');
  const [scannedArtworkId, setScannedArtworkId] = useState('');
  const [currentArtwork, setCurrentArtwork] = useState<Artwork | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [batchMode, setBatchMode] = useState(false);
  const [showBatchQueue, setShowBatchQueue] = useState(false);
  const [queuedItems, setQueuedItems] = useState<QueuedItem[]>([]);
  const [selectedBatchLocation, setSelectedBatchLocation] = useState({
    warehouse: "",
    shelf: "",
    box: ""
  });

  // For demo mode: Simulate scanning a QR code
  const handleDemoScan = useCallback(() => {
    const artworkId = simulateScan();
    handleScan(artworkId);
  }, []);

  const handleScan = useCallback(async (artworkId: string) => {
    setScannedArtworkId(artworkId);
    setError(null);
    setIsLoading(true);
    
    try {
      let artwork;
      
      if (useDemoMode) {
        artwork = await mockFetchArtworkByCode(artworkId);
      } else {
        artwork = await fetchArtworkByCode(artworkId, token!);
      }
      
      if (!artwork) {
        setError(`Artwork with ID ${artworkId} not found`);
        return;
      }
      
      const { fieldData, recordId } = artwork;
      
      const artworkData: Artwork = {
        artworkId: fieldData.ArtworkID,
        recordId,
        title: fieldData.Title,
        artist: fieldData.Artist,
        currentLocation: fieldData.CurrentLocation,
        thumbnailUrl: fieldData.ThumbnailURL
      };
      
      if (batchMode) {
        // Add to batch queue
        if (!queuedItems.some(item => item.recordId === recordId)) {
          setQueuedItems(prev => [...prev, {
            artworkId: fieldData.ArtworkID,
            recordId,
            title: fieldData.Title
          }]);
          
          toast({
            title: `${fieldData.Title}`,
            description: `${t('notifications.addedToQueue')}`,
          });
        } else {
          toast({
            title: `${fieldData.Title}`,
            description: `${t('notifications.alreadyInQueue')}`,
            variant: "destructive"
          });
        }
        
        // Stay in scanner view for batch mode
        setCurrentView('scanner');
      } else {
        // Single item mode
        setCurrentArtwork(artworkData);
        setCurrentView('details');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch artwork details';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [token, batchMode, queuedItems, toast, t, useDemoMode]);
  
  const handleUpdateLocation = useCallback(async (
    recordId: string, 
    newLocation: {
      warehouse: string;
      shelf: string;
      box: string;
    }
  ) => {
    setIsLoading(true);
    
    try {
      let success;
      
      if (useDemoMode) {
        success = await mockUpdateArtworkLocation(recordId, newLocation);
      } else {
        success = await updateArtworkLocation(recordId, newLocation, token!);
      }
      
      if (success) {
        toast({
          title: t('notifications.locationUpdated'),
          description: `${t('notifications.movedTo')} ${formatLocation(newLocation)}`,
          variant: "default"
        });
        
        // Return to scanner view after successful update
        setCurrentView('scanner');
        setCurrentArtwork(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('artwork.updateFailed');
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [token, toast, t, useDemoMode]);

  const handleBulkUpdate = useCallback(async (location: {
    warehouse: string;
    shelf: string;
    box: string;
  }) => {
    if (queuedItems.length === 0) return;
    
    try {
      const recordUpdates = queuedItems.map(item => ({
        recordId: item.recordId,
        location
      }));
      
      if (useDemoMode) {
        await mockBulkUpdateLocations(recordUpdates);
      } else {
        await bulkUpdateLocations(recordUpdates, token!);
      }
      
      toast({
        title: t('notifications.batchUpdateComplete'),
        description: `${queuedItems.length} ${t('notifications.itemsMoved')} ${formatLocation(location)}`,
        variant: "default"
      });
      
      // Clear queue after success
      setQueuedItems([]);
      setShowBatchQueue(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('artwork.updateFailed');
      throw new Error(errorMessage);
    }
  }, [queuedItems, token, toast, t, useDemoMode]);

  const removeQueueItem = (recordId: string) => {
    setQueuedItems(prev => prev.filter(item => item.recordId !== recordId));
  };

  const clearQueue = () => {
    setQueuedItems([]);
  };

  const toggleBatchMode = () => {
    setBatchMode(prev => !prev);
    if (queuedItems.length > 0) {
      toast({
        title: batchMode ? t('notifications.batchModeDisabled') : t('notifications.batchModeEnabled'),
        description: batchMode 
          ? t('notifications.switchToSingle')
          : t('notifications.scanMultiple')
      });
    }
  };

  const handleLogout = () => {
    clearToken();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-warehouse-blue text-white p-4 shadow-md">
        <div className="max-w-lg mx-auto flex justify-between items-center">
          <div className="flex items-center flex-col md:flex-row">
            <div className="flex items-center">
              <Layers className="mr-2" size={24} />
              <h1 className="text-xl font-bold">
                {t('app.title')}
              </h1>
            </div>
            <span className="text-sm md:ml-2 opacity-80">
              {t('app.subtitle')} {useDemoMode ? `(${t('app.demoMode')})` : ""}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            
            <button
              onClick={() => setShowBatchQueue(true)}
              disabled={queuedItems.length === 0}
              className={`relative p-2 rounded-full
                ${queuedItems.length > 0 
                  ? 'bg-blue-700 hover:bg-blue-800' 
                  : 'bg-blue-800 opacity-50'}`}
            >
              <Layers size={20} />
              {queuedItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {queuedItems.length}
                </span>
              )}
            </button>
            
            <button
              onClick={toggleBatchMode}
              className={`flex items-center px-3 py-1 text-sm rounded
                ${batchMode 
                  ? 'bg-green-600 text-white' 
                  : 'bg-blue-700 text-white'}`}
            >
              {batchMode ? (
                <>
                  <Check size={14} className="mr-1" />
                  {t('modes.batchActive')}
                </>
              ) : (
                t('modes.single')
              )}
            </button>
            
            <button
              onClick={handleLogout}
              className="text-sm hover:underline"
            >
              {t('actions.logout')}
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 p-4">
        <div className="max-w-lg mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-warehouse-blue border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">{t('actions.loading')}</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-100 border border-red-200 rounded-lg mb-4">
              <p className="text-warehouse-red font-medium">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setCurrentView('scanner');
                }}
                className="mt-2 text-sm text-warehouse-blue hover:text-blue-700"
              >
                {t('actions.backToScanner')}
              </button>
            </div>
          ) : currentView === 'scanner' ? (
            <>
              {useDemoMode && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">{t('demo.active')}</h3>
                  <p className="text-sm text-blue-700 mb-3">
                    {t('demo.description')}
                  </p>
                  <button
                    onClick={handleDemoScan}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    {t('demo.simulateScan')}
                  </button>
                </div>
              )}
              <QRScanner onScan={handleScan} />
            </>
          ) : currentView === 'details' && currentArtwork ? (
            <RecordDetails
              artworkId={currentArtwork.artworkId}
              recordId={currentArtwork.recordId}
              title={currentArtwork.title}
              artist={currentArtwork.artist}
              currentLocation={currentArtwork.currentLocation}
              thumbnailUrl={currentArtwork.thumbnailUrl}
              onSave={handleUpdateLocation}
              onCancel={() => {
                setCurrentView('scanner');
                setCurrentArtwork(null);
              }}
            />
          ) : null}
        </div>
      </main>
      
      {/* Batch queue modal */}
      {showBatchQueue && (
        <BatchQueue
          queuedItems={queuedItems}
          onRemoveItem={removeQueueItem}
          onClearQueue={clearQueue}
          onMoveAll={handleBulkUpdate}
          onClose={() => setShowBatchQueue(false)}
        />
      )}
    </div>
  );
};

export default ArtworkTracker;
