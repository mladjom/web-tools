"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Dimensions {
  width: number;
  height: number;
}

interface AspectRatioAnalysis {
  original_dimensions: string;
  simplified_ratio: string;
  decimal_ratio: string;
  closest_common_ratio: string;
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

const COMMON_RATIOS: Record<number, string> = {
  1.33: "4:3 (Standard)",
  1.77: "16:9 (HD Widescreen)",
  1.85: "1.85:1 (Cinema Wide)",
  2.35: "2.35:1 (Anamorphic Widescreen)",
  1.50: "3:2 (Classic 35mm)",
  1.00: "1:1 (Square)",
  1.91: "1.91:1 (Digital IMAX)",
  2.76: "2.76:1 (Ultra Panavision)",
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

  const [targetRatio] = useState<number>(2.35);
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

    const closest_ratio = Object.keys(COMMON_RATIOS)
      .map(Number)
      .reduce((a, b) => 
        Math.abs(b - decimal_ratio) < Math.abs(a - decimal_ratio) ? b : a
      );

    return {
      original_dimensions: `${width}x${height}`,
      simplified_ratio: `${simplified_width.toFixed(0)}:${simplified_height.toFixed(0)}`,
      decimal_ratio: `${decimal_ratio.toFixed(3)}:1`,
      closest_common_ratio: COMMON_RATIOS[closest_ratio],
      difference_from_common: Math.abs(decimal_ratio - closest_ratio)
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

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Aspect Ratio Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="contentWidth">Content Width</Label>
              <Input
                id="contentWidth"
                type="number"
                value={dimensions.width}
                onChange={(e) => setDimensions(prev => ({ ...prev, width: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="contentHeight">Content Height</Label>
              <Input
                id="contentHeight"
                type="number"
                value={dimensions.height}
                onChange={(e) => setDimensions(prev => ({ ...prev, height: Number(e.target.value) }))}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="screenWidth">Screen Width</Label>
              <Input
                id="screenWidth"
                type="number"
                value={screenDimensions.width}
                onChange={(e) => setScreenDimensions(prev => ({ ...prev, width: Number(e.target.value) }))}
              />
            </div>
            <div>
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
              <div className="space-y-2">
                <p>Original Dimensions: {analysis.original_dimensions}</p>
                <p>Simplified Ratio: {analysis.simplified_ratio}</p>
                <p>Decimal Ratio: {analysis.decimal_ratio}</p>
                <p>Closest Common Ratio: {analysis.closest_common_ratio}</p>
                <p>Difference from Common: {analysis.difference_from_common.toFixed(3)}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="display" className="space-y-4">
            {boxCalc && (
              <div className="space-y-2">
                <p>Type: {boxCalc.type}</p>
                <p>Display dimensions: {boxCalc.display_width}x{boxCalc.display_height}</p>
                <p>Top/Bottom padding: {boxCalc.padding_top}px</p>
                <p>Left/Right padding: {boxCalc.padding_side}px</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="crop" className="space-y-4">
            {cropSuggestion && (
              <div className="space-y-2">
                <p>Crop dimensions: {cropSuggestion.crop_width}x{cropSuggestion.crop_height}</p>
                <p>Crop position: X={cropSuggestion.crop_x}, Y={cropSuggestion.crop_y}</p>
                <p>Area preserved: {cropSuggestion.area_preserved}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AspectRatioCalculator;