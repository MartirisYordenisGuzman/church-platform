import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const userChurch = await prisma.userChurch.findFirst({
            where: { userId: user.id }
        })

        if (!userChurch) {
            return new NextResponse('Forbidden', { status: 403 })
        }

        const members = await prisma.member.findMany({
            where: { church_id: userChurch.church_id },
            select: {
                id: true,
                first_name: true,
                last_name: true
            },
            orderBy: [{ last_name: 'asc' }, { first_name: 'asc' }]
        })

        return NextResponse.json(members)
    } catch (error) {
        console.error('Error in /api/directory GET:', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
