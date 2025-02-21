import { Skeleton } from "@/components/ui/skeleton"
import { Container } from "@/components/ui/container"

export default function Loading() {
  return (
    <Container>
      <Skeleton className="h-[600px] w-full rounded-xl" />
    </Container>
  )
}