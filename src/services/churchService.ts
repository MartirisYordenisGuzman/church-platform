import { prisma } from "@/lib/prisma"
import { ChurchProfile } from "@/types/church"

export const churchService = {
    /**
     * Obtiene la información pública de la iglesia a partir de su slug.
     * Útil para el Enrutamiento Dinámico principal (Ej: /mi-iglesia)
     */
    async getChurchBySlug(slug: string): Promise<ChurchProfile | null> {
        try {
            const church = await prisma.church.findUnique({
                where: { slug },
                include: {
                    portalConfig: {
                        include: {
                            blocks: {
                                orderBy: { order: "asc" },
                            },
                        },
                    },
                },
            })
            return church
        } catch (error) {
            console.error(`Error fetching church by slug (${slug}):`, error)
            return null
        }
    },

    /**
     * Obtiene la iglesia junto con todo su contenido público relacionado.
     * Opcionalmente filtra para traer contenido básico en la vista agregada.
     */
    async getChurchFullProfileBySlug(slug: string): Promise<ChurchProfile | null> {
        try {
            const church = await prisma.church.findUnique({
                where: { slug },
                include: {
                    events: {
                        orderBy: { start_date: "asc" },
                        take: 3, // Solo los próximos 3 eventos para el home
                    },
                    sermons: {
                        orderBy: { date: "desc" },
                        take: 3,
                    },
                    portalConfig: {
                        include: {
                            blocks: {
                                orderBy: { order: "asc" },
                            },
                        },
                    },
                },
            })
            return church
        } catch (error) {
            console.error(`Error fetching full church profile (${slug}):`, error)
            return null
        }
    },
}
