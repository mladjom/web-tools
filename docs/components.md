# Web Tools Components Documentation

This document provides comprehensive information about all components in the Web Tools project, explaining what each component does and how to use it.

## Table of Contents

1. [Tool Components](#tool-components)
   - [AspectRatioCalculator](#aspectratiocalculator)
   - [AspectRatioCalculatorOld](#aspectratiocalculatorold)
   - [ImageProcessor](#imageprocessor)
   - [TypographyGenerator](#typographygenerator)
   - [AvatarGenerator](#avatargenerator)
   - [Design System Generator Components](#design-system-generator-components)

2. [UI Components](#ui-components)
   - [AppLayout](#applayout)
   - [SidebarNav](#sidebarnav)
   - [Footer](#footer)
   - [Basic UI Components](#basic-ui-components)

---

## Tool Components

### AspectRatioCalculator

**File:** `components/AspectRatioCalculator.tsx`

**Purpose:** Calculates and analyzes aspect ratios for responsive design, helping developers understand dimensions, letterboxing/pillarboxing, and optimal cropping.

**Features:**
- Analyze dimensions to determine simplified and decimal aspect ratios
- Calculate letterbox/pillarbox dimensions for different screen sizes
- Generate crop suggestions for target aspect ratios
- Visual preview of results

**Usage:**
```tsx
import AspectRatioCalculator from '@/components/AspectRatioCalculator';

function MyPage() {
  return <AspectRatioCalculator />;
}
```

**Key Props/Parameters:** None. The component is self-contained.

**User Interactions:**
1. Enter content dimensions (width x height)
2. Enter screen dimensions (for display calculations)
3. Choose a common ratio preset (optional)
4. View analysis, display, or crop information in the tabs
5. Copy values to clipboard as needed

---

### AspectRatioCalculatorOld

**File:** `components/AspectRatioCalculatorOld.tsx`

**Purpose:** Legacy version of the aspect ratio calculator with simpler features and UI.

**Features:**
- Basic aspect ratio calculations
- Simplified interface
- Maintained for compatibility

**Usage:**
```tsx
import AspectRatioCalculatorOld from '@/components/AspectRatioCalculatorOld';

function MyPage() {
  return <AspectRatioCalculatorOld />;
}
```

**When to Use:** Only when the newer calculator causes issues or when a simpler interface is preferred.

---

### ImageProcessor

**File:** `components/ImageProcessor.tsx`

**Purpose:** Upload, process, resize, and download images with various transformations and enhancements.

**Features:**
- Image resizing with aspect ratio control
- Crop, letterbox, or stretching options
- Format conversion (JPEG, PNG, WebP)
- Quality control for optimized file sizes
- Drag-and-drop interface
- History of processed images

**Usage:**
```tsx
import ImageProcessor from '@/components/ImageProcessor';

function MyPage() {
  return <ImageProcessor />;
}
```

**Key Props/Parameters:** None. The component is self-contained.

**User Interactions:**
1. Upload an image by file selection or drag-and-drop
2. Choose process type (resize, crop, letterbox)
3. Set dimensions and options in the tabs
4. Process the image
5. Download or manage processed files

---

### TypographyGenerator

**File:** `components/TypographyGenerator.tsx`

**Purpose:** Creates responsive typography systems with consistent scales and proper vertical rhythm.

**Features:**
- Type scale generation based on ratio
- Line height and letter spacing calculations
- Vertical rhythm recommendations
- Preview of all type styles
- Export to CSS or SCSS

**Usage:**
```tsx
import TypographyGenerator from '@/components/TypographyGenerator';

function MyPage() {
  return <TypographyGenerator />;
}
```

**Key Props/Parameters:** None. The component is self-contained.

**User Interactions:**
1. Adjust base font size, scale ratio, and other parameters
2. Preview the generated type scale
3. Copy CSS or SCSS output for use in projects

---

### AvatarGenerator

**File:** `components/tools/AvatarGenerator.tsx`

**Purpose:** Creates customizable avatars for profiles, applications, and websites with various styles and options.

**Features:**
- Text-based avatars with initials or emoji
- Multiple shape options (circle, square, rounded)
- Customizable colors, gradients, and patterns
- Border customization
- Image upload support
- History of generated avatars

**Usage:**
```tsx
import AvatarGenerator from '@/components/tools/AvatarGenerator';

function MyPage() {
  return <AvatarGenerator />;
}
```

**Key Props/Parameters:** None. The component is self-contained.

**User Interactions:**
1. Choose avatar shape and size
2. Add text or upload an image
3. Customize colors, patterns, and borders
4. Generate random avatars for inspiration
5. Download or copy the final avatar

---

### Design System Generator Components

#### DesignSystemProvider

**File:** `components/tools/design-system/DesignSystemContext.tsx`

**Purpose:** Provides context and state management for the Design System Generator.

**Features:**
- Centralized state for typography, colors, spacing, and components
- Context API for consistent state across components
- Export functionality for the complete design system

**Usage:**
```tsx
import { DesignSystemProvider } from '@/components/tools/design-system/DesignSystemContext';

function MyApp() {
  return (
    <DesignSystemProvider>
      {/* Design system components */}
    </DesignSystemProvider>
  );
}
```

#### TypographyGenerator (Design System)

**File:** `components/tools/design-system/TypographyGenerator.tsx`

**Purpose:** Creates typography systems within the design system context.

**Features:**
- Font size scale generation
- Font family settings
- Preview of typography styles
- Integration with the design system context

**Usage:**
```tsx
import TypographyGenerator from '@/components/tools/design-system/TypographyGenerator';

function MyPage() {
  return <TypographyGenerator />;
}
```

#### ColorGenerator

**File:** `components/tools/design-system/ColorGenerator.tsx`

**Purpose:** Creates color palettes and scales for the design system.

**Features:**
- Color palette creation with shades
- Dark mode color generation
- Custom color adjustment sliders
- CSS variable output

**Usage:**
```tsx
import ColorGenerator from '@/components/tools/design-system/ColorGenerator';

function MyPage() {
  return <ColorGenerator />;
}
```

#### SpacingGenerator

**File:** `components/tools/design-system/SpacingGenerator.tsx`

**Purpose:** Defines spacing scales and breakpoints for the design system.

**Features:**
- Spacing scale generation
- Breakpoint configuration
- Visual previews of spacing values
- CSS variable output

**Usage:**
```tsx
import SpacingGenerator from '@/components/tools/design-system/SpacingGenerator';

function MyPage() {
  return <SpacingGenerator />;
}
```

#### ComponentsGenerator

**File:** `components/tools/design-system/ComponentsGenerator.tsx`

**Purpose:** Creates component tokens (border radius, shadows, etc.) for the design system.

**Features:**
- Border radius configuration
- Border width settings
- Box shadow definitions
- Transition presets
- Component previews

**Usage:**
```tsx
import ComponentsGenerator from '@/components/tools/design-system/ComponentsGenerator';

function MyPage() {
  return <ComponentsGenerator />;
}
```

#### ExportSystem

**File:** `components/tools/design-system/ExportSystem.tsx`

**Purpose:** Exports the complete design system in various formats.

**Features:**
- Export to CSS, SCSS, or Tailwind config
- JSON output option
- Selective export of system parts
- Dark mode inclusion option

**Usage:**
```tsx
import ExportSystem from '@/components/tools/design-system/ExportSystem';

function MyPage() {
  return <ExportSystem />;
}
```

---

## UI Components

### AppLayout

**File:** `components/AppLayout.tsx`

**Purpose:** Provides the main layout structure for the application.

**Features:**
- Consistent header with navigation
- Sidebar for tool navigation
- Mobile-responsive design
- Footer inclusion

**Usage:**
```tsx
import AppLayout from '@/components/AppLayout';

function RootLayout({ children }) {
  return <AppLayout>{children}</AppLayout>;
}
```

**Key Props:**
- `children`: React nodes to display in the main content area

---

### SidebarNav

**File:** `components/ui/SidebarNav.tsx`

**Purpose:** Navigation component for accessing all tools.

**Features:**
- List of all available tools
- Icon and label for each tool
- Active state indication
- Mobile-friendly design

**Usage:**
```tsx
import { SidebarNav } from '@/components/ui/SidebarNav';

function MyComponent() {
  return <SidebarNav />;
}
```

**Key Props:**
- `className`: Optional class name for styling

---

### Footer

**File:** `components/ui/Footer.tsx`

**Purpose:** Consistent footer across the application.

**Features:**
- Copyright information
- External links
- Social media links
- Credits

**Usage:**
```tsx
import { Footer } from '@/components/ui/Footer';

function MyComponent() {
  return <Footer />;
}
```

---

### Basic UI Components

The project includes various shadcn/ui components customized for the application:

#### Button

**File:** `components/ui/button.tsx`

**Usage:**
```tsx
import { Button } from '@/components/ui/button';

function MyComponent() {
  return <Button>Click me</Button>;
}
```

**Variants:**
- `default`: Primary action
- `destructive`: Dangerous actions
- `outline`: Secondary actions
- `ghost`: Low-emphasis actions
- `link`: Text-like button

#### Card

**File:** `components/ui/card.tsx`

**Components:**
- `Card`: Container
- `CardHeader`: Top section
- `CardTitle`: Main heading
- `CardDescription`: Subheading
- `CardContent`: Main content area
- `CardFooter`: Bottom section

**Usage:**
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent>Content goes here</CardContent>
    </Card>
  );
}
```

#### Input

**File:** `components/ui/input.tsx`

**Usage:**
```tsx
import { Input } from '@/components/ui/input';

function MyComponent() {
  return <Input placeholder="Enter text" />;
}
```

#### Select

**File:** `components/ui/select.tsx`

**Components:**
- `Select`: Container
- `SelectTrigger`: Clickable button
- `SelectValue`: Selected value display
- `SelectContent`: Dropdown content
- `SelectItem`: Individual option

**Usage:**
```tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

function MyComponent() {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
      </SelectContent>
    </Select>
  );
}
```

#### Other Components

The UI library includes many other components:
- `Label`: Form labels
- `Tabs`: Tabbed interfaces
- `Sheet`: Slide-out panels
- `Slider`: Range input
- `Tooltip`: Information tooltips
- `Toast`: Notification messages
- `Checkbox`: Boolean inputs
- And more...

Each follows a similar pattern of usage and can be imported from their respective files in the `components/ui` directory.