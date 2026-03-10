import { prisma } from "@/lib/prisma"
import { Sermon } from "@prisma/client"

export const sermonService = {
    /**
     * Obtiene todos los sermones de una iglesia (por ID de iglesia)
     */
    async getSermonsByChurchId(churchId: string): Promise<Sermon[]> {
        try {
            const sermons = await prisma.sermon.findMany({
                where: { church_id: churchId },
                orderBy: { date: "desc" },
            })
            return sermons
        } catch (error) {
            console.error(`Error fetching sermons for church (${churchId}):`, error)
            return []
        }
    },

    /**
     * Helper function: Convierte un ID de video en la URL para el iFrame Embed
     */
    getYoutubeEmbedUrl(videoId: string): string {
        return `https://www.youtube.com/embed/${videoId}`
    }
}
