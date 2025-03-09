import AvatarGenerator from '@/components/AvatarGenerator'

export const metadata = {
  title: 'Avatar Generator | Web Tools',
  description: 'Create custom avatars for profiles, apps, and websites with various styles and options.',
  keywords: 'avatar generator, profile pictures, custom avatar, initials avatar, avatar maker',
  openGraph: {
    title: 'Avatar Generator | Web Tools',
    description: 'Free tool for creating custom avatars and profile pictures.',
    url: 'https://tools.milentijevic.com/avatar-generator',
    images: ['/og-webtools.webp'],
  },
};

export default function AvatarGeneratorPage() {
  return <AvatarGenerator />
}