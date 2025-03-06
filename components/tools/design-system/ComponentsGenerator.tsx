"use client";

import React, { useState } from 'react';
import { useDesignSystem } from './DesignSystemContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Plus, Trash, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ComponentsGenerator: React.FC = () => {
  const { components, colors, typography, spacing, updateComponents } = useDesignSystem();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<string>('preview');
  const [selectedComponent, setSelectedComponent] = useState<string>('button');
  const [newBorderRadius, setNewBorderRadius] = useState<{ name: string; value: string }>({ name: '', value: '' });
  const [newBorderWidth, setNewBorderWidth] = useState<{ name: string; value: string }>({ name: '', value: '' });
  const [newShadow, setNewShadow] = useState<string>('');
  const [newTransition, setNewTransition] = useState<{ name: string; value: string }>({ name: '', value: '' });

  // Component style definitions
  const componentStyles = {
    button: {
      basic: `
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: var(--text-0);
  height: 2.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  transition: var(--transition-default);
}

.btn-primary {
  background-color: var(--primary-500);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-600);
}

.btn-secondary {
  background-color: var(--secondary-500);
  color: white;
}

.btn-outline {
  background-color: transparent;
  border: 1px solid var(--neutral-300);
}

.btn-outline:hover {
  background-color: var(--neutral-100);
  border-color: var(--neutral-400);
}`,
      tailwind: `
@layer components {
  .btn {
    @apply inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 h-10 px-4 py-2;
  }
  
  .btn-primary {
    @apply bg-primary-500 text-white hover:bg-primary-600;
  }
  
  .btn-secondary {
    @apply bg-secondary-500 text-white hover:bg-secondary-600;
  }
  
  .btn-outline {
    @apply border border-neutral-300 bg-transparent hover:bg-neutral-100 hover:border-neutral-400;
  }
}`
    },
    input: {
      basic: `
.input {
  display: flex;
  height: 2.5rem;
  width: 100%;
  border-radius: var(--radius-md);
  border: 1px solid var(--neutral-300);
  background-color: transparent;
  padding: 0.5rem 0.75rem;
  font-size: var(--text-0);
  transition: var(--transition-default);
}

.input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 2px var(--primary-100);
}

.input::placeholder {
  color: var(--neutral-400);
}

.input-error {
  border-color: var(--error-500);
}

.input-error:focus {
  border-color: var(--error-500);
  box-shadow: 0 0 0 2px var(--error-100);
}`,
      tailwind: `
@layer components {
  .input {
    @apply h-10 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50;
  }
  
  .input-error {
    @apply border-error-500 focus-visible:ring-error-500;
  }
}`
    },
    dropdown: {
      basic: `
.select {
  position: relative;
  width: 100%;
}

.select-trigger {
  display: flex;
  height: 2.5rem;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  border-radius: var(--radius-md);
  border: 1px solid var(--neutral-300);
  background-color: transparent;
  padding: 0 0.75rem;
  font-size: var(--text-0);
  transition: var(--transition-default);
}

.select-trigger:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 2px var(--primary-100);
}

.select-content {
  overflow: hidden;
  background-color: white;
  border-radius: var(--radius-md);
  border: 1px solid var(--neutral-200);
  box-shadow: var(--shadow-md);
  width: var(--select-trigger-width);
  max-height: var(--radix-popover-content-available-height);
  z-index: 50;
}

.select-item {
  font-size: var(--text-0);
  line-height: 1;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  height: 2rem;
  padding: 0 0.5rem;
  position: relative;
  user-select: none;
}

.select-item:hover {
  background-color: var(--neutral-100);
  color: inherit;
}

.select-item[data-state="checked"] {
  background-color: var(--primary-100);
  color: var(--primary-900);
}`,
      tailwind: `
@layer components {
  .select {
    @apply relative w-full;
  }
  
  .select-trigger {
    @apply flex h-10 w-full items-center justify-between rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50;
  }
  
  .select-content {
    @apply overflow-hidden rounded-md border border-neutral-200 bg-white text-neutral-950 shadow-md animate-in fade-in-80 zoom-in-95;
  }
  
  .select-item {
    @apply relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-neutral-100 focus:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50;
  }
}`
    },
    card: {
      basic: `
.card {
  border-radius: var(--radius-lg);
  border: 1px solid var(--neutral-200);
  background-color: white;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.card-header {
  padding: 1.5rem 1.5rem 0 1.5rem;
}

.card-title {
  font-size: var(--text-1);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.card-description {
  color: var(--neutral-500);
  font-size: var(--text-0);
}

.card-content {
  padding: 1.5rem;
}

.card-footer {
  padding: 0 1.5rem 1.5rem 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}`,
      tailwind: `
@layer components {
  .card {
    @apply rounded-lg border border-neutral-200 bg-white shadow-sm overflow-hidden;
  }
  
  .card-header {
    @apply p-6 pb-0;
  }
  
  .card-title {
    @apply text-xl font-semibold mb-2;
  }
  
  .card-description {
    @apply text-neutral-500;
  }
  
  .card-content {
    @apply p-6;
  }
  
  .card-footer {
    @apply px-6 pb-6 flex justify-end gap-2;
  }
}`
    }
  };

  const handleSave = () => {
    // Save the component styles
    toast({
      title: "Component styles saved",
      description: "Your component styles have been saved successfully.",
      status: "success",
    });
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <div className="space-y-8">
            <Card>
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
                      <SelectItem value="dropdown">Dropdown</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <div className="space-y-8">
            <Card>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <Label htmlFor="borderRadius">Border Radius</Label>
                  <Input
                    id="borderRadius"
                    value={newBorderRadius.value}
                    onChange={(e) => setNewBorderRadius({ ...newBorderRadius, value: e.target.value })}
                    placeholder="Enter border radius"
                  />
                  <Button onClick={() => updateComponents('borderRadius', newBorderRadius)}>Add Border Radius</Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <Label htmlFor="borderWidth">Border Width</Label>
                  <Input
                    id="borderWidth"
                    value={newBorderWidth.value}
                    onChange={(e) => setNewBorderWidth({ ...newBorderWidth, value: e.target.value })}
                    placeholder="Enter border width"
                  />
                  <Button onClick={() => updateComponents('borderWidth', newBorderWidth)}>Add Border Width</Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <Label htmlFor="shadow">Shadow</Label>
                  <Input
                    id="shadow"
                    value={newShadow}
                    onChange={(e) => setNewShadow(e.target.value)}
                    placeholder="Enter shadow"
                  />
                  <Button onClick={() => updateComponents('shadow', newShadow)}>Add Shadow</Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <Label htmlFor="transition">Transition</Label>
                  <Input
                    id="transition"
                    value={newTransition.value}
                    onChange={(e) => setNewTransition({ ...newTransition, value: e.target.value })}
                    placeholder="Enter transition"
                  />
                  <Button onClick={() => updateComponents('transition', newTransition)}>Add Transition</Button>
                </div>
              </CardContent>
            </Card>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComponentsGenerator;