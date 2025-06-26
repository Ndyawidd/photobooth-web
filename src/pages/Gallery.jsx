import React, { useState, useEffect } from "react";
import {
  Camera,
  Download,
  X,
  Edit2,
  Trash2,
  Save,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Gallery Component
const Gallery = ({ onBack, savedStrips, setSavedStrips }) => {
  const [filteredStrips, setFilteredStrips] = useState([]);
  const [selectedStrip, setSelectedStrip] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [editingStrip, setEditingStrip] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [selectedFrame, setSelectedFrame] = useState("classic");
  const navigate = useNavigate();

  const frames = [
    {
      id: "classic",
      name: "Classic",
      style: "border-4 border-white",
      bg: "bg-white",
    },
    {
      id: "modern",
      name: "Modern",
      style: "border-2 border-black",
      bg: "bg-gray-50",
    },
    {
      id: "vintage",
      name: "Vintage",
      style: "border-8 border-amber-100",
      bg: "bg-orange-50",
    },
    {
      id: "neon",
      name: "Neon",
      style: "border-4 border-pink-500",
      bg: "bg-purple-900",
    },
  ];

  const filters = [
    { name: "none", label: "Original", style: "filter: none" },
    { name: "grayscale", label: "B&W", style: "filter: grayscale(100%)" },
    { name: "sepia", label: "Vintage", style: "filter: sepia(70%)" },
    { name: "blur", label: "Soft", style: "filter: blur(1px)" },
    { name: "contrast", label: "Bold", style: "filter: contrast(130%)" },
    { name: "saturate", label: "Vivid", style: "filter: saturate(150%)" },
  ];

  useEffect(() => {
    // Initialize with savedStrips from props, or create demo data if empty
    if (savedStrips && savedStrips.length > 0) {
      setFilteredStrips(savedStrips);
    } else {
      // Demo data for when no strips exist yet
      const demoStrips = [
        {
          id: Date.now() - 1000,
          photos: [
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0cHgiIGZpbGw9IiM5OTk5OTkiPlNhbXBsZSBQaG90byAxPC90ZXh0Pjwvc3ZnPg==",
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0cHgiIGZpbGw9IiM5OTk5OTkiPlNhbXBsZSBQaG90byAyPC90ZXh0Pjwvc3ZnPg==",
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0cHgiIGZpbGw9IiM5OTk5OTkiPlNhbXBsZSBQaG90byAzPC90ZXh0Pjwvc3ZnPg==",
          ],
          filter: "none",
          timestamp: new Date().toISOString(),
          title: "Sample Strip",
          frame: "classic",
        },
      ];
      setFilteredStrips(demoStrips);
    }
  }, [savedStrips]);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...(savedStrips || [])];

    // Apply date filter
    if (filterBy !== "all") {
      const now = new Date();
      filtered = filtered.filter((strip) => {
        const stripDate = new Date(strip.timestamp);
        const diffTime = Math.abs(now - stripDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        switch (filterBy) {
          case "today":
            return diffDays <= 1;
          case "week":
            return diffDays <= 7;
          case "month":
            return diffDays <= 30;
          default:
            return true;
        }
      });
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((strip) => {
        const stripDate = new Date(strip.timestamp).toDateString();
        return (
          stripDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
          strip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          strip.filter.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    setFilteredStrips(filtered);
  }, [savedStrips, filterBy, searchTerm]);

  // Save edited strip
  const saveEditedStrip = () => {
    if (editingStrip && setSavedStrips) {
      const updatedStrip = {
        ...editingStrip,
        title: editTitle,
        frame: selectedFrame,
      };

      setSavedStrips((prevStrips) =>
        prevStrips.map((strip) =>
          strip.id === editingStrip.id ? updatedStrip : strip
        )
      );

      setEditingStrip(null);
      setSelectedStrip(updatedStrip);
    }
  };

  // Generate strip with frame and title for download
  const generateStripWithFrame = (strip) => {
    const stripCanvas = document.createElement("canvas");
    const ctx = stripCanvas.getContext("2d");

    const stripWidth = 400;
    const photoHeight = 280;
    const padding = 20;
    const headerHeight = 100;
    const frameWidth = 8;
    const stripHeight =
      headerHeight + photoHeight * 3 + padding * 4 + frameWidth * 2;

    stripCanvas.width = stripWidth;
    stripCanvas.height = stripHeight;

    // Background based on frame
    const frame = frames.find((f) => f.id === strip.frame) || frames[0];
    if (frame.id === "vintage") {
      ctx.fillStyle = "#fed7aa";
    } else if (frame.id === "neon") {
      ctx.fillStyle = "#581c87";
    } else if (frame.id === "modern") {
      ctx.fillStyle = "#f9fafb";
    } else {
      ctx.fillStyle = "white";
    }
    ctx.fillRect(0, 0, stripWidth, stripHeight);

    // Frame border
    if (frame.id === "modern") {
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ctx.strokeRect(
        frameWidth / 2,
        frameWidth / 2,
        stripWidth - frameWidth,
        stripHeight - frameWidth
      );
    } else if (frame.id === "neon") {
      ctx.strokeStyle = "#ec4899";
      ctx.lineWidth = 4;
      ctx.strokeRect(
        frameWidth / 2,
        frameWidth / 2,
        stripWidth - frameWidth,
        stripHeight - frameWidth
      );
    } else if (frame.id === "vintage") {
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 8;
      ctx.strokeRect(
        frameWidth / 2,
        frameWidth / 2,
        stripWidth - frameWidth,
        stripHeight - frameWidth
      );
    }

    // Header with title
    ctx.fillStyle = frame.id === "neon" ? "#ffffff" : "#000000";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "center";
    ctx.fillText(strip.title || "PHOTOBOOTH STRIP", stripWidth / 2, 40);

    ctx.font = "16px Arial";
    ctx.fillText(
      new Date(strip.timestamp).toLocaleDateString(),
      stripWidth / 2,
      65
    );

    // Draw photos with applied filter
    let loadedImages = 0;
    const filterStyle =
      filters.find((f) => f.name === strip.filter)?.style || "filter: none";

    strip.photos.forEach((photo, index) => {
      const img = new Image();
      img.onload = () => {
        const y = headerHeight + index * (photoHeight + padding) + padding;

        // Apply filter by drawing to temporary canvas first
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        const targetWidth = stripWidth - (padding + frameWidth) * 2;
        const targetHeight = photoHeight;

        tempCanvas.width = targetWidth;
        tempCanvas.height = targetHeight;
        // Hitung aspect ratio untuk maintain proporsi
        const imgAspect = img.width / img.height;
        const targetAspect = targetWidth / targetHeight;

        let drawWidth, drawHeight, drawX, drawY;

        if (imgAspect > targetAspect) {
          // Foto lebih lebar, crop horizontal
          drawHeight = targetHeight;
          drawWidth = drawHeight * imgAspect;
          drawX = (targetWidth - drawWidth) / 2;
          drawY = 0;
        } else {
          // Foto lebih tinggi, crop vertical
          drawWidth = targetWidth;
          drawHeight = drawWidth / imgAspect;
          drawX = 0;
          drawY = (targetHeight - drawHeight) / 2;
        }
        tempCtx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

        // Apply filter effects manually since canvas doesn't support CSS filters directly
        if (strip.filter === "grayscale") {
          const imageData = tempCtx.getImageData(
            0,
            0,
            tempCanvas.width,
            tempCanvas.height
          );
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            const gray =
              data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
            data[i] = gray;
            data[i + 1] = gray;
            data[i + 2] = gray;
          }
          tempCtx.putImageData(imageData, 0, 0);
        } else if (strip.filter === "sepia") {
          const imageData = tempCtx.getImageData(
            0,
            0,
            tempCanvas.width,
            tempCanvas.height
          );
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
            data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
            data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
          }
          tempCtx.putImageData(imageData, 0, 0);
        }

        ctx.drawImage(tempCanvas, padding + frameWidth, y);
        loadedImages++;

        if (loadedImages === strip.photos.length) {
          const link = document.createElement("a");
          link.download = `${
            strip.title.replace(/[^a-z0-9]/gi, "_") || "photobooth-strip"
          }-${strip.id}.jpg`;
          link.href = stripCanvas.toDataURL("image/jpeg", 0.9);
          link.click();
        }
      };
      img.src = photo;
    });
  };

  const deleteStrip = (stripId) => {
    if (confirm("Are you sure you want to delete this photo strip?")) {
      if (setSavedStrips) {
        setSavedStrips((prevStrips) =>
          prevStrips.filter((strip) => strip.id !== stripId)
        );
      }
      setSelectedStrip(null);
    }
  };

  const startEdit = (strip) => {
    setEditingStrip(strip);
    setEditTitle(strip.title || "");
    setSelectedFrame(strip.frame || "classic");
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const getFilterStyle = (filterName) => {
    const filter = filters.find((f) => f.name === filterName);
    return filter ? filter.style.replace("filter: ", "") : "none";
  };

  const getFramePreviewBg = (frameId) => {
    switch (frameId) {
      case "vintage":
        return "bg-orange-50 border-2 border-orange-200";
      case "neon":
        return "bg-purple-900 border-2 border-pink-500";
      case "modern":
        return "bg-gray-50 border-2 border-black";
      default:
        return "bg-white border-2 border-gray-200";
    }
  };

  const getFrameTextColor = (frameId) => {
    return frameId === "neon" ? "text-white" : "text-gray-700";
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold tracking-tight">
            <button onClick={() => navigate("/")}>snap.</button>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Capture
          </button>
        </div>
      </nav>

      <div className="pt-20 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Your Gallery
            </h1>
            <p className="text-gray-600">
              {filteredStrips.length} photo strip
              {filteredStrips.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search strips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              {/* Filter Dropdown */}
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>

          {/* Gallery Content */}
          {filteredStrips.length === 0 ? (
            <div className="text-center py-16">
              <Camera className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold mb-2">
                No photo strips found
              </h3>
              <p className="text-gray-500 mb-6">
                {!savedStrips || savedStrips.length === 0
                  ? "Go back to capture to create your first strip!"
                  : "Try adjusting your search or filter criteria."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStrips.map((strip) => (
                <div
                  key={strip.id}
                  className="bg-gray-50 rounded-2xl p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedStrip(strip)}
                >
                  {/* Strip Preview */}
                  <div
                    className={`space-y-2 mb-4 p-4 rounded-lg ${getFramePreviewBg(
                      strip.frame
                    )}`}
                  >
                    {/* Strip Header */}
                    <div
                      className={`text-center font-bold text-sm pb-2 border-b ${getFrameTextColor(
                        strip.frame
                      )} ${
                        strip.frame === "neon"
                          ? "border-pink-400"
                          : "border-gray-300"
                      }`}
                    >
                      {strip.title || "My Photo Strip"}
                    </div>
                    <div
                      className={`text-center text-xs ${getFrameTextColor(
                        strip.frame
                      )} opacity-75`}
                    >
                      {new Date(strip.timestamp).toLocaleDateString()}
                    </div>

                    {/* Photos in strip format */}
                    <div className="space-y-1">
                      {strip.photos.map((photo, index) => (
                        <div
                          key={index}
                          className="aspect-[4/3] bg-gray-200 rounded overflow-hidden"
                        >
                          <img
                            src={photo}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-full object-cover"
                            style={{
                              filter: getFilterStyle(strip.filter),
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strip Info */}
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>
                      {new Date(strip.timestamp).toLocaleDateString()}
                    </span>
                    <span className="capitalize bg-gray-200 px-2 py-1 rounded-full text-xs">
                      {strip.frame || "classic"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Strip Detail Modal */}
      {selectedStrip && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">{selectedStrip.title}</h2>
              <button
                onClick={() => setSelectedStrip(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Strip Display */}
            <div className="p-6">
              <div
                className={`p-4 rounded-lg mb-6 ${getFramePreviewBg(
                  selectedStrip.frame
                )}`}
              >
                {/* Strip Header */}
                <div
                  className={`text-center font-bold text-lg mb-2 ${getFrameTextColor(
                    selectedStrip.frame
                  )}`}
                >
                  {selectedStrip.title}
                </div>
                <div
                  className={`text-center text-sm ${getFrameTextColor(
                    selectedStrip.frame
                  )} opacity-75 mb-4`}
                >
                  {formatDate(selectedStrip.timestamp)}
                </div>

                {/* Photos */}
                <div className="space-y-2">
                  {selectedStrip.photos.map((photo, index) => (
                    <div
                      key={index}
                      className="aspect-[4/3] bg-gray-200 rounded overflow-hidden"
                    >
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                        style={{
                          filter: getFilterStyle(selectedStrip.filter),
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => startEdit(selectedStrip)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Edit2 size={16} />
                  Edit
                </button>

                <button
                  onClick={() => generateStripWithFrame(selectedStrip)}
                  className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <Download size={16} />
                  Download
                </button>

                <button
                  onClick={() => deleteStrip(selectedStrip.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingStrip && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">Edit Strip</h2>
              <button
                onClick={() => setEditingStrip(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Strip Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter strip title..."
                />
              </div>

              {/* Frame Selection */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Frame Style
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {frames.map((frame) => (
                    <button
                      key={frame.id}
                      onClick={() => setSelectedFrame(frame.id)}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        selectedFrame === frame.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className={`w-full h-16 rounded mb-2 ${frame.bg} ${frame.style} flex items-center justify-center text-xs`}
                      >
                        {frame.id === "neon" ? (
                          <span className="text-pink-400 font-bold">NEON</span>
                        ) : (
                          <span
                            className={
                              frame.id === "neon"
                                ? "text-white"
                                : "text-gray-600"
                            }
                          >
                            {frame.name.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-medium">{frame.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={saveEditedStrip}
                className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
