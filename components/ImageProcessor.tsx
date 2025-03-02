"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, Download, Trash2, Crop, Image as ImageIcon, Repeat, Info, ChevronUp, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/useToast";
import { Slider } from "@/components/ui/slider";

interface ProcessedImage {
  id: string;
  name: string;
  originalFile: File;
  processedBlob: Blob;
  width: number;
  height: number;
  processType: string;
  format: string;
  optimization: string;
}

// Predefined aspect ratios
const ASPECT_RATIOS = {
  original: { label: "Original Ratio", value: "original" },
  "1:1": { label: "Square (1:1)", value: "1:1" },
  "4:3": { label: "Standard (4:3)", value: "4:3" },
  "16:9": { label: "Widescreen (16:9)", value: "16:9" },
  "21:9": { label: "Ultrawide (21:9)", value: "21:9" },
  "3:2": { label: "Classic (3:2)", value: "3:2" },
  "3:4": { label: "Portrait (3:4)", value: "3:4" },
  "9:16": { label: "Mobile (9:16)", value: "9:16" },
  custom: { label: "Custom", value: "custom" }
};

// Export formats
const EXPORT_FORMATS = [
  { label: "Original Format", value: "original" },
  { label: "JPEG", value: "image/jpeg" },
  { label: "PNG", value: "image/png" },
  { label: "WebP", value: "image/webp" }
];

// Optimization presets
const OPTIMIZATION_PRESETS = [
  { label: "None", value: "none" },
  { label: "Web (Smaller size)", value: "web" },
  { label: "Print (Higher quality)", value: "print" },
  { label: "Custom", value: "custom" }
];

