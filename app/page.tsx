import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6">Web Development Tools</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Aspect Ratio Calculator</CardTitle>
            <CardDescription>
              Calculate dimensions, analyze ratios, and get display recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 space-y-2">
              <li>Analyze image dimensions</li>
              <li>Calculate letterbox/pillarbox</li>
              <li>Get crop suggestions</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/aspectratio">
              <Button>Open Tool</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Typography Generator</CardTitle>
            <CardDescription>
              Create responsive typography settings for web projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 space-y-2">
              <li>Generate font sizes</li>
              <li>Preview typography</li>
              <li>Export configurations</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/typography">
              <Button>Open Tool</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Image Processor</CardTitle>
            <CardDescription>
              Upload, process, and transform images for your projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 space-y-2">
              <li>Resize and crop images</li>
              <li>Apply aspect ratios</li>
              <li>Download optimized images</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/imageprocessor">
              <Button>Open Tool</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avatar Generator</CardTitle>
            <CardDescription>
              Create custom avatars for profiles, apps, and websites
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 space-y-2">
              <li>Generate text-based avatars</li>
              <li>Apply custom styles and colors</li>
              <li>Use patterns and gradients</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/avatar-generator">
              <Button>Open Tool</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Design System Generator</CardTitle>
            <CardDescription>
              Build complete design systems with tokens and styles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 space-y-2">
              <li>Create color palettes</li>
              <li>Define typography scales</li>
              <li>Generate spacing systems</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/design-system-generator">
              <Button>Open Tool</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}