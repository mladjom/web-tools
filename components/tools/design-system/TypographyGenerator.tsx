"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Copy } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/use-toast';
import { useDesignSystem } from './DesignSystemContext';

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
  const { toast } = useToast();
  const { typography, updateTypography } = useDesignSystem();
  const [fontFamily, setFontFamily] = useState({
    body: typography.fontFamily.body,
    heading: typography.fontFamily.heading,
    monospace: typography.fontFamily.monospace
  });
  
  const [output, setOutput] = useState<Output>({
    css: '',
    scss: '',
    scale: [],
  });
  
  const [isGenerating, setIsGenerating] = useState(false);

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

  const calculateRhythm = useCallback((fontSize: number, lineHeight: number) => {
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
      const size = typography.baseFontSize * Math.pow(typography.scaleRatio, i);
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
  }, [typography.baseFontSize, typography.baseLineHeight, typography.scaleRatio, typography.baseUnit, calculateLineHeight, calculateLetterSpacing, calculateRhythm]);

  const generateCSS = useCallback((scale: ScaleItem[]): string => {
    return `:root {
  /* Base Values */
  --base-font-size: ${typography.baseFontSize}px;
  --base-line-height: ${typography.baseLineHeight};
  --scale-ratio: ${typography.scaleRatio};
  --base-unit: ${typography.baseUnit}px;
  --font-family-body: ${typography.fontFamily.body};
  --font-family-heading: ${typography.fontFamily.heading};
  --font-family-mono: ${typography.fontFamily.monospace};

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
${Array.from({ length: 8 }, (_, i) => `  --space-${i + 1}: ${(typography.baseUnit * (i + 1)) / 16}rem;`).join('\n')}
}`;
  }, [typography]);

  const generateSCSS = useCallback((scale: ScaleItem[]): string => {
    return `// Typography System
$base-font-size: ${typography.baseFontSize}px;
$base-line-height: ${typography.baseLineHeight};
$scale-ratio: ${typography.scaleRatio};
$base-unit: ${typography.baseUnit}px;
$font-family-body: ${typography.fontFamily.body};
$font-family-heading: ${typography.fontFamily.heading};
$font-family-mono: ${typography.fontFamily.monospace};

// Font Scale with Computed Metrics
${scale.map(s => `
// Step ${s.step} - ${s.px}px
$text-${s.step}: ${s.rem}rem;
$leading-${s.step}: ${s.lineHeight};
$tracking-${s.step}: ${s.letterSpacing}em;
$rhythm-${s.step}: ${s.rhythm.single}rem;
$rhythm-${s.step}-half: ${s.rhythm.half}rem;
$rhythm-${s.step}-double: ${s.rhythm.double}rem;`).join('\n')}`;
  }, [typography]);

  useEffect(() => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    
    const scale = generateScale();
    setOutput({
      scale,
      css: generateCSS(scale),
      scss: generateSCSS(scale),
    });
    
    // Only update the context if the scale has actually changed
    if (!typography.scale || JSON.stringify(typography.scale) !== JSON.stringify(scale)) {
      updateTypography({
        ...typography,
        scale
      });
    }
    
    setIsGenerating(false);
  }, [
    typography.baseFontSize,
    typography.baseLineHeight,
    typography.scaleRatio, 
    typography.baseUnit,
    typography.fontFamily,
    generateScale,
    generateCSS,
    generateSCSS,
    updateTypography,
    isGenerating
  ]);

  const handleChange = (key: keyof typeof typography, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      updateTypography({
        ...typography,
        [key]: numValue
      });
    }
  };

  const handleFontFamilyChange = (key: keyof typeof fontFamily, value: string) => {
    setFontFamily(prev => ({ ...prev, [key]: value }));
    updateTypography({
      ...typography,
      fontFamily: {
        ...typography.fontFamily,
        [key]: value
      }
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "The code has been copied to your clipboard.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <Label htmlFor="baseFontSize">Base Font Size (px)</Label>
          <Input
            id="baseFontSize"
            type="number"
            value={typography.baseFontSize}
            onChange={(e) => handleChange('baseFontSize', e.target.value)}
            min="12"
            max="24"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="scaleRatio">Scale Ratio</Label>
          <Select 
            value={typography.scaleRatio.toString()} 
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
            value={typography.baseLineHeight}
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
            value={typography.baseUnit}
            onChange={(e) => handleChange('baseUnit', e.target.value)}
            min="4"
            max="16"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="space-y-2">
          <Label htmlFor="bodyFont">Body Font</Label>
          <Input
            id="bodyFont"
            value={fontFamily.body}
            onChange={(e) => handleFontFamilyChange('body', e.target.value)}
            placeholder="Inter, system-ui, sans-serif"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="headingFont">Heading Font</Label>
          <Input
            id="headingFont"
            value={fontFamily.heading}
            onChange={(e) => handleFontFamilyChange('heading', e.target.value)}
            placeholder="Inter, system-ui, sans-serif"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="monoFont">Monospace Font</Label>
          <Input
            id="monoFont"
            value={fontFamily.monospace}
            onChange={(e) => handleFontFamilyChange('monospace', e.target.value)}
            placeholder="monospace"
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
                      fontFamily: size.step > 2 ? typography.fontFamily.heading : typography.fontFamily.body,
                      fontSize: `${size.rem}rem`,
                      lineHeight: size.lineHeight,
                      letterSpacing: `${size.letterSpacing}em`,
                      marginBottom: `${size.rhythm.single}rem`
                    }}
                    aria-label={`Text sample for step ${size.step}`}
                  >
                    {size.step > 2 ? 'Heading Typography' : 'The quick brown fox jumps over the lazy dog'}
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
    </div>
  );
};

export default TypographyGenerator;