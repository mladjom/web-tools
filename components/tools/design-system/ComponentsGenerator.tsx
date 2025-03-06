"use client";

import React, { useState } from 'react';
import { useDesignSystem } from './DesignSystemContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ComponentsGenerator: React.FC = () => {
  const { components, updateComponents } = useDesignSystem();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<string>('border-radius');
  const [selectedComponent, setSelectedComponent] = useState<string>('button');
  const [newBorderRadius, setNewBorderRadius] = useState<{ name: string; value: string }>({ name: '', value: '' });
  const [newBorderWidth, setNewBorderWidth] = useState<{ name: string; value: string }>({ name: '', value: '' });
  const [newShadow, setNewShadow] = useState<string>('');
  const [newTransition, setNewTransition] = useState<{ name: string; value: string }>({ name: '', value: '' });

  // Component style definitions
  const componentPreviewStyles = {
    button: {
      primary: {
        className: "py-2 px-4 bg-primary text-primary-foreground rounded-md",
        text: "Primary Button"
      },
      secondary: {
        className: "py-2 px-4 bg-secondary text-secondary-foreground rounded-md",
        text: "Secondary Button"
      },
      outline: {
        className: "py-2 px-4 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md",
        text: "Outline Button"
      },
      ghost: {
        className: "py-2 px-4 hover:bg-accent hover:text-accent-foreground rounded-md",
        text: "Ghost Button"
      }
    },
    input: {
      default: {
        className: "h-10 w-full rounded-md border border-input bg-background px-3 py-2 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        placeholder: "Default input"
      },
      error: {
        className: "h-10 w-full rounded-md border border-destructive bg-background px-3 py-2 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive",
        placeholder: "Error input"
      }
    },
    card: {
      default: {
        className: "w-full rounded-lg border bg-card text-card-foreground shadow",
        title: "Card Title",
        content: "This is a sample card component with default styling."
      }
    }
  };

  // Handle border radius input
  const handleBorderRadiusNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBorderRadius(prev => ({ ...prev, name: e.target.value }));
  };

  const handleBorderRadiusValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBorderRadius(prev => ({ ...prev, value: e.target.value }));
  };

  // Handle border width input
  const handleBorderWidthNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBorderWidth(prev => ({ ...prev, name: e.target.value }));
  };

  const handleBorderWidthValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBorderWidth(prev => ({ ...prev, value: e.target.value }));
  };

  // Handle shadow input
  const handleShadowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewShadow(e.target.value);
  };

  // Handle transition input
  const handleTransitionNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTransition(prev => ({ ...prev, name: e.target.value }));
  };

  const handleTransitionValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTransition(prev => ({ ...prev, value: e.target.value }));
  };

  // Add new border radius
  const addBorderRadius = () => {
    if (newBorderRadius.name && newBorderRadius.value) {
      updateComponents('borderRadius', newBorderRadius);
      setNewBorderRadius({ name: '', value: '' });
      toast({
        title: "Border radius added",
        description: `Added ${newBorderRadius.name}: ${newBorderRadius.value}`,
      });
    } else {
      toast({
        title: "Invalid input",
        description: "Both name and value are required",
        variant: "destructive"
      });
    }
  };

  // Add new border width
  const addBorderWidth = () => {
    if (newBorderWidth.name && newBorderWidth.value) {
      updateComponents('borderWidth', newBorderWidth);
      setNewBorderWidth({ name: '', value: '' });
      toast({
        title: "Border width added",
        description: `Added ${newBorderWidth.name}: ${newBorderWidth.value}`,
      });
    } else {
      toast({
        title: "Invalid input",
        description: "Both name and value are required",
        variant: "destructive"
      });
    }
  };

  // Add new shadow
  const addShadow = () => {
    if (newShadow) {
      updateComponents('shadow', newShadow);
      setNewShadow('');
      toast({
        title: "Shadow added",
        description: "New shadow value has been added",
      });
    } else {
      toast({
        title: "Invalid input",
        description: "Shadow value is required",
        variant: "destructive"
      });
    }
  };

  // Add new transition
  const addTransition = () => {
    if (newTransition.name && newTransition.value) {
      updateComponents('transition', newTransition);
      setNewTransition({ name: '', value: '' });
      toast({
        title: "Transition added",
        description: `Added ${newTransition.name}: ${newTransition.value}`,
      });
    } else {
      toast({
        title: "Invalid input",
        description: "Both name and value are required",
        variant: "destructive"
      });
    }
  };

  // Generate CSS for component tokens
  const generateComponentCSS = () => {
    let css = `:root {\n`;
    
    // Border radius
    css += `  /* Border Radius */\n`;
    Object.entries(components.borderRadius).forEach(([name, value]) => {
      css += `  --radius-${name}: ${value};\n`;
    });
    
    // Border width
    css += `\n  /* Border Width */\n`;
    Object.entries(components.borderWidth).forEach(([name, value]) => {
      css += `  --border-${name}: ${value};\n`;
    });
    
    // Box shadows
    css += `\n  /* Box Shadows */\n`;
    components.boxShadow.forEach((shadow, index) => {
      const name = index === 0 ? 'none' : 
                   index === 1 ? 'sm' : 
                   index === 2 ? 'md' : 
                   index === 3 ? 'lg' : 
                   index === 4 ? 'xl' : 
                   index === 5 ? '2xl' : 
                   `shadow-${index}`;
      css += `  --shadow-${name}: ${shadow};\n`;
    });
    
    // Transitions
    css += `\n  /* Transitions */\n`;
    Object.entries(components.transitions).forEach(([name, value]) => {
      css += `  --transition-${name}: ${value};\n`;
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
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="preview">Component Preview</TabsTrigger>
          <TabsTrigger value="border-radius">Border Radius</TabsTrigger>
          <TabsTrigger value="border-width">Border Width</TabsTrigger>
          <TabsTrigger value="shadows">Shadows</TabsTrigger>
          <TabsTrigger value="transitions">Transitions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview">
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Component Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <Label htmlFor="component">Component</Label>
                  <Select value={selectedComponent} onValueChange={setSelectedComponent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a component" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="button">Button</SelectItem>
                      <SelectItem value="input">Input</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-8">
                  {selectedComponent === 'button' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Button Variants</h3>
                      <div className="flex flex-wrap gap-4">
                        <button className={componentPreviewStyles.button.primary.className}>
                          {componentPreviewStyles.button.primary.text}
                        </button>
                        <button className={componentPreviewStyles.button.secondary.className}>
                          {componentPreviewStyles.button.secondary.text}
                        </button>
                        <button className={componentPreviewStyles.button.outline.className}>
                          {componentPreviewStyles.button.outline.text}
                        </button>
                        <button className={componentPreviewStyles.button.ghost.className}>
                          {componentPreviewStyles.button.ghost.text}
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedComponent === 'input' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Input Variants</h3>
                      <div className="space-y-4">
                        <input 
                          className={componentPreviewStyles.input.default.className}
                          placeholder={componentPreviewStyles.input.default.placeholder}
                        />
                        <input 
                          className={componentPreviewStyles.input.error.className}
                          placeholder={componentPreviewStyles.input.error.placeholder}
                        />
                      </div>
                    </div>
                  )}

                  {selectedComponent === 'card' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Card Component</h3>
                      <div className={componentPreviewStyles.card.default.className}>
                        <div className="p-6">
                          <h3 className="text-lg font-semibold mb-2">{componentPreviewStyles.card.default.title}</h3>
                          <p>{componentPreviewStyles.card.default.content}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="border-radius">
          <Card>
            <CardHeader>
              <CardTitle>Border Radius</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="borderRadiusName">Name</Label>
                    <Input
                      id="borderRadiusName"
                      value={newBorderRadius.name}
                      onChange={handleBorderRadiusNameChange}
                      placeholder="e.g., sm, md, lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="borderRadiusValue">Value</Label>
                    <Input
                      id="borderRadiusValue"
                      value={newBorderRadius.value}
                      onChange={handleBorderRadiusValueChange}
                      placeholder="e.g., 0.25rem, 8px"
                    />
                  </div>
                </div>
                <Button onClick={addBorderRadius} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Border Radius
                </Button>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Current Border Radius Tokens</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(components.borderRadius).map(([name, value]) => (
                      <div 
                        key={name} 
                        className="border rounded-md p-4 flex flex-col"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <span className="font-medium">radius-{name}</span>
                            <span className="text-sm text-muted-foreground ml-2">{value}</span>
                          </div>
                        </div>
                        
                        <div 
                          className="bg-primary h-16 w-full" 
                          style={{ borderRadius: value }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="border-width">
          <Card>
            <CardHeader>
              <CardTitle>Border Width</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="borderWidthName">Name</Label>
                    <Input
                      id="borderWidthName"
                      value={newBorderWidth.name}
                      onChange={handleBorderWidthNameChange}
                      placeholder="e.g., thin, medium, thick"
                    />
                  </div>
                  <div>
                    <Label htmlFor="borderWidthValue">Value</Label>
                    <Input
                      id="borderWidthValue"
                      value={newBorderWidth.value}
                      onChange={handleBorderWidthValueChange}
                      placeholder="e.g., 1px, 2px"
                    />
                  </div>
                </div>
                <Button onClick={addBorderWidth} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Border Width
                </Button>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Current Border Width Tokens</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(components.borderWidth).map(([name, value]) => (
                      <div 
                        key={name} 
                        className="border rounded-md p-4 flex flex-col"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <span className="font-medium">border-{name}</span>
                            <span className="text-sm text-muted-foreground ml-2">{value}</span>
                          </div>
                        </div>
                        
                        <div 
                          className="bg-background h-16 w-full rounded-md" 
                          style={{ border: `${value} solid currentColor` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="shadows">
          <Card>
            <CardHeader>
              <CardTitle>Box Shadows</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="shadow">Shadow Value</Label>
                  <Input
                    id="shadow"
                    value={newShadow}
                    onChange={handleShadowChange}
                    placeholder="e.g., 0 1px 3px rgba(0,0,0,0.12)"
                  />
                </div>
                <Button onClick={addShadow} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Shadow
                </Button>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Current Shadow Tokens</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {components.boxShadow.map((shadow, index) => {
                      const name = index === 0 ? 'none' : 
                                   index === 1 ? 'sm' : 
                                   index === 2 ? 'md' : 
                                   index === 3 ? 'lg' : 
                                   index === 4 ? 'xl' : 
                                   index === 5 ? '2xl' : 
                                   `shadow-${index}`;
                      return (
                        <div 
                          key={index} 
                          className="border rounded-md p-4 flex flex-col"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <span className="font-medium">shadow-{name}</span>
                              <span className="text-sm text-muted-foreground ml-2 truncate max-w-[150px]">{shadow}</span>
                            </div>
                          </div>
                          
                          <div 
                            className="bg-background h-16 w-full rounded-md" 
                            style={{ boxShadow: shadow }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transitions">
          <Card>
            <CardHeader>
              <CardTitle>Transitions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="transitionName">Name</Label>
                    <Input
                      id="transitionName"
                      value={newTransition.name}
                      onChange={handleTransitionNameChange}
                      placeholder="e.g., fast, slow"
                    />
                  </div>
                  <div>
                    <Label htmlFor="transitionValue">Value</Label>
                    <Input
                      id="transitionValue"
                      value={newTransition.value}
                      onChange={handleTransitionValueChange}
                      placeholder="e.g., all 150ms ease"
                    />
                  </div>
                </div>
                <Button onClick={addTransition} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transition
                </Button>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Current Transition Tokens</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(components.transitions).map(([name, value]) => (
                      <div 
                        key={name} 
                        className="border rounded-md p-4 flex flex-col"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <span className="font-medium">transition-{name}</span>
                            <span className="text-sm text-muted-foreground ml-2">{value}</span>
                          </div>
                        </div>
                        
                        <div 
                          className="bg-primary h-16 w-full rounded-md cursor-pointer hover:scale-105"
                          style={{ transition: value }}
                        />
                        <span className="text-xs text-center mt-2 text-muted-foreground">Hover to see transition</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 space-y-4">
        <Label>Component Tokens CSS</Label>
        <div className="flex items-start gap-2">
          <pre className="p-4 bg-muted rounded-lg overflow-auto font-mono text-sm flex-1 max-h-[300px]">
            <code>{generateComponentCSS()}</code>
          </pre>
          <Button
            variant="outline"
            size="icon"
            onClick={() => copyToClipboard(generateComponentCSS())}
            aria-label="Copy CSS to clipboard"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ComponentsGenerator;