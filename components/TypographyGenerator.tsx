"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Copy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/useToast'

interface Settings {
  baseFontSize: number;
  baseLineHeight: number;
  scaleRatio: number;
  baseUnit: number;
}

interface RhythmValues {
  single: number;
  half: number;
  double: number;
}

interface ScaleItem {
  step: number;
  rem: string;
  px: string;
  lineHeight: string;
  letterSpacing: string;
  rhythm: {
    single: string;
    half: string;
    double: string;
  };
}

interface Output {
  css: string;
  scss: string;
  scale: ScaleItem[];
}

const RATIO_OPTIONS: Record<string, number> = {
  'Minor Second (1.067)': 1.067,
  'Major Second (1.125)': 1.125,
  'Minor Third (1.2)': 1.2,
  'Major Third (1.25)': 1.25,
  'Perfect Fourth (1.333)': 1.333,
  'Perfect Fifth (1.5)': 1.5,
  'Golden Ratio (1.618)': 1.618
};

const TypographyGenerator: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    baseFontSize: 16,
    baseLineHeight: 1.5,
    scaleRatio: 1.333,
    baseUnit: 8,
  });

  const [output, setOutput] = useState<Output>({
    css: '',
    scss: '',
    scale: [],
  });

  const { toast, Toaster } = useToast();

  const calculateLineHeight = useCallback((fontSize: number): number => {
    if (fontSize < 16) return 1.6;
    else if (fontSize >= 16 && fontSize <= 24) return 1.5;
    else if (fontSize > 24 && fontSize <= 32) return 1.3;
    else return 1.2;
  }, []);

  const calculateLetterSpacing = useCallback((fontSize: number, isHeading: boolean = false): number => {
    if (isHeading) return fontSize > 32 ? -0.02 : -0.01;
    else return fontSize < 16 ? 0.015 : 0;
  }, []);

  const calculateRhythm = useCallback((fontSize: number, lineHeight: number): RhythmValues => {
    const baseRhythm = Math.round(fontSize * lineHeight);
    return {
      single: baseRhythm,
      half: baseRhythm / 2,
      double: baseRhythm * 2,
    };
  }, []);

  const generateScale = useCallback((): ScaleItem[] => {
    const scale: ScaleItem[] = [];
    for (let i = -2; i <= 8; i++) {
      const size = settings.baseFontSize * Math.pow(settings.scaleRatio, i);
      const remSize = (size / 16).toFixed(3);
      const pxSize = size.toFixed(1);
      const lineHeight = calculateLineHeight(size);
      const letterSpacing = calculateLetterSpacing(size, i > 2);
      const rhythm = calculateRhythm(size, lineHeight);

      scale.push({
        step: i,
        rem: remSize,
        px: pxSize,
        lineHeight: lineHeight.toFixed(3),
        letterSpacing: letterSpacing.toFixed(3),
        rhythm: {
          single: (rhythm.single / 16).toFixed(3),
          half: (rhythm.half / 16).toFixed(3),
          double: (rhythm.double / 16).toFixed(3),
        },
      });
    }
    return scale;
  }, [settings, calculateLineHeight, calculateLetterSpacing, calculateRhythm]);

  const generateCSS = useCallback((scale: ScaleItem[]): string => {
    return `:root {
  /* Base Values */
  --base-font-size: ${settings.baseFontSize}px;
  --base-line-height: ${settings.baseLineHeight};
  --scale-ratio: ${settings.scaleRatio};
  --base-unit: ${settings.baseUnit}px;

  /* Font Scale with Computed Metrics */
${scale.map(s => `
  /* Step ${s.step} - ${s.px}px */
  --text-${s.step}: ${s.rem}rem;
  --leading-${s.step}: ${s.lineHeight};
  --tracking-${s.step}: ${s.letterSpacing}em;
  --rhythm-${s.step}: ${s.rhythm.single}rem;
  --rhythm-${s.step}-half: ${s.rhythm.half}rem;
  --rhythm-${s.step}-double: ${s.rhythm.double}rem;`).join('\n')}

  /* Spacing Scale */
${Array.from({ length: 8 }, (_, i) => `  --space-${i + 1}: ${(settings.baseUnit * (i + 1)) / 16}rem;`).join('\n')}
}`;
  }, [settings]);

  const generateSCSS = useCallback((scale: ScaleItem[]): string => {
    return `// Typography System
$base-font-size: ${settings.baseFontSize}px;
$base-line-height: ${settings.baseLineHeight};
$scale-ratio: ${settings.scaleRatio};
$base-unit: ${settings.baseUnit}px;

// Font Scale with Computed Metrics
${scale.map(s => `
// Step ${s.step} - ${s.px}px
$text-${s.step}: ${s.rem}rem;
$leading-${s.step}: ${s.lineHeight};
$tracking-${s.step}: ${s.letterSpacing}em;
$rhythm-${s.step}: ${s.rhythm.single}rem;
$rhythm-${s.step}-half: ${s.rhythm.half}rem;
$rhythm-${s.step}-double: ${s.rhythm.double}rem;`).join('\n')}`;
  }, [settings]);

  useEffect(() => {
    const scale = generateScale();
    setOutput({
      scale,
      css: generateCSS(scale),
      scss: generateSCSS(scale),
    });
  }, [settings, generateScale, generateCSS, generateSCSS]);

  const handleChange = (key: keyof Settings, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setSettings(prev => ({ ...prev, [key]: numValue }));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "The code has been copied to your clipboard.",
    });
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Typography System Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <Label htmlFor="baseFontSize">Base Font Size (px)</Label>
            <Input
              id="baseFontSize"
              type="number"
              value={settings.baseFontSize}
              onChange={(e) => handleChange('baseFontSize', e.target.value)}
              min="12"
              max="24"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="scaleRatio">Scale Ratio</Label>
            <Select 
              value={settings.scaleRatio.toString()} 
              onValueChange={(value) => handleChange('scaleRatio', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a scale ratio" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(RATIO_OPTIONS).map(([name, value]) => (
                  <SelectItem key={value} value={value.toString()}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="baseLineHeight">Base Line Height</Label>
            <Input
              id="baseLineHeight"
              type="number"
              step="0.1"
              value={settings.baseLineHeight}
              onChange={(e) => handleChange('baseLineHeight', e.target.value)}
              min="1"
              max="2"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="baseUnit">Base Unit (px)</Label>
            <Input
              id="baseUnit"
              type="number"
              value={settings.baseUnit}
              onChange={(e) => handleChange('baseUnit', e.target.value)}
              min="4"
              max="16"
            />
          </div>
        </div>

        <Tabs defaultValue="preview" className="mt-6">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="css">CSS</TabsTrigger>
            <TabsTrigger value="scss">SCSS</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-4">
            <div className="space-y-4">
              <h3 className="font-medium">Type Scale with Metrics</h3>
              <div className="space-y-2">
                {output.scale.map((size) => (
                  <div key={size.step} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="w-16 text-sm text-muted-foreground">Step {size.step}</span>
                      <span className="w-24 text-sm text-muted-foreground">{size.rem}rem</span>
                      <span className="text-sm text-muted-foreground">{size.px}px</span>
                    </div>
                    <div 
                      style={{ 
                        fontSize: `${size.rem}rem`,
                        lineHeight: size.lineHeight,
                        letterSpacing: `${size.letterSpacing}em`,
                        marginBottom: `${size.rhythm.single}rem`
                      }}
                      aria-label={`Text sample for step ${size.step}`}
                    >
                      The quick brown fox
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <div>Line Height: {size.lineHeight}</div>
                      <div>Letter Spacing: {size.letterSpacing}em</div>
                      <div>Vertical Rhythm: {size.rhythm.single}rem</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="css">
            <div className="flex items-start gap-2">
              <pre className="p-4 bg-muted rounded-lg overflow-auto font-mono text-sm flex-1">
                <code>{output.css}</code>
              </pre>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(output.css)}
                aria-label="Copy CSS to clipboard"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="scss">
            <div className="flex items-start gap-2">
              <pre className="p-4 bg-muted rounded-lg overflow-auto font-mono text-sm flex-1">
                <code>{output.scss}</code>
              </pre>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(output.scss)}
                aria-label="Copy SCSS to clipboard"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <Toaster />
    </Card>
  );
};

export default TypographyGenerator;