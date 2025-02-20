"use client"
import { Container } from "@/components/ui/container"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <Container>
      <div className="flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-bold">Something went wrong!</h2>
        <button
          className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white"
          onClick={() => reset()}
        >
          Try again
        </button>
      </div>
    </Container>
  )
}