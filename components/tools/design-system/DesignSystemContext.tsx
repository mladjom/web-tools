"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Typography Types
interface TypographySettings {
  baseFontSize: number;
  baseLineHeight: number;
  scaleRatio: number;
  baseUnit: number;
  fontFamily: {
    body: string;
    heading: string;
    monospace: string;
  };
  scale?: any[]; // Will be populated by the typography generator
}

// Color Types
interface ColorShade {
  value: string;
  name: string;
}

interface ColorScale {
  color: string;
  name: string;
  shades: ColorShade[];
}

interface ColorSettings {
  primary: ColorScale;
  secondary: ColorScale;
  accent: ColorScale;
  neutral: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  error: ColorScale;
  info: ColorScale;
}

// Spacing Types
interface SpacingSettings {
  baseUnit: number;
  scale: number[];
  breakpoints: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
}

// Component Types
interface ComponentSettings {
  borderRadius: Record<string, string>;
  borderWidth: Record<string, string>;
  boxShadow: string[];
  transitions: {
    default: string;
    slow: string;
    fast: string;
  };
}

// Combined Design System State
interface DesignSystemState {
  typography: TypographySettings;
  colors: ColorSettings;
  spacing: SpacingSettings;
  components: ComponentSettings;
}

// Context actions
interface DesignSystemContextType extends DesignSystemState {
  updateTypography: (settings: Partial<TypographySettings>) => void;
  updateColors: (settings: Partial<ColorSettings>) => void;
  updateSpacing: (settings: Partial<SpacingSettings>) => void;
  updateComponents: (settings: Partial<ComponentSettings>) => void;
  exportDesignSystem: () => DesignSystemState;
  resetToDefaults: () => void;
}

// Default values
const defaultTypography: TypographySettings = {
  baseFontSize: 16,
  baseLineHeight: 1.5,
  scaleRatio: 1.333,
  baseUnit: 8,
  fontFamily: {
    body: 'Inter, system-ui, sans-serif',
    heading: 'Inter, system-ui, sans-serif',
    monospace: 'monospace',
  },
};

const defaultColors: ColorSettings = {
  primary: {
    name: 'Primary',
    color: '#3B82F6',
    shades: [
      { name: '50', value: '#EFF6FF' },
      { name: '100', value: '#DBEAFE' },
      { name: '200', value: '#BFDBFE' },
      { name: '300', value: '#93C5FD' },
      { name: '400', value: '#60A5FA' },
      { name: '500', value: '#3B82F6' },
      { name: '600', value: '#2563EB' },
      { name: '700', value: '#1D4ED8' },
      { name: '800', value: '#1E40AF' },
      { name: '900', value: '#1E3A8A' },
      { name: '950', value: '#172554' },
    ],
  },
  secondary: {
    name: 'Secondary',
    color: '#EC4899',
    shades: [
      { name: '50', value: '#FDF2F8' },
      { name: '100', value: '#FCE7F3' },
      { name: '200', value: '#FBCFE8' },
      { name: '300', value: '#F9A8D4' },
      { name: '400', value: '#F472B6' },
      { name: '500', value: '#EC4899' },
      { name: '600', value: '#DB2777' },
      { name: '700', value: '#BE185D' },
      { name: '800', value: '#9D174D' },
      { name: '900', value: '#831843' },
      { name: '950', value: '#500724' },
    ],
  },
  accent: {
    name: 'Accent',
    color: '#8B5CF6',
    shades: [
      { name: '50', value: '#F5F3FF' },
      { name: '100', value: '#EDE9FE' },
      { name: '200', value: '#DDD6FE' },
      { name: '300', value: '#C4B5FD' },
      { name: '400', value: '#A78BFA' },
      { name: '500', value: '#8B5CF6' },
      { name: '600', value: '#7C3AED' },
      { name: '700', value: '#6D28D9' },
      { name: '800', value: '#5B21B6' },
      { name: '900', value: '#4C1D95' },
      { name: '950', value: '#2E1065' },
    ],
  },
  neutral: {
    name: 'Neutral',
    color: '#6B7280',
    shades: [
      { name: '50', value: '#F9FAFB' },
      { name: '100', value: '#F3F4F6' },
      { name: '200', value: '#E5E7EB' },
      { name: '300', value: '#D1D5DB' },
      { name: '400', value: '#9CA3AF' },
      { name: '500', value: '#6B7280' },
      { name: '600', value: '#4B5563' },
      { name: '700', value: '#374151' },
      { name: '800', value: '#1F2937' },
      { name: '900', value: '#111827' },
      { name: '950', value: '#030712' },
    ],
  },
  success: {
    name: 'Success',
    color: '#10B981',
    shades: [
      { name: '50', value: '#ECFDF5' },
      { name: '100', value: '#D1FAE5' },
      { name: '200', value: '#A7F3D0' },
      { name: '300', value: '#6EE7B7' },
      { name: '400', value: '#34D399' },
      { name: '500', value: '#10B981' },
      { name: '600', value: '#059669' },
      { name: '700', value: '#047857' },
      { name: '800', value: '#065F46' },
      { name: '900', value: '#064E3B' },
      { name: '950', value: '#022C22' },
    ],
  },
  warning: {
    name: 'Warning',
    color: '#F59E0B',
    shades: [
      { name: '50', value: '#FFFBEB' },
      { name: '100', value: '#FEF3C7' },
      { name: '200', value: '#FDE68A' },
      { name: '300', value: '#FCD34D' },
      { name: '400', value: '#FBBF24' },
      { name: '500', value: '#F59E0B' },
      { name: '600', value: '#D97706' },
      { name: '700', value: '#B45309' },
      { name: '800', value: '#92400E' },
      { name: '900', value: '#78350F' },
      { name: '950', value: '#451A03' },
    ],
  },
  error: {
    name: 'Error',
    color: '#EF4444',
    shades: [
      { name: '50', value: '#FEF2F2' },
      { name: '100', value: '#FEE2E2' },
      { name: '200', value: '#FECACA' },
      { name: '300', value: '#FCA5A5' },
      { name: '400', value: '#F87171' },
      { name: '500', value: '#EF4444' },
      { name: '600', value: '#DC2626' },
      { name: '700', value: '#B91C1C' },
      { name: '800', value: '#991B1B' },
      { name: '900', value: '#7F1D1D' },
      { name: '950', value: '#450A0A' },
    ],
  },
  info: {
    name: 'Info',
    color: '#06B6D4',
    shades: [
      { name: '50', value: '#ECFEFF' },
      { name: '100', value: '#CFFAFE' },
      { name: '200', value: '#A5F3FC' },
      { name: '300', value: '#67E8F9' },
      { name: '400', value: '#22D3EE' },
      { name: '500', value: '#06B6D4' },
      { name: '600', value: '#0891B2' },
      { name: '700', value: '#0E7490' },
      { name: '800', value: '#155E75' },
      { name: '900', value: '#164E63' },
      { name: '950', value: '#083344' },
    ],
  },
};

