"use client";

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TypographyGenerator from "@/components/tools/design-system/TypographyGenerator";
import ColorGenerator from "@/components/tools/design-system/ColorGenerator";
import SpacingGenerator from "@/components/tools/design-system/SpacingGenerator";
import ComponentsGenerator from "@/components/tools/design-system/ComponentsGenerator";
import ExportSystem from "@/components/tools/design-system/ExportSystem";
import { DesignSystemProvider } from "@/components/tools/design-system/DesignSystemContext";

export default function DesignSystemGeneratorPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="space-y-6 mb-10">
          <h1 className="text-4xl font-bold text-center">Design System Generator</h1>
          <p className="text-center text-muted-foreground">
            Create a complete design system with typography, colors, spacing, and components
          </p>
        </div>
        
        <DesignSystemProvider>
          <Tabs defaultValue="typography" className="space-y-6">
            <div className="sticky top-0 bg-background z-10 pb-4 border-b">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="typography">Typography</TabsTrigger>
                <TabsTrigger value="colors">Colors</TabsTrigger>
                <TabsTrigger value="spacing">Spacing</TabsTrigger>
                <TabsTrigger value="components">Components</TabsTrigger>
                <TabsTrigger value="export">Export</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="typography">
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Typography System</CardTitle>
                    <CardDescription>
                      Configure the typographic scale and generate consistent text styles
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TypographyGenerator />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="colors">
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Color System</CardTitle>
                    <CardDescription>
                      Create a harmonious color palette with proper light and dark themes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ColorGenerator />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="spacing">
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Spacing System</CardTitle>
                    <CardDescription>
                      Define consistent spacing units and layout grids
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SpacingGenerator />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="components">
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Component Styles</CardTitle>
                    <CardDescription>
                      Generate base styles for common UI components
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ComponentsGenerator />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="export">
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Export Design System</CardTitle>
                    <CardDescription>
                      Export your design system to various formats
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ExportSystem />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </DesignSystemProvider>
      </div>
    </div>
  );
}