import { getPoems } from "@/lib/data-store"
import { notFound } from "next/navigation"
import PoemDetailClient from "./poem-detail-client"

export function generateStaticParams() {
  const poems = getPoems()
  return poems.map((poem) => ({
    id: poem.id,
  }))
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PoemDetailPage({ params }: PageProps) {
  const { id } = await params
  const poems = getPoems()
  const poem = poems.find((p) => p.id === id)

  if (!poem) {
    notFound()
  }

  return <PoemDetailClient poem={poem} />
}
