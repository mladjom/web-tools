# Web Tools

A comprehensive collection of web development tools built with Next.js and shadcn/ui components.

![Web Tools](public/og-webtools.jpg)

## 🚀 Features

### Aspect Ratio Calculator
- Calculate and analyze aspect ratios for responsive design
- Determine letterbox/pillarbox dimensions
- Generate crop suggestions for different aspect ratios
- Visual preview of results

### Typography Generator
- Create responsive typography systems
- Generate font scales based on mathematical ratios
- Calculate ideal line heights and letter spacing
- Export to CSS or SCSS

### Image Processor
- Upload, resize, and transform images
- Maintain aspect ratios or crop to specific dimensions
- Convert between formats (JPEG, PNG, WebP)
- Control quality and file size

### Avatar Generator
- Create custom avatars for profiles and applications
- Generate text-based avatars with initials or emoji
- Customize colors, patterns, and shapes
- Upload and crop images for profile pictures

### Design System Generator
- Create complete design systems with consistent tokens
- Generate typography scales, color palettes, and spacing
- Define component tokens (border radius, shadows, etc.)
- Export to various formats (CSS, SCSS, Tailwind)

## 📦 Project Structure

```
├── app                   # Next.js app directory
│   ├── aspectratio       # Aspect ratio calculator page
│   ├── avatar-generator  # Avatar generator page
│   ├── design-system-generator # Design system generator page
│   ├── imageprocessor    # Image processor page
│   ├── typography        # Typography generator page
│   ├── globals.css       # Global styles
│   └── layout.tsx        # Root layout
├── components
│   ├── AppLayout.tsx     # Main application layout
│   ├── AspectRatioCalculator.tsx 
│   ├── ImageProcessor.tsx
│   ├── TypographyGenerator.tsx
│   ├── tools             # Tool-specific components
│   │   ├── AvatarGenerator.tsx
│   │   └── design-system # Design system components
│   └── ui                # UI components (shadcn/ui)
├── lib                   # Utility functions
└── public                # Static assets
```

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Lucide React](https://lucide.dev/) - Icon library

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later

### Installation

1. Clone the repository:
```bash
git clone git@github.com:mladjom/web-tools.git
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔧 Available Scripts

- `npm run dev` - Run development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 UI Components

This project uses shadcn/ui components. To add new components:

```bash
npx shadcn@latest add button [component-name]
```

Available components in the project:
- Button
- Card
- Input
- Label
- Select
- Sheet
- Tabs
- Toast
- Tooltip
- And many more...

## 📄 Documentation

For detailed documentation of each component, please refer to:

- [Components Reference](./COMPONENTS.md) - Detailed information about each component
- [Avatar Generator](./AVATAR-GENERATOR.md) - Specific documentation for the Avatar Generator

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENCE.md) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the excellent component library
- [Next.js](https://nextjs.org/) team for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

## 📞 Contact

For any questions or feedback, please open an issue in the repository.