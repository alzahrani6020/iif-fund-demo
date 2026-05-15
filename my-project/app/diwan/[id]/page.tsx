import { getPoems } from "@/lib/data-store"
import { notFound } from "next/navigation"
import PoemDetailClient from "./poem-detail-client"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PoemDetailPage({ params }: PageProps) {
  const { id } = await params
  const poems = await getPoems()
  const poem = poems.find((p) => (p as any)._id === id || p.id === id)

  if (!poem) {
    notFound()
  }

  return <PoemDetailClient poem={poem} />
}
