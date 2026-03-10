import { prisma } from "@/lib/prisma"

export default async function Home() {
  const churches = await prisma.church.findMany()

  return (
    <div>
      <h1>Church Platform</h1>
      <pre>{JSON.stringify(churches, null, 2)}</pre>
    </div>
  )
}
