import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EditSermonForm } from './components/EditSermonForm'

export default async function EditSermonPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const userChurch = await prisma.userChurch.findFirst({
        where: { userId: user.id }
    })

    if (!userChurch) redirect('/dashboard')

    const sermon = await prisma.sermon.findUnique({
        where: { id, church_id: userChurch.church_id }
    })

    if (!sermon) {
        notFound()
    }

    return (
        <div className="max-w-3xl mx-auto">
            <EditSermonForm sermon={sermon} />
        </div>
    )
}
