"use client"

import React, { useState, useRef, useCallback } from 'react';
import { Camera, Download, Trash2, Image as ImageIcon, Repeat } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
}

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast, Toaster } = useToast();

  const resetForm = useCallback(() => {
    setOriginalImage(null);
    setPreviewUrl(null);
    setImageName('');
    setTargetWidth(800);
    setTargetHeight(600);
    setOriginalDimensions({ width: 0, height: 0 });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
  };

  const processImage = () => {
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
            sourceX = (img.width - sourceWidth) / 2;
            sourceY = 0;
          } else {
            // Original is taller, crop top/bottom
            sourceWidth = img.width;
            sourceHeight = img.width / aspectRatio;
            sourceX = 0;
            sourceY = (img.height - sourceHeight) / 2;
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
            processType: selectedProcessType
          };
          
          setProcessedImages(prev => [...prev, newProcessedImage]);
          setSelectedImageId(newProcessedImage.id);
          
          toast({
            title: "Image processed!",
            description: `${selectedProcessType} to ${targetWidth}×${targetHeight}`,
          });
        }
      }, originalImage.type, quality / 100);
    };
    img.src = previewUrl;
  };

  const downloadImage = (image: ProcessedImage) => {
    const url = URL.createObjectURL(image.processedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${image.name}_${image.width}x${image.height}.${originalImage?.name.split('.').pop() || 'jpg'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Image downloaded",
      description: `${a.download} has been saved to your device`,
    });
  };

  const deleteProcessedImage = (id: string) => {
    setProcessedImages(prev => prev.filter(img => img.id !== id));
    if (selectedImageId === id) {
      setSelectedImageId(null);
    }
  };

  // For handling aspect ratio
  const updateTargetDimensions = (dimension: 'width' | 'height', value: number) => {
    if (dimension === 'width') {
      setTargetWidth(value);
      if (maintainAspectRatio && originalDimensions.width && originalDimensions.height) {
        const aspectRatio = originalDimensions.width / originalDimensions.height;
        setTargetHeight(Math.round(value / aspectRatio));
      }
    } else {
      setTargetHeight(value);
      if (maintainAspectRatio && originalDimensions.width && originalDimensions.height) {
        const aspectRatio = originalDimensions.width / originalDimensions.height;
        setTargetWidth(Math.round(value * aspectRatio));
      }
    }
  };

  return (
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
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
                    <Camera className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">No image selected</p>
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
            <div>
              <Label htmlFor="process-type">Process Type</Label>
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
              <Label htmlFor="imageName">Image Name</Label>
              <Input
                id="imageName"
                value={imageName}
                onChange={(e) => setImageName(e.target.value)}
                placeholder="Enter image name"
              />
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
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="quality">Quality: {quality}%</Label>
              </div>
              <Slider 
                id="quality"
                value={[quality]} 
                min={10} 
                max={100} 
                step={5} 
                onValueChange={(values) => setQuality(values[0])}
              />
            </div>
            
            <Button 
              className="w-full mt-4" 
              disabled={!originalImage}
              onClick={processImage}
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
                    <p className="text-sm text-muted-foreground">{image.width}×{image.height} • {image.processType}</p>
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
  );
};

export default ImageProcessor;