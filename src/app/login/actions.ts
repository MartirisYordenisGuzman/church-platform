'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        console.error('Error en Login de Supabase:', error.message)
        // Redirige o manda error dependiendo de de tu manejo
        redirect('/login?message=No+se+pudo+iniciar+sesión')
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    // Se asume que en el Auth de Supabase no hay email confirmation obligatorio por ahora
    const { error } = await supabase.auth.signUp(data)

    if (error) {
        console.error('Error en Signup de Supabase:', error.message)
        redirect('/login?message=No+se+pudo+crear+la+cuenta')
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}
