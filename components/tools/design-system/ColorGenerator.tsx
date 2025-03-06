"use client";

import React, { useState, useEffect } from 'react';
import { useDesignSystem } from './DesignSystemContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Define types for color shades and settings
interface ColorShade {
  name: string;
  value: string;
}

interface ColorAdjustment {
  contrast: number;
  saturation: number;
  luminance: number;
}

const ColorGenerator: React.FC = () => {
  const { colors, updateColors } = useDesignSystem();
  const { toast } = useToast();
  const [activeColor, setActiveColor] = useState<string>('primary');
  const [baseColor, setBaseColor] = useState<string>(colors[activeColor as keyof typeof colors].color);
  const [colorName, setColorName] = useState<string>(colors[activeColor as keyof typeof colors].name);
  const [contrast, setContrast] = useState<number>(0);
  const [saturation, setSaturation] = useState<number>(0);
  const [luminance, setLuminance] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Update local state when activeColor changes
  useEffect(() => {
    if (!isGenerating) {
      setBaseColor(colors[activeColor as keyof typeof colors].color);
      setColorName(colors[activeColor as keyof typeof colors].name);
      setContrast(0);
      setSaturation(0);
      setLuminance(0);
    }
  }, [activeColor, colors, isGenerating]);

  // Function to generate color shades
  const generateShades = (baseHex: string, adjust: ColorAdjustment): ColorShade[] => {
    // A simple algorithm to generate shades from base color
    const shades: ColorShade[] = [];

    // Create 11 shades (50-950)
    const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

    // For each step, adjust the base color to create a shade
    steps.forEach((step, index) => {
      // Calculate lightness factor: lighter for lower numbers, darker for higher
      const lightnessFactor = 1 - (index / (steps.length - 1));

      // Simple RGB color manipulation for demo purposes
      // In a real implementation, consider using a color library
      const r = parseInt(baseHex.slice(1, 3), 16);
      const g = parseInt(baseHex.slice(3, 5), 16);
      const b = parseInt(baseHex.slice(5, 7), 16);;

      // Apply lightness factor
      let lr = Math.min(255, Math.max(0, Math.round(r + (255 - r) * lightnessFactor * (1 + adjust.luminance / 100))));
      let lg = Math.min(255, Math.max(0, Math.round(g + (255 - g) * lightnessFactor * (1 + adjust.luminance / 100))));
      let lb = Math.min(255, Math.max(0, Math.round(b + (255 - b) * lightnessFactor * (1 + adjust.luminance / 100))));

      // Apply contrast and saturation (simplified)
      if (adjust.contrast !== 0) {
        // Increase contrast by pushing colors away from middle gray
        const contrastFactor = 1 + (adjust.contrast / 200);
        lr = Math.min(255, Math.max(0, Math.round(128 + (lr - 128) * contrastFactor)));
        lg = Math.min(255, Math.max(0, Math.round(128 + (lg - 128) * contrastFactor)));
        lb = Math.min(255, Math.max(0, Math.round(128 + (lb - 128) * contrastFactor)));
      }

      if (adjust.saturation !== 0) {
        // Simplified saturation adjustment
        const avg = (lr + lg + lb) / 3;
        const satFactor = 1 + (adjust.saturation / 100);
        lr = Math.min(255, Math.max(0, Math.round(avg + (lr - avg) * satFactor)));
        lg = Math.min(255, Math.max(0, Math.round(avg + (lg - avg) * satFactor)));
        lb = Math.min(255, Math.max(0, Math.round(avg + (lb - avg) * satFactor)));
      }

      // Convert back to hex
      const adjustedHex = '#' +
        lr.toString(16).padStart(2, '0') +
        lg.toString(16).padStart(2, '0') +
        lb.toString(16).padStart(2, '0');

      shades.push({
        name: step.toString(),
        value: adjustedHex
      });
    });

    return shades;
  };

  // Update colors when sliders change
  const handleColorAdjustment = () => {
    setIsGenerating(true);

    const newShades = generateShades(baseColor, {
      contrast,
      saturation,
      luminance
    });

    // Prevent unnecessary state updates
    const currentShades = colors[activeColor as keyof typeof colors].shades;
    const currentColor = colors[activeColor as keyof typeof colors].color;
    const currentName = colors[activeColor as keyof typeof colors].name;

    if (
      currentColor !== baseColor ||
      currentName !== colorName ||
      JSON.stringify(currentShades) !== JSON.stringify(newShades)
    ) {
      updateColors({
        [activeColor]: {
          ...colors[activeColor as keyof typeof colors],
          color: baseColor,
          name: colorName,
          shades: newShades
        }
      });
    }

    setIsGenerating(false);

    toast({
      title: "Colors updated",
      description: `${colorName} color palette has been updated.`,
    });
  };

  // Handle color input change
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBaseColor(e.target.value);
  };

  // Handle color name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColorName(e.target.value);
  };

  // Update colors on tab change
  const handleTabChange = (value: string) => {
    if (colors[value as keyof typeof colors]) {
      setActiveColor(value);
    }
  };

  // Copy color to clipboard
  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    toast({
      title: "Copied!",
      description: `${hex} has been copied to clipboard`,
    });
  };

  // Generate CSS for all colors
  const generateCSS = () => {
    let css = `:root {\n`;
    let darkCss = `  .dark {\n`;

    Object.entries(colors).forEach(([key, colorObj]) => {
      colorObj.shades.forEach((shade: ColorShade) => {
        css += `  --${key}-${shade.name}: ${shade.value};\n`;
        // For dark mode, invert the shades (950 becomes 50, etc.)
        const darkIndex = colorObj.shades.length - 1 - colorObj.shades.findIndex((s: ColorShade) => s.name === shade.name);
        if (darkIndex >= 0 && darkIndex < colorObj.shades.length) {
          darkCss += `    --${key}-${shade.name}: ${colorObj.shades[darkIndex].value};\n`;
        }
      });
    });

    css += `\n` + darkCss + `  }\n}`;
    return css;
  };

  // Generate a new random color
  const generateRandomColor = () => {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setBaseColor(randomColor);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeColor} onValueChange={handleTabChange}>
        <div className="overflow-x-auto pb-2">
          <TabsList className="w-full justify-start">
            {Object.keys(colors).map(color => (
              <TabsTrigger key={color} value={color} className="min-w-[100px] capitalize">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: colors[color as keyof typeof colors].color }}
                ></div>
                {color}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {Object.keys(colors).map(colorKey => (
          <TabsContent key={colorKey} value={colorKey} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-end space-x-2">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="colorName">Color Name</Label>
                    <Input
                      id="colorName"
                      value={colorName}
                      onChange={handleNameChange}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="baseColor">Base Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="baseColor"
                        value={baseColor}
                        onChange={handleColorChange}
                      />
                      <div className="flex-shrink-0 w-10 h-10 rounded-md border overflow-hidden">
                        <input
                          type="color"
                          value={baseColor}
                          onChange={handleColorChange}
                          className="w-10 h-10 cursor-pointer"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={generateRandomColor}
                        title="Generate random color"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="luminance">Luminance</Label>
                      <span className="text-sm text-muted-foreground">{luminance}</span>
                    </div>
                    <Slider
                      id="luminance"
                      min={-50}
                      max={50}
                      step={1}
                      value={[luminance]}
                      onValueChange={values => setLuminance(values[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="saturation">Saturation</Label>
                      <span className="text-sm text-muted-foreground">{saturation}</span>
                    </div>
                    <Slider
                      id="saturation"
                      min={-50}
                      max={50}
                      step={1}
                      value={[saturation]}
                      onValueChange={values => setSaturation(values[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="contrast">Contrast</Label>
                      <span className="text-sm text-muted-foreground">{contrast}</span>
                    </div>
                    <Slider
                      id="contrast"
                      min={-50}
                      max={50}
                      step={1}
                      value={[contrast]}
                      onValueChange={values => setContrast(values[0])}
                    />
                  </div>

                  <Button
                    onClick={handleColorAdjustment}
                    className="w-full"
                  >
                    Apply Changes
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Color Scale</Label>
                <div className="grid grid-cols-1 gap-2 rounded-md border p-1">
                  {colors[colorKey as keyof typeof colors].shades.map((shade: ColorShade) => (
                    <div
                      key={shade.name}
                      className="flex items-center p-2 rounded-md hover:bg-muted"
                    >
                      <div
                        className="w-8 h-8 rounded-md mr-3 flex-shrink-0"
                        style={{ backgroundColor: shade.value }}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span>{`${colorKey}-${shade.name}`}</span>
                          <span>{shade.value}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(shade.value)}
                        className="ml-2 opacity-50 hover:opacity-100"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-6 space-y-4">
        <Label>CSS Output</Label>
        <div className="flex items-start gap-2">
          <pre className="p-4 bg-muted rounded-lg overflow-auto font-mono text-sm flex-1 max-h-[300px]">
            <code>{generateCSS()}</code>
          </pre>
          <Button
            variant="outline"
            size="icon"
            onClick={() => copyToClipboard(generateCSS())}
            aria-label="Copy CSS to clipboard"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ColorGenerator;