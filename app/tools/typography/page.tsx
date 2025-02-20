import TypographyGenerator from '@/components/TypographyGenerator'
import { Container } from "@/components/ui/container"

export const metadata = {
  title: 'Typography Generator | Web Tools',
  description: 'Generate responsive typography settings, preview fonts, and export configurations for web projects.',
  keywords: 'typography generator, font sizing, responsive typography, web fonts',
};

export default function TypographyPage() {
  return (
    <Container>
      <TypographyGenerator />
    </Container>
  )
}