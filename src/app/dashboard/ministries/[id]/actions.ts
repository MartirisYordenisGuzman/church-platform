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

export async function addMemberToMinistry(prevState: any, formData: FormData) {
    const userChurch = await getCurrentUserChurch()

    const ministry_id = formData.get('ministry_id') as string | null
    const member_id = formData.get('member_id') as string | null
    const role = formData.get('role') as string | null

    if (!ministry_id || !member_id || !role) {
        return { error: 'Todos los campos son obligatorios.' }
    }

    try {
        // Verificar que el ministerio y el miembro pertenezcan a la iglesia del usuario
        const ministry = await prisma.ministry.findFirst({
            where: { id: ministry_id, church_id: userChurch.church_id }
        })

        const member = await prisma.member.findFirst({
            where: { id: member_id, church_id: userChurch.church_id }
        })

        if (!ministry || !member) {
            return { error: 'Ministerio o Miembro no encontrado o no pertenece a tu iglesia.' }
        }

        await prisma.ministryMember.create({
            data: {
                ministry_id,
                member_id,
                role
            }
        })
    } catch (error: any) {
        console.error('Error añadiendo miembro al ministerio:', error)
        if (error.code === 'P2002') { // Unique constraint violation (Prisma)
            return { error: 'Esta persona ya pertenece a este ministerio.' }
        }
        return { error: 'Error al añadir al miembro. Intenta de nuevo.' }
    }

    revalidatePath(`/dashboard/ministries/${ministry_id}`)
    return { success: true }
}

export async function removeMemberFromMinistry(ministryMemberId: string, ministryId: string) {
    const userChurch = await getCurrentUserChurch()

    try {
        // Verificar que el registro pertenezca a un ministerio de la iglesia del usuario
        const record = await prisma.ministryMember.findFirst({
            where: {
                id: ministryMemberId,
                ministry: {
                    church_id: userChurch.church_id
                }
            }
        })

        if (record) {
            await prisma.ministryMember.delete({
                where: { id: record.id }
            })
        }
    } catch (error) {
        console.error('Error removiendo al miembro del ministerio:', error)
    }

    revalidatePath(`/dashboard/ministries/${ministryId}`)
}
