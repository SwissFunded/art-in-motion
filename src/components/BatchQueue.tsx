
import React, { useState } from 'react';
import { X, Move } from 'lucide-react';
import LocationSelector from './LocationSelector';
import { WAREHOUSE_LOCATIONS, STORIES, TABLES, BOXES } from '../services/fileMakerApi';
import { useLanguage } from '../context/LanguageContext';

interface BatchQueueProps {
  queuedItems: {
    artworkId: string;
    recordId: string;
    title: string;
  }[];
  onRemoveItem: (recordId: string) => void;
  onClearQueue: () => void;
  onMoveAll: (location: {
    warehouse: string;
    story: string;
    table: string;
    box: string;
  }) => Promise<void>;
  onClose: () => void;
}

const BatchQueue: React.FC<BatchQueueProps> = ({
  queuedItems,
  onRemoveItem,
  onClearQueue,
  onMoveAll,
  onClose
}) => {
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState({
    warehouse: WAREHOUSE_LOCATIONS[0],
    story: STORIES[0],
    table: TABLES[0],
    box: BOXES[0]
  });

  const handleMoveAll = async () => {
    if (queuedItems.length === 0) return;
    
    setError(null);
    setIsProcessing(true);
    
    try {
      await onMoveAll(selectedLocation);
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('artwork.updateFailed');
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 md:p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="p-3 md:p-4 bg-warehouse-blue text-white rounded-t-lg flex justify-between items-center">
          <h2 className="text-lg md:text-xl font-bold">{t('batch.title')}</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200"
            aria-label="Schließen"
          >
            <X size={20} className="md:w-6 md:h-6" />
          </button>
        </div>
        
        <div className="p-3 md:p-4 border-b">
          <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
            {queuedItems.length} {t('batch.inQueue')}
          </p>
          
          <div className="mb-3 md:mb-4">
            <h3 className="text-sm md:text-base font-medium mb-2">{t('batch.moveAllTo')}</h3>
            <LocationSelector
              initialLocation={selectedLocation}
              onLocationChange={setSelectedLocation}
              disabled={isProcessing}
            />
          </div>
          
          {error && (
            <div className="p-2 md:p-3 mb-3 md:mb-4 bg-red-100 border border-red-200 text-warehouse-red rounded text-sm">
              {error}
            </div>
          )}
          
          <div className="flex space-x-2 md:space-x-3">
            <button
              onClick={handleMoveAll}
              disabled={queuedItems.length === 0 || isProcessing}
              className={`flex-1 flex items-center justify-center px-3 md:px-4 py-2 rounded-md shadow-sm text-sm font-medium
                ${queuedItems.length > 0 && !isProcessing
                  ? 'bg-warehouse-green hover:bg-green-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              <Move size={16} className="mr-1 md:mr-2" />
              {isProcessing ? t('batch.processing') : `${t('batch.moveAll')} (${queuedItems.length})`}
            </button>
            
            <button
              onClick={onClearQueue}
              disabled={queuedItems.length === 0 || isProcessing}
              className={`px-3 md:px-4 py-2 rounded-md shadow-sm text-sm font-medium
                ${queuedItems.length > 0 && !isProcessing
                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
              {t('batch.clear')}
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-3 md:p-4">
          <ul className="divide-y">
            {queuedItems.map((item) => (
              <li key={item.recordId} className="py-2 md:py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm md:text-base truncate">{item.title}</p>
                  <p className="text-xs md:text-sm text-gray-500">{item.artworkId}</p>
                </div>
                <button
                  onClick={() => onRemoveItem(item.recordId)}
                  className="text-gray-400 hover:text-warehouse-red p-1"
                  disabled={isProcessing}
                  aria-label={t('batch.removeItem')}
                >
                  <X size={16} className="md:w-5 md:h-5" />
                </button>
              </li>
            ))}
            
            {queuedItems.length === 0 && (
              <li className="py-6 md:py-8 text-center text-gray-500 text-sm md:text-base">
                {t('batch.empty')}
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BatchQueue;