const ImageProcessor: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [imageName, setImageName] = useState<string>('');
  const [targetWidth, setTargetWidth] = useState<number>(800);
  const [targetHeight, setTargetHeight] = useState<number>(600);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(true);
  const [quality, setQuality] = useState<number>(90);
  const [selectedProcessType, setSelectedProcessType] = useState<string>('resize');
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>("original");
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
  const [cropOrigin, setCropOrigin] = useState<string>("center");
  const [exportFormat, setExportFormat] = useState<string>("original");
  const [optimization, setOptimization] = useState<string>("none");
  const [showFAQ, setShowFAQ] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast, Toaster } = useToast();

  const resetForm = useCallback(() => {
    setOriginalImage(null);
    setPreviewUrl(null);
    setImageName('');
    setTargetWidth(800);
    setTargetHeight(600);
    setOriginalDimensions({ width: 0, height: 0 });
    setSelectedAspectRatio("original");
    setCropPosition({ x: 0, y: 0 });
    setCropOrigin("center");
    setExportFormat("original");
    setOptimization("none");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const processFile = useCallback((file: File) => {
    if (!file || !file.type.startsWith('image/')) return;

    // Auto-fill the name field with the filename (without extension)
    const fileName = file.name.replace(/\.[^/.]+$/, "");
    setImageName(fileName);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPreviewUrl(event.target.result as string);
        
        // Get image dimensions
        const img = new Image();
        img.onload = () => {
          setOriginalDimensions({ width: img.width, height: img.height });
          setTargetWidth(img.width);
          setTargetHeight(img.height);
        };
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
    setOriginalImage(file);
    
    toast({
      title: "Image uploaded",
      description: `${file.name} (${Math.round(file.size / 1024)} KB)`,
    });
  }, [toast, setImageName, setPreviewUrl, setOriginalDimensions, setTargetWidth, setTargetHeight, setOriginalImage]);
  
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const processImage = useCallback(() => {
    if (!originalImage || !previewUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Set canvas dimensions to target dimensions
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply selected process type
      switch (selectedProcessType) {
        case 'resize':
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
          break;
        case 'crop':
          // For crop, we calculate which part of the original image to use
          const aspectRatio = targetWidth / targetHeight;
          const imgAspectRatio = img.width / img.height;
          
          let sourceX, sourceY, sourceWidth, sourceHeight;
          
          if (imgAspectRatio > aspectRatio) {
            // Original is wider, crop sides
            sourceHeight = img.height;
            sourceWidth = img.height * aspectRatio;
            
            // Apply crop position based on origin
            switch (cropOrigin) {
              case "left":
                sourceX = 0;
                break;
              case "right":
                sourceX = img.width - sourceWidth;
                break;
              case "custom":
                // Use custom crop position (normalized to image dimensions)
                sourceX = Math.min(
                  Math.max(0, Math.round(cropPosition.x * (img.width - sourceWidth))), 
                  img.width - sourceWidth
                );
                break;
              case "center":
              default:
                sourceX = (img.width - sourceWidth) / 2;
                break;
            }
            sourceY = 0;
          } else {
            // Original is taller, crop top/bottom
            sourceWidth = img.width;
            sourceHeight = img.width / aspectRatio;
            sourceX = 0;
            
            // Apply crop position based on origin
            switch (cropOrigin) {
              case "top":
                sourceY = 0;
                break;
              case "bottom":
                sourceY = img.height - sourceHeight;
                break;
              case "custom":
                // Use custom crop position (normalized to image dimensions)
                sourceY = Math.min(
                  Math.max(0, Math.round(cropPosition.y * (img.height - sourceHeight))), 
                  img.height - sourceHeight
                );
                break;
              case "center":
              default:
                sourceY = (img.height - sourceHeight) / 2;
                break;
            }
          }
          
          ctx.drawImage(
            img,
            sourceX, sourceY, sourceWidth, sourceHeight,
            0, 0, targetWidth, targetHeight
          );
          break;
        case 'letterbox':
          // Fill with black background
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, targetWidth, targetHeight);
          
          // Calculate letterbox dimensions
          const imgRatio = img.width / img.height;
          const targetRatio = targetWidth / targetHeight;
          
          let drawWidth, drawHeight, drawX, drawY;
          
          if (imgRatio > targetRatio) {
            // Image is wider, letterbox top/bottom
            drawWidth = targetWidth;
            drawHeight = targetWidth / imgRatio;
            drawX = 0;
            drawY = (targetHeight - drawHeight) / 2;
          } else {
            // Image is taller, letterbox sides
            drawHeight = targetHeight;
            drawWidth = targetHeight * imgRatio;
            drawX = (targetWidth - drawWidth) / 2;
            drawY = 0;
          }
          
          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
          break;
      }

      // Determine output format
      const outputFormat = exportFormat === "original" 
        ? originalImage.type 
        : exportFormat;

      // Convert canvas to Blob
      canvas.toBlob((blob) => {
        if (blob) {
          const newProcessedImage: ProcessedImage = {
            id: Date.now().toString(),
            name: imageName || 'Untitled',
            originalFile: originalImage,
            processedBlob: blob,
            width: targetWidth,
            height: targetHeight,
            processType: selectedProcessType,
            format: outputFormat,
            optimization: optimization
          };
          
          setProcessedImages(prev => [...prev, newProcessedImage]);
          setSelectedImageId(newProcessedImage.id);
          
          toast({
            title: "Image processed!",
            description: `${selectedProcessType} to ${targetWidth}×${targetHeight}`,
          });
        }
      }, outputFormat, quality / 100);
    };
    img.src = previewUrl;
  }, [originalImage, previewUrl, targetWidth, targetHeight, selectedProcessType, cropOrigin, cropPosition, exportFormat, quality, optimization, imageName]);

  const downloadImage = useCallback((image: ProcessedImage) => {
    const url = URL.createObjectURL(image.processedBlob);
    const a = document.createElement('a');
    a.href = url;
    
    // Get the appropriate file extension based on the format
    let extension = "jpg";
    if (image.format === "image/png") {
      extension = "png";
    } else if (image.format === "image/webp") {
      extension = "webp";
    } else if (originalImage) {
      // If original format, use the original extension
      extension = originalImage.name.split('.').pop() || 'jpg';
    }
    
    a.download = `${image.name}_${image.width}x${image.height}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Image downloaded",
      description: `${a.download} has been saved to your device`,
    });
  }, [originalImage]);

  const deleteProcessedImage = (id: string) => {
    setProcessedImages(prev => prev.filter(img => img.id !== id));
    if (selectedImageId === id) {
      setSelectedImageId(null);
    }
  };

  // For handling aspect ratio
  const updateTargetDimensions = useCallback((dimension: 'width' | 'height', value: number) => {
    if (dimension === 'width') {
      setTargetWidth(value);
      if (maintainAspectRatio && originalDimensions.width && originalDimensions.height) {
        const aspectRatio = selectedAspectRatio === "original" 
          ? originalDimensions.width / originalDimensions.height
          : selectedAspectRatio === "custom" 
            ? targetWidth / targetHeight
            : parseAspectRatio(selectedAspectRatio);
        
        setTargetHeight(Math.round(value / aspectRatio));
      }
    } else {
      setTargetHeight(value);
      if (maintainAspectRatio && originalDimensions.width && originalDimensions.height) {
        const aspectRatio = selectedAspectRatio === "original" 
          ? originalDimensions.width / originalDimensions.height
          : selectedAspectRatio === "custom" 
            ? targetWidth / targetHeight
            : parseAspectRatio(selectedAspectRatio);
        
        setTargetWidth(Math.round(value * aspectRatio));
      }
    }
  }, [maintainAspectRatio, originalDimensions, selectedAspectRatio, targetWidth, targetHeight]);

  // Parse aspect ratio string (e.g. "16:9") to a number
  const parseAspectRatio = (ratio: string): number => {
    if (ratio === "original" || ratio === "custom") {
      return originalDimensions.width / originalDimensions.height;
    }
    
    const [width, height] = ratio.split(':').map(Number);
    return width / height;
  };

  // Handle aspect ratio selection
  const handleAspectRatioChange = useCallback((value: string) => {
    setSelectedAspectRatio(value);
    
    if (value !== "custom" && value !== "original" && originalDimensions.width > 0) {
      const ratio = parseAspectRatio(value);
      
      // Keep the current width and adjust height based on the new ratio
      const newHeight = Math.round(targetWidth / ratio);
      setTargetHeight(newHeight);
    }
  }, [originalDimensions, targetWidth]);

  // Apply optimization preset
  const applyOptimizationPreset = useCallback((preset: string) => {
    setOptimization(preset);
    
    switch (preset) {
      case "web":
        setQuality(80);
        break;
      case "print":
        setQuality(95);
        break;
      case "none":
      default:
        setQuality(90);
        break;
    }
  }, []);

  const getSelectedImage = () => {
    return processedImages.find(img => img.id === selectedImageId);
  };

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  }, [isDragging]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  }, [processFile]);

  return (
    <>
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Image Processor</CardTitle>
        <CardDescription>
          Upload, process, and download images with custom dimensions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="mb-4">
              <Label htmlFor="image-upload">Upload Image</Label>
              <div className="mt-2">
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="mb-2"
                />
                {!originalImage && (
                  <div 
                    ref={dropAreaRef}
                    className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center transition-colors duration-200 ${
                      isDragging 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-300 bg-gray-50 dark:bg-gray-900'
                    }`}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Camera className={`h-12 w-12 mb-2 ${isDragging ? 'text-primary' : 'text-gray-400'}`} />
                    <p className={`text-sm ${isDragging ? 'text-primary' : 'text-gray-500'}`}>
                      {isDragging ? 'Drop image here' : 'Drag & drop image here or click "Upload Image"'}
                    </p>
                  </div>
                )}
                {previewUrl && (
                  <div className="mt-4">
                    <div className="relative aspect-video rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="object-contain w-full h-full"
                      />
                    </div>
                    {originalDimensions.width > 0 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Original size: {originalDimensions.width} × {originalDimensions.height}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
            {originalImage && (
              <Button 
                variant="outline" 
                className="w-full mt-2" 
                onClick={resetForm}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Clear
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="basic" className="flex-1">Basic</TabsTrigger>
                <TabsTrigger value="advanced" className="flex-1">Advanced</TabsTrigger>
                <TabsTrigger value="export" className="flex-1">Export</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="process-type">Process Type</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="cursor-help">
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-80">
                            <strong>Resize:</strong> Stretches or shrinks the image to exact dimensions<br />
                            <strong>Crop:</strong> Trims image edges to fit target dimensions<br />
                            <strong>Letterbox:</strong> Adds black bars to preserve aspect ratio
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select
                    value={selectedProcessType}
                    onValueChange={setSelectedProcessType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select process type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resize">Resize (Stretch/Shrink)</SelectItem>
                      <SelectItem value="crop">Crop to Fit</SelectItem>
                      <SelectItem value="letterbox">Letterbox/Pillarbox</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="cursor-help">
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Select a common aspect ratio or use custom dimensions</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select
                    value={selectedAspectRatio}
                    onValueChange={handleAspectRatioChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select aspect ratio" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ASPECT_RATIOS).map(([key, { label, value }]) => (
                        <SelectItem key={key} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="targetWidth">Width (px)</Label>
                    <Input
                      id="targetWidth"
                      type="number"
                      value={targetWidth}
                      onChange={(e) => updateTargetDimensions('width', parseInt(e.target.value))}
                      min={1}
                    />
                  </div>
                  <div>
                    <Label htmlFor="targetHeight">Height (px)</Label>
                    <Input
                      id="targetHeight"
                      type="number"
                      value={targetHeight}
                      onChange={(e) => updateTargetDimensions('height', parseInt(e.target.value))}
                      min={1}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="maintainAspectRatio"
                    checked={maintainAspectRatio}
                    onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="maintainAspectRatio" className="cursor-pointer">
                    Maintain aspect ratio
                  </Label>
                </div>
              </TabsContent>
              
              <TabsContent value="advanced" className="space-y-4">
                {selectedProcessType === 'crop' && (
                  <div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="cropOrigin">Crop Position</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="cursor-help">
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Choose which part of the image to keep when cropping</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Select
                      value={cropOrigin}
                      onValueChange={setCropOrigin}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select crop position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="top">Top (Portrait)</SelectItem>
                        <SelectItem value="bottom">Bottom (Portrait)</SelectItem>
                        <SelectItem value="left">Left (Landscape)</SelectItem>
                        <SelectItem value="right">Right (Landscape)</SelectItem>
                        <SelectItem value="custom">Custom Position</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {cropOrigin === 'custom' && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <Label htmlFor="cropX">Horizontal Position: {Math.round(cropPosition.x * 100)}%</Label>
                          </div>
                          <Slider 
                            id="cropX"
                            value={[cropPosition.x * 100]} 
                            min={0} 
                            max={100} 
                            step={5} 
                            onValueChange={(values) => setCropPosition(prev => ({ ...prev, x: values[0] / 100 }))}
                          />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <Label htmlFor="cropY">Vertical Position: {Math.round(cropPosition.y * 100)}%</Label>
                          </div>
                          <Slider 
                            id="cropY"
                            value={[cropPosition.y * 100]} 
                            min={0} 
                            max={100} 
                            step={5} 
                            onValueChange={(values) => setCropPosition(prev => ({ ...prev, y: values[0] / 100 }))}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div>
                  <Label htmlFor="imageName">Image Name</Label>
                  <Input
                    id="imageName"
                    value={imageName}
                    onChange={(e) => setImageName(e.target.value)}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="export" className="space-y-4">
                <div>
                  <Label htmlFor="exportFormat">Export Format</Label>
                  <Select
                    value={exportFormat}
                    onValueChange={setExportFormat}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select export format" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPORT_FORMATS.map(format => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="optimization">Optimization</Label>
                  <Select
                    value={optimization}
                    onValueChange={applyOptimizationPreset}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select optimization preset" />
                    </SelectTrigger>
                    <SelectContent>
                      {OPTIMIZATION_PRESETS.map(preset => (
                        <SelectItem key={preset.value} value={preset.value}>
                          {preset.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <Label htmlFor="quality">Quality: {quality}%</Label>
                  </div>
                  <Slider 
                    id="quality"
                    value={[quality]} 
                    min={1} 
                    max={100} 
                    step={1} 
                    onValueChange={(values) => setQuality(values[0])}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <Button 
              className="w-full mt-4" 
              onClick={processImage} 
              disabled={!originalImage}
            >
              <Repeat className="mr-2 h-4 w-4" /> Process Image
            </Button>
          </div>
        </div>

        {/* Hidden canvas for processing */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {processedImages.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Processed Images</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {processedImages.map((image) => (
                <Card 
                  key={image.id} 
                  className={`overflow-hidden ${selectedImageId === image.id ? 'border-primary' : ''}`}
                  onClick={() => setSelectedImageId(image.id)}
                >
                  <div className="aspect-square relative bg-gray-100 dark:bg-gray-800">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="h-10 w-10 text-gray-400" />
                    </div>
                                              <img
                      src={URL.createObjectURL(image.processedBlob)}
                      alt={image.name}
                      className="absolute inset-0 w-full h-full object-contain"
                      onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                    />
                  </div>
                  <CardContent className="p-3">
                    <p className="font-medium truncate">{image.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {image.width}×{image.height} • {image.processType}
                      {image.format !== "original" && (
                        <> • {image.format.split('/')[1].toUpperCase()}</>
                      )}
                    </p>
                  </CardContent>
                  <CardFooter className="p-2 pt-0 flex justify-between">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => downloadImage(image)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => deleteProcessedImage(image.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <Toaster />
    </Card>
  </>
  );
};

export default ImageProcessor;