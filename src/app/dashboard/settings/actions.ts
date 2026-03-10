'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function createChurch(prevState: any, formData: FormData) {
    const supabase = await createClient()

    // 1. Verificamos la sesión en Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        redirect('/login')
    }

    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    const description = formData.get('description') as string

    if (!name || !slug) {
        return { error: 'Nombre y URL corta (slug) son obligatorios.' }
    }

    // 2. Transacción de Prisma para asegurar que el Usuario exista en nuestra DB pública
    // y que podamos enlazarlo a la nueva Iglesia.
    try {
        await prisma.$transaction(async (tx) => {
            // 2a. Nos aseguramos de que el User exista en Prisma (espejo de Supabase)
            await tx.user.upsert({
                where: { id: user.id },
                update: { email: user.email }, // Actualizar email si cambió
                create: {
                    id: user.id, // Usamos el ID de Supabase para tener paridad 1:1
                    email: user.email!, // Forzamos ! porque sabemos que Supabase tiene el email
                    name: 'Administrador Inicial',
                    password_hash: '', // Clave manejada por Supabase
                },
            })

            // 2b. Creamos la iglesia (lanzará error si el Slug ya está en uso)
            const newChurch = await tx.church.create({
                data: {
                    name,
                    slug,
                    description,
                },
            })

            // 2c. Vinculamos al usuario como ADMIN de esa nueva iglesia
            await tx.userChurch.create({
                data: {
                    userId: user.id,
                    church_id: newChurch.id,
                    role: 'ADMIN', // Rol maestro definido en el schema Prisma
                },
            })
        })
    } catch (error: any) {
        console.error('Error creando iglesia:', error)
        // El error más común esperado aquí es de llave única (slug repetido)
        if (error.code === 'P2002') {
            return { error: 'Esa URL corta (slug) ya está siendo usada por otra iglesia.' }
        }
        return { error: 'Ocurrió un error inesperado al guardar tu iglesia.' }
    }

    // 3. Recargamos la interfaz para mostrar los nuevos datos y quitar la advertencia
    revalidatePath('/dashboard', 'layout')
    redirect('/dashboard') // Obligamos al refresco hacia el home del dashboard
}
