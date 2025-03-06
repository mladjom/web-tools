"use client";

import React, { useState } from 'react';
import { useDesignSystem } from './DesignSystemContext';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Copy, FileJson, FileCode } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Define types for color shades
interface ColorShade {
  name: string;
  value: string;
}


const ExportSystem: React.FC = () => {
  const { typography, colors, spacing, components, exportDesignSystem } = useDesignSystem();
  const { toast } = useToast();
  
  const [exportFormat, setExportFormat] = useState<'css' | 'scss' | 'json' | 'tailwind'>('css');
  const [exportOptions, setExportOptions] = useState({
    typography: true,
    colors: true,
    spacing: true,
    components: true,
    darkMode: true,
  });

  // Generate CSS variables
  const generateCSS = () => {
    let css = `:root {\n`;
    
    // Typography variables
    if (exportOptions.typography) {
      css += `  /* Typography */\n`;
      css += `  --base-font-size: ${typography.baseFontSize}px;\n`;
      css += `  --base-line-height: ${typography.baseLineHeight};\n`;
      css += `  --font-family-body: ${typography.fontFamily.body};\n`;
      css += `  --font-family-heading: ${typography.fontFamily.heading};\n`;
      css += `  --font-family-mono: ${typography.fontFamily.monospace};\n\n`;
      
      if (typography.scale) {
        typography.scale.forEach(size => {
          css += `  --text-${size.step}: ${size.rem}rem;\n`;
          css += `  --leading-${size.step}: ${size.lineHeight};\n`;
          css += `  --tracking-${size.step}: ${size.letterSpacing}em;\n`;
          css += `  --rhythm-${size.step}: ${size.rhythm.single}rem;\n`;
        });
        css += '\n';
      }
    }
    
    // Color variables
    if (exportOptions.colors) {
      css += `  /* Colors */\n`;
      Object.entries(colors).forEach(([colorName, colorObj]) => {
        colorObj.shades.forEach((shade: ColorShade) => {
          css += `  --${colorName}-${shade.name}: ${shade.value};\n`;
        });
      });
      css += '\n';
    }
    
    // Spacing variables
    if (exportOptions.spacing) {
      css += `  /* Spacing */\n`;
      spacing.scale.forEach((value, index) => {
        css += `  --space-${index}: ${value / 16}rem;\n`;
      });
      css += '\n';
      
      css += `  /* Breakpoints */\n`;
      Object.entries(spacing.breakpoints).forEach(([key, value]) => {
        css += `  --breakpoint-${key}: ${value}px;\n`;
      });
      css += '\n';
    }
    
    // Component variables
    if (exportOptions.components) {
      css += `  /* Border Radius */\n`;
      Object.entries(components.borderRadius).forEach(([name, value]) => {
        css += `  --radius-${name}: ${value};\n`;
      });
      css += '\n';
      
      css += `  /* Border Width */\n`;
      Object.entries(components.borderWidth).forEach(([name, value]) => {
        css += `  --border-${name}: ${value};\n`;
      });
      css += '\n';
      
      css += `  /* Box Shadow */\n`;
      components.boxShadow.forEach((shadow, i) => {
        const name = i === 0 ? 'none' : i === 1 ? 'sm' : i === 2 ? 'md' : i === 3 ? 'lg' : i === 4 ? 'xl' : '2xl';
        css += `  --shadow-${name}: ${shadow};\n`;
      });
      css += '\n';
      
      css += `  /* Transitions */\n`;
      Object.entries(components.transitions).forEach(([name, value]) => {
        css += `  --transition-${name}: ${value};\n`;
      });
    }
    
    css += `}\n`;
    
    // Dark mode
    if (exportOptions.darkMode) {
      css += `\n.dark {\n`;
      
      // Dark colors
      if (exportOptions.colors) {
        Object.entries(colors).forEach(([colorName, colorObj]) => {
          colorObj.shades.forEach((shade: ColorShade, index: number) => {
            // Invert the shade index for dark mode (950 becomes 50, etc.)
            const darkIndex = colorObj.shades.length - 1 - index;
            if (darkIndex >= 0 && darkIndex < colorObj.shades.length) {
              css += `  --${colorName}-${shade.name}: ${colorObj.shades[darkIndex].value};\n`;
            }
          });
        });
      }
      
      css += `}\n`;
    }
    
    return css;
  };

  // Generate SCSS variables
  const generateSCSS = () => {
    let scss = '';
    
    // Typography variables
    if (exportOptions.typography) {
      scss += `// Typography\n`;
      scss += `$base-font-size: ${typography.baseFontSize}px;\n`;
      scss += `$base-line-height: ${typography.baseLineHeight};\n`;
      scss += `$font-family-body: ${typography.fontFamily.body};\n`;
      scss += `$font-family-heading: ${typography.fontFamily.heading};\n`;
      scss += `$font-family-mono: ${typography.fontFamily.monospace};\n\n`;
      
      if (typography.scale) {
        scss += `// Type Scale\n`;
        typography.scale.forEach(size => {
          scss += `$text-${size.step}: ${size.rem}rem;\n`;
          scss += `$leading-${size.step}: ${size.lineHeight};\n`;
          scss += `$tracking-${size.step}: ${size.letterSpacing}em;\n`;
          scss += `$rhythm-${size.step}: ${size.rhythm.single}rem;\n\n`;
        });
      }
    }
    
    // Color variables
    if (exportOptions.colors) {
      scss += `// Colors\n`;
      Object.entries(colors).forEach(([colorName, colorObj]) => {
        scss += `$${colorName}: (\n`;
        colorObj.shades.forEach((shade: ColorShade) => {
          scss += `  ${shade.name}: ${shade.value},\n`;
        });
        scss += `);\n\n`;
      });
      
      // Color function
      scss += `// Color function\n`;
      scss += `@function color($color, $shade) {\n`;
      scss += `  @return map-get($#{$color}, $shade);\n`;
      scss += `}\n\n`;
    }
    
    // Spacing variables
    if (exportOptions.spacing) {
      scss += `// Spacing\n`;
      scss += `$spacing: (\n`;
      spacing.scale.forEach((value, index) => {
        scss += `  ${index}: ${value / 16}rem,\n`;
      });
      scss += `);\n\n`;
      
      // Spacing function
      scss += `// Spacing function\n`;
      scss += `@function space($size) {\n`;
      scss += `  @return map-get($spacing, $size);\n`;
      scss += `}\n\n`;
      
      scss += `// Breakpoints\n`;
      scss += `$breakpoints: (\n`;
      Object.entries(spacing.breakpoints).forEach(([key, value]) => {
        scss += `  ${key}: ${value}px,\n`;
      });
      scss += `);\n\n`;
    }
    
    // Component variables
    if (exportOptions.components) {
      scss += `// Border Radius\n`;
      scss += `$border-radius: (\n`;
      Object.entries(components.borderRadius).forEach(([name, value]) => {
        scss += `  ${name}: ${value},\n`;
      });
      scss += `);\n\n`;
      
      scss += `// Border Width\n`;
      scss += `$border-width: (\n`;
      Object.entries(components.borderWidth).forEach(([name, value]) => {
        scss += `  ${name}: ${value},\n`;
      });
      scss += `);\n\n`;
      
      scss += `// Box Shadow\n`;
      scss += `$shadow: (\n`;
      components.boxShadow.forEach((shadow, i) => {
        const name = i === 0 ? 'none' : i === 1 ? 'sm' : i === 2 ? 'md' : i === 3 ? 'lg' : i === 4 ? 'xl' : '2xl';
        scss += `  ${name}: ${shadow},\n`;
      });
      scss += `);\n\n`;
      
      scss += `// Transitions\n`;
      scss += `$transitions: (\n`;
      Object.entries(components.transitions).forEach(([name, value]) => {
        scss += `  ${name}: ${value},\n`;
      });
      scss += `);\n`;
    }
    
    return scss;
  };

  // Generate Tailwind CSS config
  const generateTailwindConfig = () => {
    let config = `/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {`;
    
    // Typography
    if (exportOptions.typography) {
      config += `\n      fontSize: {`;
      if (typography.scale) {
        typography.scale.forEach(size => {
          config += `\n        '${size.step}': ['${size.rem}rem', {
          lineHeight: ${size.lineHeight},
          letterSpacing: '${size.letterSpacing}em'
        }],`;
        });
      }
      config += `\n      },`;
      
      config += `\n      fontFamily: {
        sans: ['${typography.fontFamily.body.split(',')[0]}', 'sans-serif'],
        heading: ['${typography.fontFamily.heading.split(',')[0]}', 'sans-serif'],
        mono: ['${typography.fontFamily.monospace.split(',')[0]}', 'monospace'],
      },`;
    }
    
    // Colors
    if (exportOptions.colors) {
      config += `\n      colors: {`;
      Object.entries(colors).forEach(([colorName, colorObj]) => {
        config += `\n        ${colorName}: {`;
        colorObj.shades.forEach((shade: ColorShade) => {
          config += `\n          '${shade.name}': '${shade.value}',`;
        });
        config += `\n        },`;
      });
      config += `\n      },`;
    }
    
    // Spacing
    if (exportOptions.spacing) {
      config += `\n      spacing: {`;
      spacing.scale.forEach((value, index) => {
        config += `\n        '${index}': '${value / 16}rem',`;
      });
      config += `\n      },`;
      
      config += `\n      screens: {`;
      Object.entries(spacing.breakpoints).forEach(([key, value]) => {
        config += `\n        '${key}': '${value}px',`;
      });
      config += `\n      },`;
    }
    
    // Components
    if (exportOptions.components) {
      config += `\n      borderRadius: {`;
      Object.entries(components.borderRadius).forEach(([name, value]) => {
        config += `\n        '${name}': '${value}',`;
      });
      config += `\n      },`;
      
      config += `\n      borderWidth: {`;
      Object.entries(components.borderWidth).forEach(([name, value]) => {
        config += `\n        '${name}': '${value}',`;
      });
      config += `\n      },`;
      
      config += `\n      boxShadow: {`;
      components.boxShadow.forEach((shadow, i) => {
        const name = i === 0 ? 'none' : i === 1 ? 'sm' : i === 2 ? 'md' : i === 3 ? 'lg' : i === 4 ? 'xl' : '2xl';
        config += `\n        '${name}': '${shadow}',`;
      });
      config += `\n      },`;
      
      config += `\n      transitionProperty: {
        'DEFAULT': 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter',
      },`;
    }
    
    config += `\n    },
  },`;
    
    // Dark mode
    if (exportOptions.darkMode) {
      config += `\n  darkMode: 'class',`;
    }
    
    config += `\n}`;
    
    return config;
  };

  // Generate JSON
  const generateJSON = () => {
    const systemData = exportDesignSystem();
    
    // Filter data based on export options
    type FilteredData = Partial<ReturnType<typeof exportDesignSystem>>;
    const filteredData: FilteredData = {};
    
    if (exportOptions.typography) {
      filteredData.typography = systemData.typography;
    }
    
    if (exportOptions.colors) {
      filteredData.colors = systemData.colors;
    }
    
    if (exportOptions.spacing) {
      filteredData.spacing = systemData.spacing;
    }
    
    if (exportOptions.components) {
      filteredData.components = systemData.components;
    }
    
    return JSON.stringify(filteredData, null, 2);
  };

  // Get the correct output based on the selected format
  const getOutput = () => {
    switch (exportFormat) {
      case 'css':
        return generateCSS();
      case 'scss':
        return generateSCSS();
      case 'tailwind':
        return generateTailwindConfig();
      case 'json':
        return generateJSON();
      default:
        return '';
    }
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    const output = getOutput();
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied!",
      description: `Design system copied to clipboard as ${exportFormat.toUpperCase()}`,
    });
  };

  // Download file
  const downloadFile = () => {
    const output = getOutput();
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    let filename = '';
    switch (exportFormat) {
      case 'css':
        filename = 'design-system.css';
        break;
      case 'scss':
        filename = 'design-system.scss';
        break;
      case 'tailwind':
        filename = 'tailwind.config.js';
        break;
      case 'json':
        filename = 'design-system.json';
        break;
    }
    
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: `Design system downloaded as ${filename}`,
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Export Format</CardTitle>
            <CardDescription>Choose the format to export your design system</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={exportFormat}
              onValueChange={(value) => setExportFormat(value as 'css' | 'scss' | 'json' | 'tailwind')}
            >
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="css">CSS</TabsTrigger>
                <TabsTrigger value="scss">SCSS</TabsTrigger>
                <TabsTrigger value="tailwind">Tailwind</TabsTrigger>
                <TabsTrigger value="json">JSON</TabsTrigger>
              </TabsList>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <FileCode className="h-5 w-5 text-muted-foreground" />
                  <Label className="text-base">
                    {exportFormat === 'css' && 'CSS Variables'}
                    {exportFormat === 'scss' && 'SCSS Variables & Functions'}
                    {exportFormat === 'tailwind' && 'Tailwind Config File'}
                    {exportFormat === 'json' && 'JSON Data Structure'}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  {exportFormat === 'css' && 'Export as CSS variables that can be used in any CSS file.'}
                  {exportFormat === 'scss' && 'Export as SCSS variables and functions for use in SCSS workflows.'}
                  {exportFormat === 'tailwind' && 'Export as a Tailwind CSS configuration file.'}
                  {exportFormat === 'json' && 'Export as a JSON file for integration with other tools.'}
                </p>
              </div>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Export Options</CardTitle>
            <CardDescription>Choose what to include in your export</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="typography"
                  checked={exportOptions.typography}
                  onCheckedChange={(checked) => 
                    setExportOptions({ ...exportOptions, typography: !!checked })
                  }
                />
                <Label htmlFor="typography">Typography System</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="colors"
                  checked={exportOptions.colors}
                  onCheckedChange={(checked) => 
                    setExportOptions({ ...exportOptions, colors: !!checked })
                  }
                />
                <Label htmlFor="colors">Color System</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="spacing"
                  checked={exportOptions.spacing}
                  onCheckedChange={(checked) => 
                    setExportOptions({ ...exportOptions, spacing: !!checked })
                  }
                />
                <Label htmlFor="spacing">Spacing & Layout</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="components"
                  checked={exportOptions.components}
                  onCheckedChange={(checked) => 
                    setExportOptions({ ...exportOptions, components: !!checked })
                  }
                />
                <Label htmlFor="components">Component Tokens</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="darkMode"
                  checked={exportOptions.darkMode}
                  onCheckedChange={(checked) => 
                    setExportOptions({ ...exportOptions, darkMode: !!checked })
                  }
                />
                <Label htmlFor="darkMode">Include Dark Mode</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Preview</Label>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={copyToClipboard}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button
              onClick={downloadFile}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <pre className="p-4 bg-muted rounded-lg overflow-auto font-mono text-sm flex-1 max-h-[400px]">
            <code>{getOutput()}</code>
          </pre>
          
          <div className="absolute top-0 right-0 p-2">
            {exportFormat === 'css' && <FileCode className="h-5 w-5 text-muted-foreground" />}
            {exportFormat === 'scss' && <FileCode className="h-5 w-5 text-muted-foreground" />}
            {exportFormat === 'tailwind' && <FileCode className="h-5 w-5 text-muted-foreground" />}
            {exportFormat === 'json' && <FileJson className="h-5 w-5 text-muted-foreground" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportSystem;