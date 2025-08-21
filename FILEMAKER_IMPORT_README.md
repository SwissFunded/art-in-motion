# FileMaker Import Feature

## Overview
This feature allows you to import data from FileMaker Pro 12 (.fmp12) files directly into the Art-In-Motion application. It can extract artwork information, location data, and images from your FileMaker databases.

## How to Access
1. **Hidden Access**: The import feature is hidden but accessible through the Quick Actions menu
2. **Location**: Click the three dots (...) button in the header to open Quick Actions
3. **FileMaker Import**: Look for the small database icon at the bottom of the Quick Actions dialog

## Supported Data Types

### Artworks
- Title, Artist, Location
- Description, Dimensions, Medium
- Year, Category, Value
- Condition, Notes
- Images (from container fields)

### Locations
- Name, Address, City, Country
- Coordinates (latitude/longitude)
- Type (gallery, museum, etc.)
- Contact information

## How to Use

### Step 1: Prepare Your File
- Ensure your .fmp12 file contains the artwork and location data you want to import
- Make sure container fields with images are properly populated
- Verify that location coordinates are available if needed

### Step 2: Import Process
1. **Open Quick Actions**: Click the three dots (...) in the header
2. **Find FileMaker Import**: Look for the database icon at the bottom
3. **Upload File**: Either drag & drop your .fmp12 file or click to browse
4. **Review Data**: Preview the extracted data before confirming
5. **Confirm Import**: Click "Confirm Import" to finalize

### Step 3: Data Processing
- The system will parse your FileMaker file
- Extract artwork and location information
- Process images from container fields
- Validate data integrity
- Show preview of what will be imported

## Technical Details

### File Format Support
- **Primary**: .fmp12 (FileMaker Pro 12)
- **File Size**: Minimum 1MB (typical FileMaker files are several MB)
- **Binary Format**: Handles binary FileMaker database files

### Data Extraction
- **Table Parsing**: Extracts data from FileMaker tables
- **Field Mapping**: Maps FileMaker fields to application fields
- **Image Processing**: Handles container fields with images
- **Relationship Handling**: Maintains data relationships

### Import Validation
- File format verification
- Data integrity checks
- Duplicate detection
- Error handling and reporting

## Current Limitations

### Mock Implementation
- The current version uses mock data for demonstration
- Real .fmp12 parsing requires specialized FileMaker libraries
- Image extraction is simulated

### Production Considerations
- For production use, integrate with FileMaker Data API
- Use specialized .fmp12 parsing libraries
- Implement proper image extraction from container fields
- Add data validation and sanitization

## Future Enhancements

### Planned Features
- **Real .fmp12 Parsing**: Actual binary file parsing
- **Image Extraction**: Real image data from container fields
- **Data Mapping**: Custom field mapping interface
- **Batch Processing**: Multiple file imports
- **Export Functionality**: Export data back to FileMaker

### Integration Options
- **FileMaker Server**: Direct API integration
- **XML Export**: Convert .fmp12 to XML first
- **CSV Export**: Export to CSV for easier parsing
- **Database Sync**: Real-time synchronization

## Troubleshooting

### Common Issues
1. **File Not Recognized**: Ensure file has .fmp12 extension
2. **Import Fails**: Check file size and format
3. **Data Missing**: Verify FileMaker file structure
4. **Images Not Loading**: Check container field configuration

### Error Messages
- "Invalid FileMaker file": File format or size issue
- "Error processing file": Parsing or data extraction problem
- "No data found": File doesn't contain expected data structure

## Support

For technical support or feature requests:
- Check the application logs for detailed error information
- Verify your FileMaker file structure
- Ensure all required fields are populated
- Contact development team for advanced parsing needs

## Development Notes

### Component Structure
- `FileMakerImport.tsx`: Main import interface
- `fileMakerParser.ts`: Data parsing utilities
- `QuickActions.tsx`: Integration point

### Key Functions
- `parseFileMakerFile()`: Main parsing function
- `validateFileMakerFile()`: File validation
- `extractImagesFromFileMaker()`: Image extraction
- `convertFileMakerDataToAppFormat()`: Data conversion

### Customization
- Modify field mappings in the parser
- Adjust validation rules
- Customize data preview display
- Add new data types as needed
