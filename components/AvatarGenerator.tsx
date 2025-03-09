"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Copy, Download, RefreshCw, Palette, Grid2X2, Type, Image as ImageIcon, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from '@/components/ui/useToast';

// Define types for avatar properties
interface AvatarProperties {
  size: number;
  shape: 'circle' | 'square' | 'rounded';
  text: string;
  fontFamily: string;
  fontSize: number;
  textColor: string;
  backgroundColor: string;
  useGradient: boolean;
  gradientDirection: 'to right' | 'to left' | 'to bottom' | 'to top' | 'to bottom right' | 'to bottom left';
  gradientFromColor: string;
  gradientToColor: string;
  borderWidth: number;
  borderColor: string;
  usePattern: boolean;
  patternType: 'dots' | 'lines' | 'crosshatch' | 'diagonal' | 'triangles' | 'none';
  patternColor: string;
  patternOpacity: number;
  useImage: boolean;
  imageUrl: string;
}

// Color presets for quick selection
const COLOR_PRESETS = [
  { name: 'Blue', color: '#3B82F6', dark: '#1D4ED8' },
  { name: 'Green', color: '#10B981', dark: '#059669' },
  { name: 'Purple', color: '#8B5CF6', dark: '#6D28D9' },
  { name: 'Pink', color: '#EC4899', dark: '#BE185D' },
  { name: 'Orange', color: '#F97316', dark: '#C2410C' },
  { name: 'Red', color: '#EF4444', dark: '#B91C1C' },
  { name: 'Gray', color: '#6B7280', dark: '#374151' },
  { name: 'Black', color: '#1F2937', dark: '#111827' },
];

