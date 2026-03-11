import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EditMemberForm } from './components/EditMemberForm'

export default async function EditMemberPage({
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

    const member = await prisma.member.findUnique({
        where: { id, church_id: userChurch.church_id }
    })

    if (!member) {
        notFound()
    }

    return (
        <div className="max-w-3xl mx-auto">
            <EditMemberForm member={member} />
        </div>
    )
}