const defaultSpacing: SpacingSettings = {
  baseUnit: 4,
  scale: [0, 4, 8, 16, 24, 32, 48, 64, 80, 96, 128, 160, 192, 224, 256],
  breakpoints: {
    xs: 320,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1536,
  },
};

const defaultComponents: ComponentSettings = {
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.25rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  borderWidth: {
    none: '0',
    thin: '1px',
    thick: '2px',
    thicker: '3px',
  },
  boxShadow: [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  ],
  transitions: {
    default: 'all 0.3s ease',
    slow: 'all 0.6s ease',
    fast: 'all 0.15s ease',
  },
};

// Create context with default values
const DesignSystemContext = createContext<DesignSystemContextType>({
  typography: defaultTypography,
  colors: defaultColors,
  spacing: defaultSpacing,
  components: defaultComponents,
  updateTypography: () => {},
  updateColors: () => {},
  updateSpacing: () => {},
  updateComponents: () => {},
  exportDesignSystem: () => ({ 
    typography: defaultTypography, 
    colors: defaultColors, 
    spacing: defaultSpacing, 
    components: defaultComponents 
  }),
  resetToDefaults: () => {},
});

// Provider component
export const DesignSystemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [typography, setTypography] = useState<TypographySettings>(defaultTypography);
  const [colors, setColors] = useState<ColorSettings>(defaultColors);
  const [spacing, setSpacing] = useState<SpacingSettings>(defaultSpacing);
  const [components, setComponents] = useState<ComponentSettings>(defaultComponents);

  const updateTypography = (settings: Partial<TypographySettings>) => {
    setTypography(prev => ({ ...prev, ...settings }));
  };

  const updateColors = (settings: Partial<ColorSettings>) => {
    setColors(prev => ({ ...prev, ...settings }));
  };

  const updateSpacing = (settings: Partial<SpacingSettings>) => {
    setSpacing(prev => ({ ...prev, ...settings }));
  };

  const updateComponents = (settings: Partial<ComponentSettings>) => {
    setComponents(prev => ({ ...prev, ...settings }));
  };

  const exportDesignSystem = (): DesignSystemState => {
    return {
      typography,
      colors,
      spacing,
      components,
    };
  };

  const resetToDefaults = () => {
    setTypography(defaultTypography);
    setColors(defaultColors);
    setSpacing(defaultSpacing);
    setComponents(defaultComponents);
  };

  return (
    <DesignSystemContext.Provider
      value={{
        typography,
        colors,
        spacing,
        components,
        updateTypography,
        updateColors,
        updateSpacing,
        updateComponents,
        exportDesignSystem,
        resetToDefaults,
      }}
    >
      {children}
    </DesignSystemContext.Provider>
  );
};

// Custom hook to use the DesignSystemContext
export const useDesignSystem = () => useContext(DesignSystemContext);