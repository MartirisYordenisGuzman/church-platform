import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EditEventForm } from './components/EditEventForm'

export default async function EditEventPage({
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

    const event = await prisma.event.findUnique({
        where: { id, church_id: userChurch.church_id }
    })

    if (!event) {
        notFound()
    }

    // Pass the standard event payload to a Client Component
    // This allows interactivity (Action State, Ministry fetch, etc)
    return (
        <div className="max-w-2xl mx-auto">
            <EditEventForm event={event} />
        </div>
    )
}
