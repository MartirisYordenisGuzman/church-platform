'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

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

export async function getPortalConfig() {
    const userChurch = await getCurrentUserChurch()

    let config = await prisma.portalConfig.findUnique({
        where: { church_id: userChurch.church_id },
        include: { blocks: { orderBy: { order: 'asc' } } }
    })

    if (!config) {
        config = await prisma.portalConfig.create({
            data: {
                church_id: userChurch.church_id,
                theme: { primaryColor: '#4f46e5' } as Prisma.JsonObject,
                blocks: {
                    create: [
                        { type: 'hero', order: 0, is_visible: true, data: { title: 'Bienvenidos', subtitle: 'A nuestra iglesia online' } as Prisma.JsonObject },
                        { type: 'events', order: 1, is_visible: true, data: { title: 'Próximos Eventos' } as Prisma.JsonObject },
                        { type: 'sermons', order: 2, is_visible: true, data: { title: 'Últimas Prédicas' } as Prisma.JsonObject }
                    ]
                }
            },
            include: { blocks: { orderBy: { order: 'asc' } } }
        })
    }

    return config
}

export async function updatePortalTheme(prevState: any, formData: FormData) {
    const userChurch = await getCurrentUserChurch()
    const primaryColor = formData.get('primaryColor') as string
    const layout = formData.get('layout') as string

    try {
        await prisma.portalConfig.upsert({
            where: { church_id: userChurch.church_id },
            update: {
                theme: { primaryColor } as Prisma.JsonObject,
                layout: layout || 'LANDING_PAGE'
            },
            create: {
                church_id: userChurch.church_id,
                theme: { primaryColor } as Prisma.JsonObject,
                layout: layout || 'LANDING_PAGE'
            }
        })

        revalidatePath(`/${userChurch.church.slug}`, 'layout')
        return { success: true }
    } catch (error) {
        console.error('Error updating portal theme:', error)
        return { error: 'Ocurrió un error al actualizar el tema.' }
    }
}

export async function updateBlocksOrder(blocksList: { id: string, order: number }[]) {
    const userChurch = await getCurrentUserChurch()

    try {
        // En una transacción, actualizamos el orden de cada bloque
        await prisma.$transaction(
            blocksList.map((b) =>
                prisma.portalBlock.update({
                    where: { id: b.id },
                    data: { order: b.order }
                })
            )
        )

        revalidatePath(`/${userChurch.church.slug}`, 'layout')
        return { success: true }
    } catch (error) {
        console.error('Error updating blocks order:', error)
        return { error: 'Ocurrió un error al ordenar los bloques.' }
    }
}

export async function toggleBlockVisibility(blockId: string, isVisible: boolean) {
    const userChurch = await getCurrentUserChurch()

    try {
        await prisma.portalBlock.update({
            where: { id: blockId },
            data: { is_visible: isVisible }
        })

        revalidatePath(`/${userChurch.church.slug}`, 'layout')
        return { success: true }
    } catch (error) {
        console.error('Error toggling block visibility:', error)
        return { error: 'Ocurrió un error al actualizar la visibilidad.' }
    }
}

export async function addBlock(type: string) {
    const userChurch = await getCurrentUserChurch()

    try {
        const portalConfig = await prisma.portalConfig.findUnique({
            where: { church_id: userChurch.church_id },
            include: { blocks: true }
        })

        if (!portalConfig) throw new Error("Configuración no encontrada")

        // Determinar el nuevo orden (al final de la lista)
        const newOrder = portalConfig.blocks.length > 0
            ? Math.max(...portalConfig.blocks.map(b => b.order)) + 1
            : 0

        // Datos por defecto según el tipo
        let defaultData: any = {}
        if (type === 'hero') defaultData = { title: 'Nueva Sección Hero', subtitle: 'Añade tu subtítulo aquí' }
        if (type === 'events') defaultData = { title: 'Eventos Especiales' }
        if (type === 'sermons') defaultData = { title: 'Prédicas Destacadas', subtitle: 'Colección de mensajes' }
        if (type === 'ministries') defaultData = { title: 'Nuestros Ministerios' }
        if (type === 'custom_text') defaultData = { title: 'Título Personalizado', text: 'Escribe aquí tu contenido personalizado...' }

        await prisma.portalBlock.create({
            data: {
                config_id: portalConfig.id,
                type,
                order: newOrder,
                is_visible: true,
                data: defaultData as Prisma.JsonObject
            }
        })

        revalidatePath(`/${userChurch.church.slug}`, 'layout')
        return { success: true }
    } catch (error) {
        console.error('Error adding new block:', error)
        return { error: 'Ocurrió un error al añadir la sección.' }
    }
}

export async function deleteBlock(blockId: string) {
    const userChurch = await getCurrentUserChurch()

    try {
        await prisma.portalBlock.delete({
            where: { id: blockId }
        })

        revalidatePath(`/${userChurch.church.slug}`, 'layout')
        return { success: true }
    } catch (error) {
        console.error('Error deleting block:', error)
        return { error: 'Ocurrió un error al eliminar la sección.' }
    }
}

export async function updateBlockData(blockId: string, data: any) {
    const userChurch = await getCurrentUserChurch()

    try {
        await prisma.portalBlock.update({
            where: { id: blockId },
            data: { data: data as Prisma.JsonObject }
        })

        revalidatePath(`/${userChurch.church.slug}`, 'layout')
        return { success: true }
    } catch (error) {
        console.error('Error updating block data:', error)
        return { error: 'Ocurrió un error al actualizar el contenido.' }
    }
}
