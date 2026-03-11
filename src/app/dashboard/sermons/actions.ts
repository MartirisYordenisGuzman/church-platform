'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

// Función auxiliar para obtener la iglesia del usuario actual
async function getCurrentUserChurch() {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        redirect('/login')
    }

    const userChurch = await prisma.userChurch.findFirst({
        where: { userId: user.id },
        include: { church: true }
    })

    if (!userChurch) {
        redirect('/dashboard')
    }

    return userChurch
}

// Función auxiliar para extraer el ID de un video de YouTube
function extractYouTubeId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
}

export async function createSermon(prevState: any, formData: FormData) {
    const userChurch = await getCurrentUserChurch()

    const title = formData.get('title') as string
    const preacher = formData.get('preacher') as string
    const series = formData.get('series') as string
    const dateStr = formData.get('date') as string
    const youtubeUrl = formData.get('youtube_url') as string

    if (!title || !preacher || !dateStr || !youtubeUrl) {
        return { error: 'Título, Predicador, Fecha y Enlace de YouTube son obligatorios.' }
    }

    const youtubeVideoId = extractYouTubeId(youtubeUrl)
    if (!youtubeVideoId) {
        return { error: 'El enlace de YouTube no parece ser válido. Asegúrate de copiar la URL completa del video.' }
    }

    try {
        await prisma.sermon.create({
            data: {
                church_id: userChurch.church_id,
                title,
                preacher,
                series: series || null,
                date: new Date(dateStr),
                youtube_video_id: youtubeVideoId,
            },
        })
    } catch (error: any) {
        console.error('Error creando prédica:', error)
        return { error: 'Ocurrió un error inesperado al guardar la prédica.' }
    }

    revalidatePath('/dashboard/sermons')
    revalidatePath(`/${userChurch.church.slug}/sermons`)
    redirect('/dashboard/sermons')
}

export async function deleteSermon(sermonId: string) {
    const userChurch = await getCurrentUserChurch()

    try {
        await prisma.sermon.delete({
            where: {
                id: sermonId,
                church_id: userChurch.church_id
            }
        })
    } catch (error) {
        console.error('Error borrando prédica:', error)
    }

    revalidatePath('/dashboard/sermons')
    revalidatePath(`/${userChurch.church.slug}/sermons`)
}

export async function updateSermon(prevState: any, formData: FormData) {
    const userChurch = await getCurrentUserChurch()

    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const preacher = formData.get('preacher') as string
    const series = formData.get('series') as string
    const dateStr = formData.get('date') as string
    const youtubeUrl = formData.get('youtube_url') as string

    if (!id || !title || !preacher || !dateStr || !youtubeUrl) {
        return { error: 'ID, Título, Predicador, Fecha y Enlace de YouTube son obligatorios.' }
    }

    const youtubeVideoId = extractYouTubeId(youtubeUrl)
    if (!youtubeVideoId) {
        return { error: 'El enlace de YouTube no parece ser válido.' }
    }

    try {
        await prisma.sermon.update({
            where: { id, church_id: userChurch.church_id },
            data: {
                title,
                preacher,
                series: series || null,
                date: new Date(dateStr),
                youtube_video_id: youtubeVideoId,
            },
        })
    } catch (error: any) {
        console.error('Error actualizando prédica:', error)
        return { error: 'Ocurrió un error inesperado al actualizar la prédica.' }
    }

    revalidatePath('/dashboard/sermons')
    revalidatePath(`/${userChurch.church.slug}/sermons`)
    redirect('/dashboard/sermons')
}
