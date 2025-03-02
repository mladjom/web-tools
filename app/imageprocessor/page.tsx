import ImageProcessor from '@/components/ImageProcessor'

export const metadata = {
  title: 'Image Processor | Web Tools',
  description: 'Upload, process, resize, and download images with aspect ratio controls.',
  keywords: 'image processor, image resize, aspect ratio, download images, web tools',
  openGraph: {
    title: 'Image Processor | Web Tools',
    description: 'Free tool for processing and transforming images.',
    url: 'https://web-tools.milentijevic.com/tools/imageprocessor',
    images: ['/images/webtools.webp'],
  },
};

export default function ImageProcessorPage() {
  return <ImageProcessor />
}