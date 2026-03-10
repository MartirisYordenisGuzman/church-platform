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

    // Si no tiene iglesia, no puede crear eventos
    if (!userChurch) {
        redirect('/dashboard')
    }

    return userChurch
}

import { EventRecurrence, EventVisibility } from '@prisma/client'

export async function createEvent(prevState: any, formData: FormData) {
    const userChurch = await getCurrentUserChurch()

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const location = formData.get('location') as string
    const startDateStr = formData.get('start_date') as string
    const endDateStr = formData.get('end_date') as string

    // Novedades: Recurrencia y Visibilidad
    const recurrence = formData.get('recurrence') as EventRecurrence || 'NONE'
    const recurrenceEndDateStr = formData.get('recurrence_end_date') as string
    const visibility = formData.get('visibility') as EventVisibility || 'PUBLIC'
    const ministryId = formData.get('ministry_id') as string

    if (!title || !startDateStr || !endDateStr) {
        return { error: 'Título, Fecha de Inicio y Fecha de Fin son obligatorios.' }
    }

    try {
        await prisma.event.create({
            data: {
                church_id: userChurch.church_id,
                title,
                description,
                location,
                start_date: new Date(startDateStr),
                end_date: new Date(endDateStr),
                recurrence,
                recurrence_end_date: recurrenceEndDateStr ? new Date(recurrenceEndDateStr) : null,
                visibility,
                ministry_id: ministryId || null,
            },
        })
    } catch (error: any) {
        console.error('Error creando evento:', error)
        return { error: 'Ocurrió un error inesperado al guardar el evento.' }
    }

    revalidatePath('/dashboard/events')
    revalidatePath(`/${userChurch.church.slug}/events`)
    redirect('/dashboard/events')
}

export async function deleteEvent(eventId: string) {
    const userChurch = await getCurrentUserChurch()

    try {
        // Aseguramos que el evento le pertenezca a la iglesia del usuario antes de borrar
        await prisma.event.delete({
            where: {
                id: eventId,
                church_id: userChurch.church_id
            }
        })
    } catch (error) {
        console.error('Error borrando evento:', error)
        // Silencioso pero loggeado
    }

    revalidatePath('/dashboard/events')
    revalidatePath(`/${userChurch.church.slug}/events`)
}
