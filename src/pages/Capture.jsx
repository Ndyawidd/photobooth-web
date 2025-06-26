import React, { useState, useRef, useCallback } from "react";
import {
  Camera,
  Upload,
  Download,
  Share2,
  RotateCcw,
  Palette,
  X,
  Check,
  ChevronRight,
  Timer,
} from "lucide-react";
import { useEffect } from "react";
import Gallery from "./Gallery";
import { useNavigate } from "react-router-dom";

const Capture = () => {
  const [photos, setPhotos] = useState([]);
  const [currentPhotoCount, setCurrentPhotoCount] = useState(0);
  const [isCamera, setIsCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [filter, setFilter] = useState("none");
  const [showFilters, setShowFilters] = useState(false);
  const [isCountdown, setIsCountdown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [photosComplete, setPhotosComplete] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [savedStrips, setSavedStrips] = useState([]);
  const navigate = useNavigate();

  const filters = [
    { name: "none", label: "Original", style: "filter: none" },
    { name: "grayscale", label: "B&W", style: "filter: grayscale(100%)" },
    { name: "sepia", label: "Vintage", style: "filter: sepia(70%)" },
    { name: "blur", label: "Soft", style: "filter: blur(1px)" },
    { name: "contrast", label: "Bold", style: "filter: contrast(130%)" },
    { name: "saturate", label: "Vivid", style: "filter: saturate(150%)" },
  ];

  useEffect(() => {
    if (videoRef.current && stream) {
      console.log("Attaching stream to video element");
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Countdown effect
  useEffect(() => {
    let timer;
    if (isCountdown && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (isCountdown && countdown === 0) {
      capturePhoto();
      setIsCountdown(false);
      setCountdown(3);
    }
    return () => clearTimeout(timer);
  }, [isCountdown, countdown]);

  useEffect(() => {
    // Update strip data ketika filter berubah dan photos sudah complete
    if (photosComplete && photos.length > 0) {
      setSavedStrips((prevStrips) => {
        const updatedStrips = prevStrips.map((strip, index) => {
          // Update strip terakhir (yang baru dibuat)
          if (index === 0) {
            return { ...strip, filter: filter };
          }
          return strip;
        });
        return updatedStrips;
      });
    }
  }, [filter, photosComplete, photos.length]);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      setStream(mediaStream);
      setIsCamera(true);
    } catch (err) {
      alert("Camera access denied. Please allow camera permission.");
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsCamera(false);
    }
  }, [stream]);

  // Start countdown for photo
  const startCountdown = () => {
    setIsCountdown(true);
    setCountdown(3);
  };

  // Save strip to storage
  const saveStripToStorage = (stripData) => {
    setSavedStrips((prevStrips) => {
      const updatedStrips = [stripData, ...prevStrips];
      console.log("Strip saved to savedStrips:", stripData);
      console.log("Total strips now:", updatedStrips.length);
      return updatedStrips;
    });
  };

  // Capture photo from camera
  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Mirror the image horizontally
      ctx.scale(-1, 1);
      ctx.drawImage(video, -canvas.width, 0);
      ctx.scale(-1, 1); // Reset transform

      const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9);
      const newPhotos = [...photos, imageDataUrl];
      setPhotos(newPhotos);
      setCurrentPhotoCount(currentPhotoCount + 1);

      if (currentPhotoCount + 1 >= 3) {
        setPhotosComplete(true);
        stopCamera();
        // Save strip data
        const stripData = {
          id: Date.now(),
          photos: newPhotos,
          filter: filter,
          timestamp: new Date().toISOString(),
          title: "My Photo Strip",
          frame: "classic",
        };
        console.log(filter);
        saveStripToStorage(stripData);
      }
    }
  }, [photos, currentPhotoCount, filter, stopCamera]);

  // Handle file upload (multiple files for strip)
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files).slice(0, 3);
    if (files.length > 0) {
      const promises = files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(promises).then((results) => {
        setPhotos(results);
        setCurrentPhotoCount(results.length);
        if (results.length >= 3) {
          setPhotosComplete(true);
          // Save strip data
          const stripData = {
            id: Date.now(),
            photos: results,
            filter: filter,
            timestamp: new Date().toISOString(),
            title: "My Photo Strip",
            frame: "classic",
          };
          saveStripToStorage(stripData);
        }
      });
    }
  };

  // Generate strip image for download
  // const generateStripImage = () => {
  //   const stripCanvas = document.createElement("canvas");
  //   const ctx = stripCanvas.getContext("2d");

  //   // Strip dimensions (typical photobooth strip ratio)
  //   const stripWidth = 400;
  //   const photoHeight = 300;
  //   const padding = 20;
  //   const headerHeight = 80;
  //   const stripHeight = headerHeight + photoHeight * 3 + padding * 4;

  //   stripCanvas.width = stripWidth;
  //   stripCanvas.height = stripHeight;

  //   // White background
  //   ctx.fillStyle = "white";
  //   ctx.fillRect(0, 0, stripWidth, stripHeight);

  //   // Header with branding
  //   ctx.fillStyle = "#000";
  //   ctx.font = "bold 24px Arial";
  //   ctx.textAlign = "center";
  //   ctx.fillText("PHOTOBOOTH STRIP", stripWidth / 2, 35);

  //   ctx.font = "14px Arial";
  //   ctx.fillText(new Date().toLocaleDateString(), stripWidth / 2, 55);

  //   // Draw photos
  //   photos.forEach((photo, index) => {
  //     const img = new Image();
  //     img.onload = () => {
  //       const y = headerHeight + index * (photoHeight + padding) + padding;
  //       ctx.drawImage(img, padding, y, stripWidth - padding * 2, photoHeight);

  //       // If this is the last photo, trigger download
  //       if (index === photos.length - 1) {
  //         const link = document.createElement("a");
  //         link.download = `photobooth-strip-${Date.now()}.jpg`;
  //         link.href = stripCanvas.toDataURL("image/jpeg", 0.9);
  //         link.click();
  //       }
  //     };
  //     img.src = photo;
  //   });
  // };

  // Reset everything
  const resetCapture = () => {
    setPhotos([]);
    setCurrentPhotoCount(0);
    setPhotosComplete(false);
    setFilter("none");
    setShowFilters(false);
    setIsCountdown(false);
    setCountdown(3);
    setShowGallery(false);
    stopCamera();
  };

  // Continue taking more photos
  const continuePhotos = () => {
    setPhotosComplete(false);
    startCamera();
  };

  // Show gallery view
  const viewInGallery = () => {
    console.log("Opening gallery with strips:", savedStrips);
    setShowGallery(true);
  };

  // Handle back from gallery
  const handleBackFromGallery = () => {
    console.log("Returning from gallery");
    setShowGallery(false);
  };

  if (showGallery) {
    return (
      <Gallery
        onBack={handleBackFromGallery}
        savedStrips={savedStrips}
        setSavedStrips={setSavedStrips}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold tracking-tight">
            <button onClick={() => navigate("/")}>snap.</button>
          </div>
          <div className="flex gap-3">
            {savedStrips.length > 0 && (
              <button
                onClick={viewInGallery}
                className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                Gallery ({savedStrips.length})
              </button>
            )}
            <button
              onClick={resetCapture}
              className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              New Strip
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-20 pb-8 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Photobooth Strip
            </h1>
            <p className="text-gray-600">
              Take 3 photos to create your strip
              {currentPhotoCount > 0 && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                  {currentPhotoCount}/3 photos taken
                </span>
              )}
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-gray-50 rounded-3xl p-8 mb-8">
            {/* Camera View */}
            {isCamera && !photosComplete && (
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden mb-6">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover bg-black"
                  style={{
                    transform: "scaleX(-1)",
                    backgroundColor: "black",
                    filter:
                      filters
                        .find((f) => f.name === filter)
                        ?.style.replace("filter: ", "") || "none",
                  }}
                />

                {/* Countdown Overlay */}
                {isCountdown && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-white text-8xl font-bold animate-pulse">
                      {countdown}
                    </div>
                  </div>
                )}

                {/* Photo Counter */}
                <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-full text-sm">
                  Photo {currentPhotoCount + 1} of 3
                </div>

                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                  <button
                    onClick={startCountdown}
                    disabled={isCountdown}
                    className="w-16 h-16 bg-white rounded-full border-4 border-gray-300 hover:border-black transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    {isCountdown ? (
                      <Timer className="w-8 h-8 text-black animate-spin" />
                    ) : (
                      <div className="w-8 h-8 bg-black rounded-full"></div>
                    )}
                  </button>
                </div>
                <button
                  onClick={stopCamera}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            {/* Photos Preview */}
            {photos.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-center">
                  Your Photos {photosComplete && "- Strip Complete!"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {photos.map((photo, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-gray-200 rounded-xl overflow-hidden"
                    >
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                        style={{
                          filter:
                            filters
                              .find((f) => f.name === filter)
                              ?.style.replace("filter: ", "") || "none",
                        }}
                      />
                    </div>
                  ))}
                  {/* Placeholder for remaining photos */}
                  {Array.from({ length: 3 - photos.length }, (_, index) => (
                    <div
                      key={`placeholder-${index}`}
                      className="aspect-square bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center"
                    >
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                  ))}
                </div>

                {/* Filter Controls */}
                {showFilters && (
                  <div className="mt-4 bg-white/90 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex gap-3 overflow-x-auto">
                      {filters.map((f) => (
                        <button
                          key={f.name}
                          onClick={() => setFilter(f.name)}
                          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                            filter === f.name
                              ? "bg-black text-white"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Upload/Capture Options */}
            {photos.length === 0 && !isCamera && (
              <div className="text-center py-16">
                <div className="grid sm:grid-cols-2 gap-6 max-w-lg mx-auto">
                  {/* Upload Button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-8 border-2 border-dashed border-gray-300 rounded-2xl hover:border-black hover:bg-gray-50 transition-all group"
                  >
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-black transition-colors" />
                    <div className="font-semibold mb-2">Upload Photos</div>
                    <div className="text-sm text-gray-500">
                      Choose 1-3 photos
                    </div>
                  </button>

                  {/* Camera Button */}
                  <button
                    onClick={startCamera}
                    className="p-8 border-2 border-dashed border-gray-300 rounded-2xl hover:border-black hover:bg-gray-50 transition-all group"
                  >
                    <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-black transition-colors" />
                    <div className="font-semibold mb-2">Take Photos</div>
                    <div className="text-sm text-gray-500">Use camera</div>
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {photos.length > 0 && (
              <div className="flex flex-wrap gap-4 justify-center">
                {!photosComplete && (
                  <button
                    onClick={continuePhotos}
                    className="px-6 py-3 bg-blue-500 text-white hover:bg-blue-600 rounded-full font-medium transition-colors flex items-center gap-2"
                  >
                    Continue Taking Photos
                    <ChevronRight size={18} />
                  </button>
                )}

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-full font-medium transition-colors flex items-center gap-2"
                >
                  <Palette size={18} />
                  Filters
                </button>

                {photosComplete && (
                  <>
                    {/* <button
                      onClick={generateStripImage}
                      className="px-6 py-3 bg-black text-white hover:bg-gray-800 rounded-full font-medium transition-colors flex items-center gap-2"
                    >
                      <Download size={18} />
                      Download Strip
                    </button> */}

                    <button
                      onClick={viewInGallery}
                      className="px-6 py-3 bg-green-500 text-white hover:bg-green-600 rounded-full font-medium transition-colors flex items-center gap-2"
                    >
                      View in Gallery
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}

                <button
                  onClick={resetCapture}
                  className="px-6 py-3 border border-gray-300 hover:bg-gray-50 rounded-full font-medium transition-colors flex items-center gap-2"
                >
                  <RotateCcw size={18} />
                  Start Over
                </button>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="text-center text-sm text-gray-500">
            <p>
              {!photosComplete
                ? "Tip: Make sure you have good lighting and stay in frame for all 3 photos"
                : "Your photobooth strip is ready! Download it or view in gallery"}
            </p>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        multiple
        className="hidden"
      />

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default Capture;
