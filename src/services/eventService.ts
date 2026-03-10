import { prisma } from "@/lib/prisma"
import { Event } from "@prisma/client"

export const eventService = {
    /**
     * Obtiene todos los eventos asociados a una iglesia específica (por ID de iglesia)
     */
    async getEventsByChurchId(churchId: string): Promise<Event[]> {
        try {
            const events = await prisma.event.findMany({
                where: { church_id: churchId },
                include: { ministry: true },
                orderBy: { start_date: "asc" },
            })
            return events
        } catch (error) {
            console.error(`Error fetching events for church (${churchId}):`, error)
            return []
        }
    },

    /**
     * Obtiene solo los eventos públicos para mostrar en el portal de la iglesia
     */
    async getPublicEventsByChurchId(churchId: string): Promise<Event[]> {
        try {
            const events = await prisma.event.findMany({
                where: {
                    church_id: churchId,
                    visibility: 'PUBLIC'
                },
                include: { ministry: true },
                orderBy: { start_date: "asc" },
            })
            return events
        } catch (error) {
            console.error(`Error fetching events for church (${churchId}):`, error)
            return []
        }
    },
}
