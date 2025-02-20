"use client"

import React, { useState, useEffect } from 'react';
import { Copy, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from '@/components/ui/useToast'


interface Dimensions {
  width: number;
  height: number;
}

interface AspectRatioAnalysis {
  original_dimensions: string;
  simplified_ratio: string;
  decimal_ratio: string;
  closest_common_ratio: { ratio: number; description: string };
  difference_from_common: number;
}

interface BoxCalculation {
  display_width: number;
  display_height: number;
  padding_top: number;
  padding_side: number;
  type: 'letterbox' | 'pillarbox';
}

interface CropSuggestion {
  crop_width: number;
  crop_height: number;
  crop_x: number;
  crop_y: number;
  original_area: number;
  cropped_area: number;
  area_preserved: string;
}

const COMMON_RATIOS: Record<string, { ratio: number; description: string }> = {
  "1:1": { ratio: 1.00, description: "Perfect square, common in social media posts" },
  "4:3": { ratio: 1.33, description: "Standard definition TV and early computer monitors" },
  "3:2": { ratio: 1.50, description: "Classic 35mm film and many DSLR sensors" },
  "16:9": { ratio: 1.77, description: "HD video and modern displays" },
  "1.85:1": { ratio: 1.85, description: "Standard widescreen cinema format" },
  "2.35:1": { ratio: 2.35, description: "Anamorphic widescreen, used in many films" },
  "2.76:1": { ratio: 2.76, description: "Ultra Panavision, used in epic films" },
};

const AspectRatioCalculator: React.FC = () => {
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 1920,
    height: 1080
  });

  const [screenDimensions, setScreenDimensions] = useState<Dimensions>({
    width: 1440,
    height: 900
  });

  const [targetRatio, setTargetRatio] = useState<number>(2.35);
  const [analysis, setAnalysis] = useState<AspectRatioAnalysis | null>(null);
  const [boxCalc, setBoxCalc] = useState<BoxCalculation | null>(null);
  const [cropSuggestion, setCropSuggestion] = useState<CropSuggestion | null>(null);

  const getGcd = (a: number, b: number): number => {
    while (b) {
      [a, b] = [b, a % b];
    }
    return a;
  };

  const analyzeAspectRatio = (width: number, height: number): AspectRatioAnalysis => {
    const gcd = getGcd(Math.round(width), Math.round(height));
    const simplified_width = width / gcd;
    const simplified_height = height / gcd;
    const decimal_ratio = width / height;

    const closest = Object.entries(COMMON_RATIOS)
      .reduce((closest, [key, value]) => {
        const diff = Math.abs(value.ratio - decimal_ratio);
        return diff < closest.diff ? { key, diff } : closest;
      }, { key: "16:9", diff: Infinity });

    return {
      original_dimensions: `${width}x${height}`,
      simplified_ratio: `${simplified_width.toFixed(0)}:${simplified_height.toFixed(0)}`,
      decimal_ratio: `${decimal_ratio.toFixed(3)}:1`,
      closest_common_ratio: COMMON_RATIOS[closest.key],
      difference_from_common: closest.diff
    };
  };

  const calculateLetterboxPillarbox = (
    content_width: number,
    content_height: number,
    screen_width: number,
    screen_height: number
  ): BoxCalculation => {
    const content_ratio = content_width / content_height;
    const screen_ratio = screen_width / screen_height;

    if (content_ratio > screen_ratio) {
      const new_width = screen_width;
      const new_height = Math.round(screen_width / content_ratio);
      const padding_top = Math.floor((screen_height - new_height) / 2);
      return {
        display_width: new_width,
        display_height: new_height,
        padding_top,
        padding_side: 0,
        type: 'letterbox'
      };
    } else {
      const new_height = screen_height;
      const new_width = Math.round(screen_height * content_ratio);
      const padding_side = Math.floor((screen_width - new_width) / 2);
      return {
        display_width: new_width,
        display_height: new_height,
        padding_top: 0,
        padding_side,
        type: 'pillarbox'
      };
    }
  };

  const suggestCropDimensions = (
    width: number,
    height: number,
    target_ratio: number
  ): CropSuggestion => {
    const current_ratio = width / height;

    let new_width: number;
    let new_height: number;
    let crop_x: number;
    let crop_y: number;

    if (current_ratio > target_ratio) {
      new_width = Math.round(height * target_ratio);
      new_height = height;
      crop_x = Math.floor((width - new_width) / 2);
      crop_y = 0;
    } else {
      new_width = width;
      new_height = Math.round(width / target_ratio);
      crop_x = 0;
      crop_y = Math.floor((height - new_height) / 2);
    }

    return {
      crop_width: new_width,
      crop_height: new_height,
      crop_x,
      crop_y,
      original_area: width * height,
      cropped_area: new_width * new_height,
      area_preserved: `${((new_width * new_height) / (width * height) * 100).toFixed(1)}%`
    };
  };

  useEffect(() => {
    const newAnalysis = analyzeAspectRatio(dimensions.width, dimensions.height);
    const newBoxCalc = calculateLetterboxPillarbox(
      dimensions.width,
      dimensions.height,
      screenDimensions.width,
      screenDimensions.height
    );
    const newCropSuggestion = suggestCropDimensions(
      dimensions.width,
      dimensions.height,
      targetRatio
    );

    setAnalysis(newAnalysis);
    setBoxCalc(newBoxCalc);
    setCropSuggestion(newCropSuggestion);
  }, [dimensions, screenDimensions, targetRatio]);

  const { toast, Toaster } = useToast();


  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "The value has been copied to your clipboard.",
    });
  };

  const PreviewBox: React.FC<{
    contentWidth: number;
    contentHeight: number;
    containerWidth: number;
    containerHeight: number;
  }> = ({ contentWidth, contentHeight, containerWidth, containerHeight }) => {
    const scale = Math.min(
      containerWidth / contentWidth,
      containerHeight / contentHeight
    );
    
    const scaledWidth = contentWidth * scale;
    const scaledHeight = contentHeight * scale;
    
    return (
      <div 
        className="bg-muted w-full h-64 relative flex items-center justify-center"
        style={{ 
          width: containerWidth,
          height: containerHeight 
        }}
      >
        <div
          className="bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center text-blue-700"
          style={{
            width: scaledWidth,
            height: scaledHeight
          }}
        >
          {contentWidth}x{contentHeight}
        </div>
      </div>
    );
  };

  const CropPreview: React.FC<{
    width: number;
    height: number;
    cropDimensions: CropSuggestion;
  }> = ({ width, height, cropDimensions }) => {
    const containerSize = 300;
    const scale = Math.min(
      containerSize / width,
      containerSize / height
    );

    return (
      <div className="relative" style={{ 
        width: width * scale, 
        height: height * scale 
      }}>
        <div className="absolute inset-0 bg-gray-200" />
        <div
          className="absolute bg-blue-500/20 border-2 border-blue-500"
          style={{
            left: cropDimensions.crop_x * scale,
            top: cropDimensions.crop_y * scale,
            width: cropDimensions.crop_width * scale,
            height: cropDimensions.crop_height * scale,
          }}
        />
      </div>
    );
  };

  return (
    <>
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Aspect Ratio Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="ratio-preset">Common Ratios</Label>
              <Select
                onValueChange={(value) => {
                  const [w, h] = value.split(':').map(Number);
                  setDimensions({ width: w * 100, height: h * 100 });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a common ratio" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(COMMON_RATIOS).map(([name, { ratio, description }]) => (
                    <SelectItem key={name} value={name}>
                      <div className="flex items-center gap-2">
                        <span>{name}</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent>{description}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contentWidth">Content Width</Label>
              <div className="flex gap-2">
                <Input
                  id="contentWidth"
                  type="number"
                  value={dimensions.width}
                  onChange={(e) => setDimensions(prev => ({ ...prev, width: Number(e.target.value) }))}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(dimensions.width.toString())}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contentHeight">Content Height</Label>
              <div className="flex gap-2">
                <Input
                  id="contentHeight"
                  type="number"
                  value={dimensions.height}
                  onChange={(e) => setDimensions(prev => ({ ...prev, height: Number(e.target.value) }))}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(dimensions.height.toString())}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="screenWidth">Screen Width</Label>
              <Input
                id="screenWidth"
                type="number"
                value={screenDimensions.width}
                onChange={(e) => setScreenDimensions(prev => ({ ...prev, width: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="screenHeight">Screen Height</Label>
              <Input
                id="screenHeight"
                type="number"
                value={screenDimensions.height}
                onChange={(e) => setScreenDimensions(prev => ({ ...prev, height: Number(e.target.value) }))}
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="analysis" className="mt-6">
          <TabsList>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="display">Display</TabsTrigger>
            <TabsTrigger value="crop">Crop</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-4">
            {analysis && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p>Original Dimensions: {analysis.original_dimensions}</p>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(analysis.original_dimensions)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p>Simplified Ratio: {analysis.simplified_ratio}</p>
                  <p>Decimal Ratio: {analysis.decimal_ratio}</p>
                  <p>Closest Common Ratio: {analysis.closest_common_ratio.ratio} ({analysis.closest_common_ratio.description})</p>
                  <p>Difference from Common: {analysis.difference_from_common.toFixed(3)}</p>
                </div>
                
                <div className="mt-4">
                  <PreviewBox
                    contentWidth={dimensions.width}
                    contentHeight={dimensions.height}
                    containerWidth={400}
                    containerHeight={300}
                  />
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="display" className="space-y-4">
            {boxCalc && (
              <>
                <div className="space-y-2">
                  <p>Type: {boxCalc.type}</p>
                  <div className="flex items-center gap-2">
                    <p>Display dimensions: {boxCalc.display_width}x{boxCalc.display_height}</p>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(`${boxCalc.display_width}x${boxCalc.display_height}`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p>Top/Bottom padding: {boxCalc.padding_top}px</p>
                  <p>Left/Right padding: {boxCalc.padding_side}px</p>
                </div>

                <div className="mt-4">
                  <PreviewBox
                    contentWidth={boxCalc.display_width}
                    contentHeight={boxCalc.display_height}
                    containerWidth={screenDimensions.width}
                    containerHeight={screenDimensions.height}
                  />
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="crop" className="space-y-4">
            {cropSuggestion && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p>Crop dimensions: {cropSuggestion.crop_width}x{cropSuggestion.crop_height}</p>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(`${cropSuggestion.crop_width}x${cropSuggestion.crop_height}`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p>Crop position: X={cropSuggestion.crop_x}, Y={cropSuggestion.crop_y}</p>
                  <p>Area preserved: {cropSuggestion.area_preserved}</p>
                </div>

                <div className="mt-4">
                  <CropPreview
                    width={dimensions.width}
                    height={dimensions.height}
                    cropDimensions={cropSuggestion}
                  />
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
    <Toaster />
    </>
  );
};

export default AspectRatioCalculator;