// Font options
const FONT_OPTIONS = [
  { name: 'System UI', value: 'system-ui, sans-serif' },
  { name: 'Serif', value: 'serif' },
  { name: 'Monospace', value: 'monospace' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Courier', value: 'Courier, monospace' },
];

const AvatarGenerator: React.FC = () => {
  const { toast, Toaster } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generatedAvatars, setGeneratedAvatars] = useState<string[]>([]);
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState<number | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Default avatar properties
  const [avatarProps, setAvatarProps] = useState<AvatarProperties>({
    size: 200,
    shape: 'circle',
    text: '',
    fontFamily: 'system-ui, sans-serif',
    fontSize: 60,
    textColor: '#FFFFFF',
    backgroundColor: '#3B82F6',
    useGradient: false,
    gradientDirection: 'to right',
    gradientFromColor: '#3B82F6',
    gradientToColor: '#1D4ED8',
    borderWidth: 0,
    borderColor: '#000000',
    usePattern: false,
    patternType: 'dots',
    patternColor: '#FFFFFF',
    patternOpacity: 0.2,
    useImage: false,
    imageUrl: '',
  });

  // Handle property changes
  const handleChange = <K extends keyof AvatarProperties>(
    key: K,
    value: AvatarProperties[K]
  ) => {
    setAvatarProps(prev => ({ ...prev, [key]: value }));
  };

  // Handle file input for custom images
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setCustomImageUrl(url);
        handleChange('imageUrl', url);
        handleChange('useImage', true);
        
        toast({
          title: "Image uploaded",
          description: `${file.name} is ready to use as an avatar base.`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file.",
          variant: "destructive"
        });
      }
    }
  };

  // Generate pattern based on the selected type
  const drawPattern = (
    ctx: CanvasRenderingContext2D, 
    size: number,
    type: string,
    color: string,
    opacity: number
  ) => {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    
    const patternSize = size / 10;
    
    switch (type) {
      case 'dots':
        for (let x = 0; x < size; x += patternSize) {
          for (let y = 0; y < size; y += patternSize) {
            ctx.beginPath();
            ctx.arc(x, y, patternSize / 5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        break;
      case 'lines':
        for (let y = 0; y < size; y += patternSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(size, y);
          ctx.lineWidth = patternSize / 5;
          ctx.strokeStyle = color;
          ctx.stroke();
        }
        break;
      case 'crosshatch':
        for (let x = 0; x < size; x += patternSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, size);
          ctx.lineWidth = patternSize / 10;
          ctx.strokeStyle = color;
          ctx.stroke();
        }
        for (let y = 0; y < size; y += patternSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(size, y);
          ctx.lineWidth = patternSize / 10;
          ctx.strokeStyle = color;
          ctx.stroke();
        }
        break;
      case 'diagonal':
        for (let i = -size; i < size * 2; i += patternSize) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i + size, size);
          ctx.lineWidth = patternSize / 5;
          ctx.strokeStyle = color;
          ctx.stroke();
        }
        break;
      case 'triangles':
        const triangleSize = patternSize * 2;
        for (let x = 0; x < size; x += triangleSize) {
          for (let y = 0; y < size; y += triangleSize) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + triangleSize, y);
            ctx.lineTo(x + triangleSize / 2, y + triangleSize);
            ctx.closePath();
            ctx.fill();
          }
        }
        break;
    }
    
    ctx.restore();
  };

  // Generate a random avatar
  const generateRandomAvatar = () => {
    // Pick random colors
    const randomColorIndex = Math.floor(Math.random() * COLOR_PRESETS.length);
    const randomColor = COLOR_PRESETS[randomColorIndex].color;
    const randomDarkColor = COLOR_PRESETS[randomColorIndex].dark;
    
    // Random text from initials or emoji
    const useEmoji = Math.random() > 0.5;
    let randomText = '';
    if (useEmoji) {
      const emojis = ['😊', '🚀', '🌟', '🔥', '💡', '🎮', '🎨', '🎯', '🏆', '🌈'];
      randomText = emojis[Math.floor(Math.random() * emojis.length)];
    } else {
      const initials = ['AB', 'CD', 'EF', 'GH', 'JK', 'LM', 'NP', 'RS', 'TW', 'XY'];
      randomText = initials[Math.floor(Math.random() * initials.length)];
    }
    
    // Random shape
    const shapes: AvatarProperties['shape'][] = ['circle', 'square', 'rounded'];
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    
    // Random use of gradient
    const useGradient = Math.random() > 0.5;
    
    // Random use of pattern
    const usePattern = Math.random() > 0.7;
    const patternTypes: AvatarProperties['patternType'][] = ['dots', 'lines', 'crosshatch', 'diagonal', 'triangles'];
    const randomPatternType = patternTypes[Math.floor(Math.random() * patternTypes.length)];
    
    // Update avatar properties with random values
    setAvatarProps(prev => ({
      ...prev,
      text: randomText,
      shape: randomShape,
      backgroundColor: randomColor,
      useGradient: useGradient,
      gradientFromColor: randomColor,
      gradientToColor: randomDarkColor,
      usePattern: usePattern,
      patternType: randomPatternType,
      useImage: false,
    }));
  };

  // Generate the avatar with current properties
  const generateAvatar = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { 
      size, shape, text, fontFamily, fontSize, textColor, 
      backgroundColor, useGradient, gradientDirection, gradientFromColor, gradientToColor,
      borderWidth, borderColor, usePattern, patternType, patternColor, patternOpacity,
      useImage, imageUrl
    } = avatarProps;
    
    // Set canvas size
    canvas.width = size;
    canvas.height = size;
    
    // Clear canvas
    ctx.clearRect(0, 0, size, size);
    
    // Draw shape background
    ctx.save();
    
    // Apply shape clipping
    if (shape === 'circle') {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, (size - borderWidth * 2) / 2, 0, Math.PI * 2);
      ctx.clip();
    } else if (shape === 'rounded') {
      const radius = size / 10;
      ctx.beginPath();
      ctx.moveTo(borderWidth + radius, borderWidth);
      ctx.lineTo(size - borderWidth - radius, borderWidth);
      ctx.arcTo(size - borderWidth, borderWidth, size - borderWidth, borderWidth + radius, radius);
      ctx.lineTo(size - borderWidth, size - borderWidth - radius);
      ctx.arcTo(size - borderWidth, size - borderWidth, size - borderWidth - radius, size - borderWidth, radius);
      ctx.lineTo(borderWidth + radius, size - borderWidth);
      ctx.arcTo(borderWidth, size - borderWidth, borderWidth, size - borderWidth - radius, radius);
      ctx.lineTo(borderWidth, borderWidth + radius);
      ctx.arcTo(borderWidth, borderWidth, borderWidth + radius, borderWidth, radius);
      ctx.closePath();
      ctx.clip();
    } else if (shape === 'square') {
      ctx.rect(borderWidth, borderWidth, size - borderWidth * 2, size - borderWidth * 2);
      ctx.clip();
    }
    
    // Fill with background color or gradient
    if (useGradient) {
      const gradient = ctx.createLinearGradient(0, 0, 
        gradientDirection.includes('right') ? size : 0,
        gradientDirection.includes('bottom') ? size : 0);
      gradient.addColorStop(0, gradientFromColor);
      gradient.addColorStop(1, gradientToColor);
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = backgroundColor;
    }
    
    ctx.fillRect(0, 0, size, size);
    
    // Draw custom image if enabled
    if (useImage && imageUrl) {
      const img = new Image();
      img.onload = () => {
        // Center and cover the avatar area
        const aspectRatio = img.width / img.height;
        let drawWidth, drawHeight, drawX, drawY;
        
        if (aspectRatio > 1) {
          // Image is wider than tall
          drawHeight = size;
          drawWidth = size * aspectRatio;
          drawX = -(drawWidth - size) / 2;
          drawY = 0;
        } else {
          // Image is taller than wide
          drawWidth = size;
          drawHeight = size / aspectRatio;
          drawX = 0;
          drawY = -(drawHeight - size) / 2;
        }
        
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        
        // Continue with pattern and text after image is loaded
        if (usePattern && patternType !== 'none') {
          drawPattern(ctx, size, patternType, patternColor, patternOpacity);
        }
        
        // Draw text
        if (text) {
          drawText(ctx, size, text, fontFamily, fontSize, textColor);
        }
        
        // Add the generated avatar to the list
        addGeneratedAvatar();
      };
      img.src = imageUrl;
    } else {
      // Draw pattern if enabled
      if (usePattern && patternType !== 'none') {
        drawPattern(ctx, size, patternType, patternColor, patternOpacity);
      }
      
      // Draw text
      if (text) {
        drawText(ctx, size, text, fontFamily, fontSize, textColor);
      }
      
      // Add the generated avatar to the list
      addGeneratedAvatar();
    }
    
    ctx.restore();
    
    // Draw border if specified
    if (borderWidth > 0) {
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = borderWidth;
      
      if (shape === 'circle') {
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, (size - borderWidth) / 2, 0, Math.PI * 2);
        ctx.stroke();
      } else if (shape === 'rounded') {
        const radius = size / 10;
        ctx.beginPath();
        ctx.moveTo(borderWidth / 2 + radius, borderWidth / 2);
        ctx.lineTo(size - borderWidth / 2 - radius, borderWidth / 2);
        ctx.arcTo(size - borderWidth / 2, borderWidth / 2, size - borderWidth / 2, borderWidth / 2 + radius, radius);
        ctx.lineTo(size - borderWidth / 2, size - borderWidth / 2 - radius);
        ctx.arcTo(size - borderWidth / 2, size - borderWidth / 2, size - borderWidth / 2 - radius, size - borderWidth / 2, radius);
        ctx.lineTo(borderWidth / 2 + radius, size - borderWidth / 2);
        ctx.arcTo(borderWidth / 2, size - borderWidth / 2, borderWidth / 2, size - borderWidth / 2 - radius, radius);
        ctx.lineTo(borderWidth / 2, borderWidth / 2 + radius);
        ctx.arcTo(borderWidth / 2, borderWidth / 2, borderWidth / 2 + radius, borderWidth / 2, radius);
        ctx.closePath();
        ctx.stroke();
      } else if (shape === 'square') {
        ctx.strokeRect(borderWidth / 2, borderWidth / 2, size - borderWidth, size - borderWidth);
      }
    }
  };

  // Draw text on the avatar
  const drawText = (
    ctx: CanvasRenderingContext2D,
    size: number,
    text: string,
    fontFamily: string,
    fontSize: number,
    textColor: string
  ) => {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = textColor;
    
    // Adjust font size to fit within avatar
    const effectiveFontSize = Math.min(fontSize, size * 0.5);
    ctx.font = `${effectiveFontSize}px ${fontFamily}`;
    
    // Emoji detection for better vertical alignment
    const isEmoji = /\p{Emoji}/u.test(text);
    const yOffset = isEmoji ? 0 : size * 0.05;
    
    // Draw text in the center
    ctx.fillText(text, size / 2, size / 2 + yOffset, size);
  };

  // Add current avatar to generated list
  const addGeneratedAvatar = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      setGeneratedAvatars(prev => [...prev, dataUrl]);
      setSelectedAvatarIndex(generatedAvatars.length);
      
      toast({
        title: "Avatar generated",
        description: "Your new avatar has been created successfully.",
      });
    }
  };

  // Download avatar
  const downloadAvatar = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `avatar-${new Date().getTime()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Avatar downloaded",
        description: "Your avatar has been saved to your device.",
      });
    }
  };

  // Copy avatar to clipboard
  const copyAvatar = async () => {
    if (canvasRef.current) {
      try {
        const dataUrl = canvasRef.current.toDataURL('image/png');
        const blob = await (await fetch(dataUrl)).blob();
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob,
          }),
        ]);
        
        toast({
          title: "Copied to clipboard",
          description: "Your avatar image has been copied to clipboard.",
        });
      } catch (err) {
        console.error('Failed to copy avatar:', err);
        
        toast({
          title: "Copy failed",
          description: "Could not copy avatar to clipboard. Try downloading instead.",
          variant: "destructive",
        });
      }
    }
  };

  // Select an avatar from the generated list
  const selectAvatar = (index: number) => {
    setSelectedAvatarIndex(index);
    // We don't update the canvas immediately to avoid overwriting current edits
  };

  // Delete avatar from the generated list
  const deleteAvatar = (index: number) => {
    setGeneratedAvatars(prev => prev.filter((_, i) => i !== index));
    if (selectedAvatarIndex === index) {
      setSelectedAvatarIndex(null);
    } else if (selectedAvatarIndex !== null && selectedAvatarIndex > index) {
      setSelectedAvatarIndex(selectedAvatarIndex - 1);
    }
    
    toast({
      title: "Avatar deleted",
      description: "The selected avatar has been removed.",
    });
  };

  // Generate avatar whenever properties change
  useEffect(() => {
    generateAvatar();
  }, [avatarProps]);

  // Initialize with a random avatar
  useEffect(() => {
    generateRandomAvatar();
  }, []);

  return (
    <>
      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle>Avatar Generator</CardTitle>
          <CardDescription>
            Create custom avatars for profiles, apps, and websites
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Avatar Preview Column */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <canvas 
                  ref={canvasRef} 
                  width={avatarProps.size} 
                  height={avatarProps.size}
                  className="border border-border rounded-lg shadow-sm mx-auto"
                />
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button onClick={downloadAvatar}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" onClick={copyAvatar}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
                <Button variant="outline" onClick={generateRandomAvatar}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Random
                </Button>
              </div>
              
              {/* Generated Avatars Gallery */}
              {generatedAvatars.length > 0 && (
                <div className="mt-8 w-full">
                  <h3 className="text-lg font-medium mb-2">History</h3>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {generatedAvatars.map((avatar, index) => (
                      <div 
                        key={index} 
                        className={`relative cursor-pointer border rounded-md overflow-hidden ${
                          selectedAvatarIndex === index ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => selectAvatar(index)}
                      >
                        <img 
                          src={avatar} 
                          alt={`Generated avatar ${index + 1}`} 
                          className="w-full h-auto"
                        />
                        <button
                          className="absolute top-0 right-0 bg-destructive text-destructive-foreground p-1 opacity-0 hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteAvatar(index);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Controls Column */}
            <div>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="basic">
                    <Grid2X2 className="h-4 w-4 mr-2" />
                    Basic
                  </TabsTrigger>
                  <TabsTrigger value="style">
                    <Palette className="h-4 w-4 mr-2" />
                    Style
                  </TabsTrigger>
                  <TabsTrigger value="text">
                    <Type className="h-4 w-4 mr-2" />
                    Text
                  </TabsTrigger>
                  <TabsTrigger value="image">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Image
                  </TabsTrigger>
                </TabsList>
                
                {/* Basic Settings Tab */}
                <TabsContent value="basic" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="size">Size (pixels)</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="size"
                        min={50}
                        max={500}
                        step={10}
                        value={[avatarProps.size]}
                        onValueChange={([value]) => handleChange('size', value)}
                        className="flex-1"
                      />
                      <span className="w-12 text-right">{avatarProps.size}px</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="shape">Shape</Label>
                    <Select
                      value={avatarProps.shape}
                      onValueChange={(value: AvatarProperties['shape']) => handleChange('shape', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a shape" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="circle">Circle</SelectItem>
                        <SelectItem value="square">Square</SelectItem>
                        <SelectItem value="rounded">Rounded Square</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="border-width">Border Width</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="border-width"
                        min={0}
                        max={20}
                        step={1}
                        value={[avatarProps.borderWidth]}
                        onValueChange={([value]) => handleChange('borderWidth', value)}
                        className="flex-1"
                      />
                      <span className="w-12 text-right">{avatarProps.borderWidth}px</span>
                    </div>
                  </div>
                  
                  {avatarProps.borderWidth > 0 && (
                    <div className="space-y-2">
                      <Label htmlFor="border-color">Border Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="border-color"
                          type="color"
                          value={avatarProps.borderColor}
                          onChange={(e) => handleChange('borderColor', e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          type="text"
                          value={avatarProps.borderColor}
                          onChange={(e) => handleChange('borderColor', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                {/* Style Settings Tab */}
                <TabsContent value="style" className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="use-gradient">Use Gradient</Label>
                      <input
                        id="use-gradient"
                        type="checkbox"
                        checked={avatarProps.useGradient}
                        onChange={(e) => handleChange('useGradient', e.target.checked)}
                        className="toggle"
                      />
                    </div>
                  </div>
                  
                  {!avatarProps.useGradient ? (
                    <div className="space-y-2">
                      <Label htmlFor="bg-color">Background Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="bg-color"
                          type="color"
                          value={avatarProps.backgroundColor}
                          onChange={(e) => handleChange('backgroundColor', e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          type="text"
                          value={avatarProps.backgroundColor}
                          onChange={(e) => handleChange('backgroundColor', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                      
                      <div className="grid grid-cols-8 gap-2 mt-2">
                        {COLOR_PRESETS.map((color) => (
                          <button
                            key={color.color}
                            className="w-full aspect-square rounded-md border border-border"
                            style={{ backgroundColor: color.color }}
                            onClick={() => handleChange('backgroundColor', color.color)}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="gradient-direction">Gradient Direction</Label>
                        <Select
                          value={avatarProps.gradientDirection}
                          onValueChange={(value: AvatarProperties['gradientDirection']) => 
                            handleChange('gradientDirection', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select direction" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="to right">Horizontal (Left to Right)</SelectItem>
                            <SelectItem value="to left">Horizontal (Right to Left)</SelectItem>
                            <SelectItem value="to bottom">Vertical (Top to Bottom)</SelectItem>
                            <SelectItem value="to top">Vertical (Bottom to Top)</SelectItem>
                            <SelectItem value="to bottom right">Diagonal (Top-Left to Bottom-Right)</SelectItem>
                            <SelectItem value="to bottom left">Diagonal (Top-Right to Bottom-Left)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="gradient-from">From Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="gradient-from"
                            type="color"
                            value={avatarProps.gradientFromColor}
                            onChange={(e) => handleChange('gradientFromColor', e.target.value)}
                            className="w-12 h-10 p-1"
                          />
                          <Input
                            type="text"
                            value={avatarProps.gradientFromColor}
                            onChange={(e) => handleChange('gradientFromColor', e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="gradient-to">To Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="gradient-to"
                            type="color"
                            value={avatarProps.gradientToColor}
                            onChange={(e) => handleChange('gradientToColor', e.target.value)}
                            className="w-12 h-10 p-1"
                          />
                          <Input
                            type="text"
                            value={avatarProps.gradientToColor}
                            onChange={(e) => handleChange('gradientToColor', e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {COLOR_PRESETS.map((color) => (
                          <button
                            key={color.color}
                            className="w-full h-8 rounded-md"
                            style={{ 
                              background: `linear-gradient(to right, ${color.color}, ${color.dark})` 
                            }}
                            onClick={() => {
                              handleChange('gradientFromColor', color.color);
                              handleChange('gradientToColor', color.dark);
                            }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="use-pattern">Use Pattern</Label>
                      <input
                        id="use-pattern"
                        type="checkbox"
                        checked={avatarProps.usePattern}
                        onChange={(e) => handleChange('usePattern', e.target.checked)}
                        className="toggle"
                      />
                    </div>
                  </div>
                  
                  {avatarProps.usePattern && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="pattern-type">Pattern Type</Label>
                        <Select
                          value={avatarProps.patternType}
                          onValueChange={(value: AvatarProperties['patternType']) => 
                            handleChange('patternType', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select pattern" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dots">Dots</SelectItem>
                            <SelectItem value="lines">Lines</SelectItem>
                            <SelectItem value="crosshatch">Crosshatch</SelectItem>
                            <SelectItem value="diagonal">Diagonal</SelectItem>
                            <SelectItem value="triangles">Triangles</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="pattern-color">Pattern Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="pattern-color"
                            type="color"
                            value={avatarProps.patternColor}
                            onChange={(e) => handleChange('patternColor', e.target.value)}
                            className="w-12 h-10 p-1"
                          />
                          <Input
                            type="text"
                            value={avatarProps.patternColor}
                            onChange={(e) => handleChange('patternColor', e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="pattern-opacity">Pattern Opacity</Label>
                        <div className="flex items-center gap-4">
                          <Slider
                            id="pattern-opacity"
                            min={0.1}
                            max={1}
                            step={0.05}
                            value={[avatarProps.patternOpacity]}
                            onValueChange={([value]) => handleChange('patternOpacity', value)}
                            className="flex-1"
                          />
                          <span className="w-12 text-right">{Math.round(avatarProps.patternOpacity * 100)}%</span>
                        </div>
                      </div>
                    </>
                  )}
                </TabsContent>
                
                {/* Text Settings Tab */}
                <TabsContent value="text" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="text">Text/Initials</Label>
                    <Input
                      id="text"
                      value={avatarProps.text}
                      onChange={(e) => handleChange('text', e.target.value)}
                      placeholder="Enter text, initials, or emoji"
                      maxLength={3}
                    />
                    <p className="text-sm text-muted-foreground">
                      Use 1-2 letters, initials, or a single emoji
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="text-color">Text Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="text-color"
                        type="color"
                        value={avatarProps.textColor}
                        onChange={(e) => handleChange('textColor', e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={avatarProps.textColor}
                        onChange={(e) => handleChange('textColor', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="font-family">Font</Label>
                    <Select
                      value={avatarProps.fontFamily}
                      onValueChange={(value) => handleChange('fontFamily', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a font" />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_OPTIONS.map(font => (
                          <SelectItem key={font.value} value={font.value}>
                            <span style={{ fontFamily: font.value }}>{font.name}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="font-size">Font Size</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="font-size"
                        min={10}
                        max={120}
                        step={5}
                        value={[avatarProps.fontSize]}
                        onValueChange={([value]) => handleChange('fontSize', value)}
                        className="flex-1"
                      />
                      <span className="w-12 text-right">{avatarProps.fontSize}px</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => handleChange('text', 'AB')}
                    >
                      AB Initials
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleChange('text', '😊')}
                    >
                      😊 Emoji
                    </Button>
                  </div>
                </TabsContent>
                
                {/* Image Tab */}
                <TabsContent value="image" className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="use-image">Use Background Image</Label>
                      <input
                        id="use-image"
                        type="checkbox"
                        checked={avatarProps.useImage}
                        onChange={(e) => handleChange('useImage', e.target.checked)}
                        className="toggle"
                      />
                    </div>
                  </div>
                  
                  {avatarProps.useImage && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="image-upload">Upload Image</Label>
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                        />
                      </div>
                      
                      {customImageUrl && (
                        <div className="mt-4">
                          <Label className="mb-2 block">Preview</Label>
                          <div className="w-32 h-32 border rounded-md overflow-hidden">
                            <img 
                              src={customImageUrl} 
                              alt="Custom image preview" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-2 mt-4">
                        <p className="text-sm text-muted-foreground">
                          The image will be centered and cropped to fit the avatar shape.
                        </p>
                      </div>
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6">
          <Button variant="outline" onClick={generateRandomAvatar}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate Random Avatar
          </Button>
          <Button onClick={downloadAvatar}>
            <Download className="mr-2 h-4 w-4" />
            Download Avatar
          </Button>
        </CardFooter>
      </Card>
      <Toaster />
    </>
  );
};

export default AvatarGenerator;