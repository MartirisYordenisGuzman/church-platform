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

        const ministries = await prisma.ministry.findMany({
            where: {
                church_id: userChurch.church_id,
                parent_id: null // Solo retornamos ministerios principales para evitar más de 1 nivel de anidación profunda
            },
            select: {
                id: true,
                name: true
            },
            orderBy: { name: 'asc' }
        })

        return NextResponse.json(ministries)
    } catch (error) {
        console.error('Error in /api/ministries GET:', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
