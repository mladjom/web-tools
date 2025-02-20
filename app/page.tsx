import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6">Web Development Tools</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
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
            <Link href="/tools/aspectratio">
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
            <Link href="/tools/typography">
              <Button>Open Tool</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}