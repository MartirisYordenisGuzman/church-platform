'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

// Función auxiliar
async function getCurrentUserChurch() {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) redirect('/login')

    const userChurch = await prisma.userChurch.findFirst({
        where: { userId: user.id },
        include: { church: true }
    })

    if (!userChurch) redirect('/dashboard')

    return userChurch
}

export async function createMember(prevState: any, formData: FormData) {
    const userChurch = await getCurrentUserChurch()

    const first_name = formData.get('first_name') as string
    const last_name = formData.get('last_name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const birth_date = formData.get('birth_date') as string

    if (!first_name || !last_name) {
        return { error: 'Nombre y apellido son obligatorios.' }
    }

    try {
        await prisma.member.create({
            data: {
                church_id: userChurch.church_id,
                first_name,
                last_name,
                email: email || null,
                phone: phone || null,
                birth_date: birth_date ? new Date(birth_date) : null,
            },
        })
    } catch (error: any) {
        console.error('Error creando miembro:', error)
        return { error: 'Error al registrar el miembro. ¿Quizás el email ya existe?' }
    }

    revalidatePath('/dashboard/directory')
    redirect('/dashboard/directory')
}

export async function updateMember(prevState: any, formData: FormData) {
    const userChurch = await getCurrentUserChurch()

    const id = formData.get('id') as string
    const first_name = formData.get('first_name') as string
    const last_name = formData.get('last_name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const birth_date = formData.get('birth_date') as string

    if (!id || !first_name || !last_name) {
        return { error: 'Nombre y apellido son obligatorios.' }
    }

    try {
        await prisma.member.update({
            where: { id, church_id: userChurch.church_id },
            data: {
                first_name,
                last_name,
                email: email || null,
                phone: phone || null,
                birth_date: birth_date ? new Date(birth_date) : null,
            },
        })
    } catch (error: any) {
        console.error('Error actualizando miembro:', error)
        return { error: 'Error al actualizar el miembro.' }
    }

    revalidatePath('/dashboard/directory')
    redirect('/dashboard/directory')
}

export async function deleteMember(memberId: string) {
    const userChurch = await getCurrentUserChurch()

    try {
        await prisma.member.delete({
            where: {
                id: memberId,
                church_id: userChurch.church_id
            }
        })
    } catch (error) {
        console.error('Error borrando miembro:', error)
    }

    revalidatePath('/dashboard/directory')
}
