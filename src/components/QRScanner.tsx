
import React, { useRef, useState, useEffect, useCallback } from 'react';
import jsQR from 'jsqr';
import { QrCode, Camera } from 'lucide-react';

interface QRScannerProps {
  onScan: (artworkId: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [scanTimeout, setScanTimeout] = useState<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Setup camera
  const setupCamera = useCallback(async () => {
    setScanning(true);
    setError('');

    try {
      // For mobile, prioritize rear camera with reasonable resolution
      const constraints = {
        video: { 
          facingMode: 'environment', // Use rear camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      // On mobile, try a more conservative approach if high res fails
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (e) {
        console.log("Trying fallback camera settings");
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
        }
      }
    } catch (err) {
      setError('Camera access denied or not available. Please check permissions.');
      setScanning(false);
      console.error("Camera error:", err);
    }
  }, []);

  // Scan frames for QR codes
  const scanVideoFrame = useCallback(() => {
    if (!canvasRef.current || !videoRef.current || !scanning) return;

    const video = videoRef.current;
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      // Video not ready yet
      timeoutRef.current = setTimeout(scanVideoFrame, 100);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code) {
        console.log("QR code found!", code.data);
        
        // Validate QR code format (e.g., ART-12345)
        const artworkIdRegex = /^ART-\d+$/;
        if (artworkIdRegex.test(code.data)) {
          // Stop scanning and call onScan
          stopScanning();
          onScan(code.data);
        }
      }
    } catch (err) {
      console.error("QR scanning error:", err);
    }

    // Continue scanning
    if (scanning) {
      timeoutRef.current = setTimeout(scanVideoFrame, 100);
    }
  }, [scanning, onScan]);

  const stopScanning = () => {
    setScanning(false);
    
    // Clear the timeout if it exists
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Stop all tracks on the stream
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Start scanning timeout
  useEffect(() => {
    if (scanning) {
      setScanTimeout(setTimeout(() => {
        if (scanning) {
          setError('QR code not found. Please try again or reposition.');
          setScanning(false);
        }
      }, 30000)); // 30 seconds timeout
      
      // Start scanning frames
      scanVideoFrame();
    }

    return () => {
      if (scanTimeout) {
        clearTimeout(scanTimeout);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [scanning, scanVideoFrame, scanTimeout]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopScanning();
      if (scanTimeout) {
        clearTimeout(scanTimeout);
      }
    };
  }, [scanTimeout]);

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Scan Artwork QR Code</h2>

      {error && (
        <div className="p-2 md:p-3 mb-3 md:mb-4 w-full text-warehouse-red bg-red-100 border border-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="scanner-viewport w-full h-52 sm:h-64 md:h-80 bg-black mb-3 md:mb-4 rounded-lg overflow-hidden">
        {scanning ? (
          <>
            <video 
              ref={videoRef} 
              className="w-full h-full" 
              autoPlay 
              playsInline 
              muted
              onLoadedMetadata={() => scanVideoFrame()}
            />
            <div className="scanner-target animate-pulse-border"></div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 text-white">
            <QrCode size={40} className="mb-2 md:mb-4" />
            <span className="text-sm md:text-base">Camera inactive</span>
          </div>
        )}
        {/* Hidden canvas for processing frames */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <button
        onClick={scanning ? stopScanning : setupCamera}
        className={`flex items-center justify-center w-full px-4 md:px-6 py-2 md:py-3 text-base md:text-lg font-medium rounded-lg 
          ${scanning 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-warehouse-blue hover:bg-blue-700 text-white'
          }`}
      >
        <Camera size={18} className="mr-2" />
        {scanning ? 'Stop Camera' : 'Start Camera'}
      </button>
    </div>
  );
};

export default QRScanner;
