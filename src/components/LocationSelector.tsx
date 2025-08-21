
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WAREHOUSE_LOCATIONS, STORIES, TABLES, BOXES } from '../services/fileMakerApi';

interface LocationSelectorProps {
  initialLocation: {
    warehouse: string;
    story?: string;
    table?: string;
    box?: string;
  };
  onLocationChange: (location: {
    warehouse: string;
    story: string;
    table: string;
    box: string;
  }) => void;
  disabled?: boolean;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  initialLocation,
  onLocationChange,
  disabled = false
}) => {
  const [selectedWarehouse, setSelectedWarehouse] = useState(initialLocation.warehouse || WAREHOUSE_LOCATIONS[0]);
  const [selectedStory, setSelectedStory] = useState(initialLocation.story || STORIES[0]);
  const [selectedTable, setSelectedTable] = useState(initialLocation.table || TABLES[0]);
  const [selectedBox, setSelectedBox] = useState(initialLocation.box || BOXES[0]);

  // Ensure we have default values for story, table and box
  const handleWarehouseChange = (value: string) => {
    setSelectedWarehouse(value);
    onLocationChange({
      warehouse: value,
      story: selectedStory,
      table: selectedTable,
      box: selectedBox
    });
  };

  const handleStoryChange = (value: string) => {
    setSelectedStory(value);
    onLocationChange({
      warehouse: selectedWarehouse,
      story: value,
      table: selectedTable,
      box: selectedBox
    });
  };

  const handleTableChange = (value: string) => {
    setSelectedTable(value);
    onLocationChange({
      warehouse: selectedWarehouse,
      story: selectedStory,
      table: value,
      box: selectedBox
    });
  };

  const handleBoxChange = (value: string) => {
    setSelectedBox(value);
    onLocationChange({
      warehouse: selectedWarehouse,
      story: selectedStory,
      table: selectedTable,
      box: value
    });
  };

  return (
    <div className="space-y-2 md:space-y-3">
      <div>
        <label htmlFor="warehouse" className="block text-sm font-medium text-gray-700 mb-1">Lager</label>
        <Select
          disabled={disabled}
          value={selectedWarehouse}
          onValueChange={handleWarehouseChange}
        >
          <SelectTrigger id="warehouse" className="w-full h-10 text-base md:h-10 md:text-sm">
            <SelectValue placeholder="Lagerort auswählen" />
          </SelectTrigger>
          <SelectContent className="z-50">
            {WAREHOUSE_LOCATIONS.map(warehouse => (
              <SelectItem key={warehouse} value={warehouse} className="text-base md:text-sm">
                {warehouse}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label htmlFor="story" className="block text-sm font-medium text-gray-700 mb-1">Story</label>
        <Select
          disabled={disabled}
          value={selectedStory}
          onValueChange={handleStoryChange}
        >
          <SelectTrigger id="story" className="w-full h-10 text-base md:h-10 md:text-sm">
            <SelectValue placeholder="Story auswählen" />
          </SelectTrigger>
          <SelectContent className="z-50">
            {STORIES.map(story => (
              <SelectItem key={story} value={story} className="text-base md:text-sm">
                {story}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label htmlFor="table" className="block text-sm font-medium text-gray-700 mb-1">Table</label>
        <Select
          disabled={disabled}
          value={selectedTable}
          onValueChange={handleTableChange}
        >
          <SelectTrigger id="table" className="w-full h-10 text-base md:h-10 md:text-sm">
            <SelectValue placeholder="Table auswählen" />
          </SelectTrigger>
          <SelectContent className="z-50">
            {TABLES.map(table => (
              <SelectItem key={table} value={table} className="text-base md:text-sm">
                {table}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label htmlFor="box" className="block text-sm font-medium text-gray-700 mb-1">Box</label>
        <Select
          disabled={disabled}
          value={selectedBox}
          onValueChange={handleBoxChange}
        >
          <SelectTrigger id="box" className="w-full h-10 text-base md:h-10 md:text-sm">
            <SelectValue placeholder="Box auswählen" />
          </SelectTrigger>
          <SelectContent className="z-50">
            {BOXES.map(box => (
              <SelectItem key={box} value={box} className="text-base md:text-sm">
                {box}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LocationSelector;
