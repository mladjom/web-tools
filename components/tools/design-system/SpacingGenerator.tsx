"use client";

import React, { useState } from 'react';
import { useDesignSystem } from './DesignSystemContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Plus, Trash } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SpacingGenerator: React.FC = () => {
  const { spacing, updateSpacing } = useDesignSystem();
  const { toast } = useToast();
  const [tempBaseUnit, setTempBaseUnit] = useState(spacing.baseUnit);
  const [customSpacingValue, setCustomSpacingValue] = useState('');
  const [previewType, setPreviewType] = useState<'margin' | 'padding'>('margin');

  // Handle spacing base unit change
  const handleBaseUnitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setTempBaseUnit(value);
    }
  };

  // Update spacing when base unit changes
  const applyBaseUnitChange = () => {
    updateSpacing({
      ...spacing,
      baseUnit: tempBaseUnit
    });
    toast({
      title: "Base unit updated",
      description: `Base unit set to ${tempBaseUnit}px`,
    });
  };

  // Add custom spacing value
  const addCustomSpacing = () => {
    const value = parseInt(customSpacingValue);
    if (!isNaN(value) && value > 0) {
      // Check if value already exists
      if (!spacing.scale.includes(value)) {
        const newScale = [...spacing.scale, value].sort((a, b) => a - b);
        updateSpacing({
          ...spacing,
          scale: newScale
        });
        setCustomSpacingValue('');
        toast({
          title: "Custom spacing added",
          description: `Added ${value}px to spacing scale`,
        });
      } else {
        toast({
          title: "Duplicate value",
          description: `${value}px already exists in the spacing scale`,
          variant: "destructive"
        });
      }
    }
  };

  // Remove a spacing value
  const removeSpacing = (value: number) => {
    const newScale = spacing.scale.filter(v => v !== value);
    updateSpacing({
      ...spacing,
      scale: newScale
    });
    toast({
      title: "Spacing removed",
      description: `Removed ${value}px from spacing scale`,
    });
  };

  // Update breakpoint value
  const updateBreakpoint = (key: keyof typeof spacing.breakpoints, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      updateSpacing({
        ...spacing,
        breakpoints: {
          ...spacing.breakpoints,
          [key]: numValue
        }
      });
    }
  };

  // Generate CSS output
  const generateCSS = () => {
    let css = `:root {\n`;
    
    // Spacing scale
    css += `  /* Spacing Scale */\n`;
    spacing.scale.forEach((value, index) => {
      css += `  --space-${index}: ${value / 16}rem; /* ${value}px */\n`;
    });
    
    // Breakpoints
    css += `\n  /* Breakpoints */\n`;
    Object.entries(spacing.breakpoints).forEach(([key, value]) => {
      css += `  --breakpoint-${key}: ${value}px;\n`;
    });
    
    css += `}`;
    return css;
  };

  // Copy CSS to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "CSS copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="baseUnit">Base Spacing Unit (px)</Label>
            <div className="flex space-x-2">
              <Input
                id="baseUnit"
                type="number"
                min={1}
                value={tempBaseUnit}
                onChange={handleBaseUnitChange}
              />
              <Button onClick={applyBaseUnitChange}>Apply</Button>
            </div>
            <p className="text-sm text-muted-foreground">
              The base unit is used to generate consistent spacing throughout your design system.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customSpacing">Add Custom Spacing (px)</Label>
            <div className="flex space-x-2">
              <Input
                id="customSpacing"
                type="number"
                min={1}
                value={customSpacingValue}
                onChange={(e) => setCustomSpacingValue(e.target.value)}
                placeholder="Enter a value in pixels"
              />
              <Button onClick={addCustomSpacing}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Breakpoints</Label>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(spacing.breakpoints).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={`breakpoint-${key}`} className="capitalize">{key}</Label>
                <Input
                  id={`breakpoint-${key}`}
                  type="number"
                  min={1}
                  value={value}
                  onChange={(e) => updateBreakpoint(key as keyof typeof spacing.breakpoints, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4 mt-8">
        <div className="flex justify-between items-center">
          <Label>Spacing Scale</Label>
          <Tabs value={previewType} onValueChange={(v) => setPreviewType(v as 'margin' | 'padding')}>
            <TabsList>
              <TabsTrigger value="margin">Margin</TabsTrigger>
              <TabsTrigger value="padding">Padding</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {spacing.scale.map((value, index) => (
            <div key={value} className="border rounded-md p-4 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="font-medium">space-{index}</span>
                  <span className="text-sm text-muted-foreground ml-2">{value}px</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSpacing(value)}
                  className="h-8 w-8"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Visual preview */}
              <div className="bg-muted rounded flex-1 relative min-h-[100px]">
                <div 
                  className="bg-primary h-full rounded flex items-center justify-center text-primary-foreground"
                  style={{
                    ...(previewType === 'margin' 
                      ? { margin: `${value}px` } 
                      : { padding: `${value}px` }),
                  }}
                >
                  {previewType === 'padding' ? (
                    <div className="bg-background rounded h-full w-full flex items-center justify-center">
                      {value}px
                    </div>
                  ) : (
                    <span>{value}px</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 space-y-4">
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

export default SpacingGenerator;