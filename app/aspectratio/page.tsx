import AspectRatioCalculator from '@/components/AspectRatioCalculator'

export const metadata = {
  title: 'Aspect Ratio Calculator | Web Tools',
  description: 'Calculate aspect ratios, get letterbox/pillarbox dimensions, and crop suggestions for responsive design.',
  keywords: 'aspect ratio calculator, image dimensions, responsive design, letterbox calculator',
  openGraph: {
    title: 'Aspect Ratio Calculator | Web Tools',
    description: 'Free tool for calculating aspect ratios and more.',
    url: 'https://tools.milentijevic.com/aspectratio',
    images: ['/og-image.webp'],
  },
};

export default function AspectRatioCalculatorPage() {
  return <AspectRatioCalculator />
}