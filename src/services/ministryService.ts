import { prisma } from "@/lib/prisma"

export const ministryService = {
    async getMinistriesByChurchId(churchId: string) {
        try {
            // @ts-ignore - Prisma types might be out of sync in IDE
            const ministries = await prisma.ministry.findMany({
                where: {
                    church_id: churchId,
                    // @ts-ignore
                    parent_id: null
                },
                include: {
                    // @ts-ignore
                    departments: true,
                },
                orderBy: { name: "asc" },
            })
            return ministries as any[]
        } catch (error) {
            console.error(`Error fetching ministries for church (${churchId}):`, error)
            return []
        }
    },

    async getMinistryById(id: string) {
        try {
            // @ts-ignore - Prisma types might be out of sync
            const ministry = await prisma.ministry.findUnique({
                where: { id },
                include: {
                    // @ts-ignore
                    departments: true,
                    // @ts-ignore
                    parent: true,
                    events: {
                        take: 5,
                        orderBy: { start_date: 'asc' }
                    }
                }
            })
            return ministry as any
        } catch (error) {
            console.error(`Error fetching ministry (${id}):`, error)
            return null
        }
    }
}
