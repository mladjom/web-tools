# Web Tools Project

A collection of useful web development tools built with Next.js and shadcn/ui components. This project provides various utilities for developers including aspect ratio calculations and typography generation.

## 🚀 Features

- **Aspect Ratio Calculator**: Calculate and analyze aspect ratios for responsive design
  - Analyze dimensions and ratios
  - Calculate letterbox/pillarbox dimensions
  - Generate crop suggestions
  - Preview results visually

- **Typography Generator**: Create and preview typography settings
  - Generate responsive font sizes
  - Preview text in different contexts
  - Export typography configurations

## Live Demo

[Web Tools](https://web-tools-5r4qhe2bz-mladjoms-projects.vercel.app/) 

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## 📦 Project Structure

```
├── app
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── tools
│       ├── aspectratio
│       │   └── page.tsx
│       ├── aspectratioold
│       │   └── page.tsx
│       └── typography
│           ├── loading.tsx
│           └── page.tsx
├── components
│   ├── AppLayout.tsx
│   ├── AspectRatioCalculatorOld.tsx
│   ├── AspectRatioCalculator.tsx
│   ├── SidebarNav.tsx
│   ├── TypographyGenerator.tsx
│   └── ui
│       ├── button.tsx
│       ├── card.tsx
│       ├── container.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── sheet.tsx
│       ├── skeleton.tsx
│       ├── tabs.tsx
│       ├── toast.tsx
│       ├── tooltip.tsx
│       └── useToast.tsx
├── components.json
├── eslint.config.mjs
├── hooks
├── lib
│   └── utils.ts
├── LICENCE.md
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

## 🚀 Getting Started

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

## 📝 Environment Setup

Ensure you have:
- Node.js 18.x or later
- npm 9.x or later

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the excellent component library
- [Next.js](https://nextjs.org/) team for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

## 📞 Contact

For any questions or feedback, please open an issue in the repository.