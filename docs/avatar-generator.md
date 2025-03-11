# Avatar Generator

## Overview

The Avatar Generator is a powerful tool for creating custom profile pictures and avatars for websites, applications, and online profiles. It offers a comprehensive set of customization options including text, colors, patterns, shapes, and image uploads.

## Features

- **Multiple shape options**: Circle, square, and rounded square
- **Text-based avatars**: Use initials, characters, or emoji
- **Customizable colors**: Solid background colors or gradients
- **Pattern overlays**: Add visual interest with various pattern types
- **Border customization**: Adjust width and color
- **Font settings**: Select from various font families
- **Image uploads**: Use your own images as avatar backgrounds
- **Random generation**: Get inspiration with one click
- **History**: Keep track of previously generated avatars

## Components

### AvatarGenerator.tsx

The main component that handles all avatar generation functionality.

**Location**: `components/tools/AvatarGenerator.tsx`

**Props**: None

**State**:
- `avatarProps`: Contains all customizable avatar properties
- `generatedAvatars`: Array of data URLs for previously generated avatars
- `selectedAvatarIndex`: Index of the currently selected avatar from history
- `customImageUrl`: URL for the uploaded custom image

**Key Functions**:
- `generateAvatar()`: Renders the avatar to the canvas based on current settings
- `drawPattern()`: Generates various pattern types for overlay
- `handleChange()`: Updates avatar properties when user changes settings
- `generateRandomAvatar()`: Creates a random avatar with preset values
- `downloadAvatar()`: Exports the current avatar as a PNG file
- `copyAvatar()`: Copies the current avatar to the clipboard

### AvatarGeneratorPage.tsx

A simple page component that renders the AvatarGenerator component.

**Location**: `app/avatar-generator/page.tsx`

**Purpose**:
- Provides routing for the tool
- Sets page metadata for SEO

## How to Use

### Basic Usage

1. Navigate to the Avatar Generator tool via the sidebar
2. Choose a shape (circle, square, or rounded)
3. Enter text if you want a text-based avatar (initials, emoji, etc.)
4. Adjust colors, patterns, and other settings using the tabs
5. Click "Download Avatar" to save your creation

### Creating Text-Based Avatars

1. Select the "Text" tab
2. Enter 1-3 characters or an emoji in the "Text/Initials" field
3. Choose a font from the dropdown menu
4. Adjust font size and color as needed
5. Use the preset buttons for quick initials or emoji

### Using Custom Images

1. Select the "Image" tab
2. Toggle "Use Background Image" to enable image uploads
3. Click "Choose File" to upload an image
4. The image will automatically be centered and cropped to fit your chosen shape
5. You can still add text overlays and borders on top of your image

### Applying Styles

1. Select the "Style" tab
2. Toggle "Use Gradient" for gradient backgrounds
   - Select direction and colors for the gradient
3. Toggle "Use Pattern" for pattern overlays
   - Choose pattern type, color, and opacity
4. In the "Basic" tab, add borders by adjusting the border width and color

### Saving and Sharing

1. Click "Download Avatar" to save as PNG
2. Use "Copy" to copy the image to clipboard
3. Previously generated avatars appear in the history section
   - Click on any previous avatar to select it

## Technical Details

The avatar generator uses HTML Canvas for rendering, which provides several advantages:
- High-quality image generation
- No dependencies on external services
- Complete control over every pixel
- Easy export to standard image formats

## Customization Options

### Shapes
- Circle: Perfect for profile pictures
- Square: Good for app icons
- Rounded Square: Modern look with soft corners

### Colors
- Solid colors with color picker
- Gradient options with customizable direction
- Quick palette selection

### Patterns
- Dots: Subtle texture overlay
- Lines: Horizontal stripes
- Crosshatch: Grid pattern
- Diagonal: Slanted lines
- Triangles: Geometric pattern

### Text
- Custom text input (1-3 characters recommended)
- Font family selection
- Adjustable font size
- Custom text color

### Borders
- Adjustable width (0-20px)
- Custom border color
- Properly aligned with shape edges

## Best Practices

- For text-based avatars, 1-2 characters work best
- Use contrasting colors for better readability
- Keep pattern opacity low (10-30%) for subtle effects
- For gradient backgrounds, choose related colors for a cohesive look
- When using custom images, simple images with clear subjects work best

## Troubleshooting

- If text appears cut off, try reducing the font size
- If a custom image doesn't appear, check that it's a supported format (JPEG, PNG, etc.)
- For performance issues on older devices, avoid very large image uploads
- If colors don't match your expectation, ensure you're using valid color values (HEX, RGB, etc.)