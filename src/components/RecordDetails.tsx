
import React, { useState } from 'react';
import { ArrowLeft, Save, X } from 'lucide-react';
import { formatLocation } from '../services/fileMakerApi';
import LocationSelector from './LocationSelector';
import { useLanguage } from '../context/LanguageContext';

interface RecordDetailsProps {
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
  onSave: (
    recordId: string, 
    newLocation: {
      warehouse: string;
      story: string;
      table: string;
      box: string;
    }
  ) => Promise<void>;
  onCancel: () => void;
}

const RecordDetails: React.FC<RecordDetailsProps> = ({
  artworkId,
  recordId,
  title,
  artist,
  currentLocation,
  thumbnailUrl,
  onSave,
  onCancel
}) => {
  const { t } = useLanguage();
  const [selectedLocation, setSelectedLocation] = useState({
    warehouse: currentLocation.warehouse || '',
    story: currentLocation.story || '',
    table: currentLocation.table || '',
    box: currentLocation.box || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (
      selectedLocation.warehouse === currentLocation.warehouse &&
      selectedLocation.story === currentLocation.story &&
      selectedLocation.table === currentLocation.table &&
      selectedLocation.box === currentLocation.box
    ) {
      setError(t('artwork.locationUpdateError'));
      return;
    }

    setError(null);
    setIsSaving(true);
    
    try {
      // Ensure all required fields are present for the API call
      const locationToSave = {
        warehouse: selectedLocation.warehouse,
        story: selectedLocation.story || '',  // Provide default empty string if undefined
        table: selectedLocation.table || '',  // Provide default empty string if undefined
        box: selectedLocation.box || ''       // Provide default empty string if undefined
      };
      
      await onSave(recordId, locationToSave);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('artwork.updateFailed');
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const hasLocationChanged = 
    selectedLocation.warehouse !== currentLocation.warehouse ||
    selectedLocation.story !== currentLocation.story ||
    selectedLocation.table !== currentLocation.table ||
    selectedLocation.box !== currentLocation.box;

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto bg-white rounded-lg shadow">
      <div className="p-3 md:p-4 border-b bg-warehouse-blue text-white rounded-t-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-lg md:text-xl font-bold">{t('artwork.details')}</h2>
          <button 
            onClick={onCancel} 
            className="text-white hover:text-gray-200"
            aria-label="Schließen"
          >
            <X size={20} className="md:w-6 md:h-6" />
          </button>
        </div>
        <div className="text-xs md:text-sm opacity-80">{t('artwork.id')}: {artworkId}</div>
      </div>

      <div className="p-3 md:p-4 space-y-3 md:space-y-4">
        {thumbnailUrl && (
          <div className="flex justify-center">
            <img 
              src={thumbnailUrl} 
              alt={`${title} ${t('artwork.by')} ${artist}`} 
              className="w-32 h-32 md:w-40 md:h-40 object-cover rounded border border-gray-200" 
            />
          </div>
        )}

        <div className="space-y-1 md:space-y-2">
          <h3 className="text-md md:text-lg font-medium text-gray-900">{title}</h3>
          <p className="text-sm md:text-base text-gray-600">{t('artwork.by')} {artist}</p>
        </div>

        <div className="space-y-1 md:space-y-2">
          <label className="block text-sm font-medium text-gray-700">{t('artwork.currentLocation')}</label>
          <div className="px-3 py-2 bg-gray-100 border rounded text-gray-800 text-sm md:text-base">
            {formatLocation(currentLocation)}
          </div>
        </div>

        <div className="space-y-1 md:space-y-2">
          <div className="text-sm font-medium text-gray-700 mb-1 md:mb-2">{t('artwork.newLocation')}</div>
          <LocationSelector 
            initialLocation={{
              warehouse: currentLocation.warehouse,
              story: currentLocation.story || '',
              table: currentLocation.table || '',
              box: currentLocation.box || ''
            }}
            onLocationChange={setSelectedLocation}
            disabled={isSaving}
          />
        </div>

        {error && (
          <div className="p-2 md:p-3 bg-red-100 border border-red-200 text-warehouse-red rounded text-sm">
            {error}
          </div>
        )}

        <div className="flex space-x-2 md:space-x-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 flex items-center justify-center px-3 md:px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft size={16} className="mr-1 md:mr-2" />
            {t('artwork.back')}
          </button>
          
          <button
            onClick={handleSave}
            disabled={!hasLocationChanged || isSaving}
            className={`flex-1 flex items-center justify-center px-3 md:px-4 py-2 rounded-md shadow-sm text-sm font-medium
              ${hasLocationChanged && !isSaving 
                ? 'bg-warehouse-green hover:bg-green-600 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            <Save size={16} className="mr-1 md:mr-2" />
            {isSaving ? t('artwork.saving') : t('artwork.update')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordDetails;
