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

export async function createMinistry(prevState: any, formData: FormData) {
    const userChurch = await getCurrentUserChurch()

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const leader_name = formData.get('leader_name') as string
    const coleader_name = formData.get('coleader_name') as string
    const parent_id = formData.get('parent_id') as string

    if (!name) {
        return { error: 'El nombre del ministerio es obligatorio.' }
    }

    try {
        await prisma.ministry.create({
            data: {
                church_id: userChurch.church_id,
                name,
                description: description || null,
                leader_name: leader_name || null,
                coleader_name: coleader_name || null,
                parent_id: parent_id || null, // Si tiene parent_id, es un departamento
            },
        })
    } catch (error: any) {
        console.error('Error creando ministerio/departamento:', error)
        return { error: 'Ocurrió un error inesperado al guardar el ministerio.' }
    }

    revalidatePath('/dashboard/ministries')
    redirect('/dashboard/ministries')
}

export async function updateMinistry(prevState: any, formData: FormData) {
    const userChurch = await getCurrentUserChurch()

    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const leader_name = formData.get('leader_name') as string
    const coleader_name = formData.get('coleader_name') as string
    const parent_id = formData.get('parent_id') as string

    if (!id || !name) {
        return { error: 'El ID y el nombre son obligatorios.' }
    }

    try {
        // Aseguramos que el ministerio le pertenece a la iglesia antes de actualizar
        const existingMinistry = await prisma.ministry.findUnique({
            where: { id, church_id: userChurch.church_id }
        })

        if (!existingMinistry) {
            return { error: 'Ministerio no encontrado.' }
        }

        // Validación para evitar ciclos infinitos (no puede ser su propio padre)
        if (id === parent_id) {
            return { error: 'Un ministerio no puede ser su propio departamento.' }
        }

        await prisma.ministry.update({
            where: { id },
            data: {
                name,
                description: description || null,
                leader_name: leader_name || null,
                coleader_name: coleader_name || null,
                parent_id: parent_id || null,
            },
        })
    } catch (error: any) {
        console.error('Error actualizando ministerio/departamento:', error)
        return { error: 'Ocurrió un error inesperado al actualizar el ministerio.' }
    }

    revalidatePath('/dashboard/ministries')
    redirect('/dashboard/ministries')
}

export async function deleteMinistry(ministryId: string) {
    const userChurch = await getCurrentUserChurch()

    try {
        await prisma.ministry.delete({
            where: {
                id: ministryId,
                church_id: userChurch.church_id
            }
        })
    } catch (error) {
        console.error('Error borrando ministerio:', error)
        // Silencioso pero loggeado
    }

    revalidatePath('/dashboard/ministries')
}
