import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { removeMemberFromMinistry } from './actions'
import { AddMemberForm } from './components/AddMemberForm'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

function RemoveButton({ ministryMemberId, ministryId }: { ministryMemberId: string, ministryId: string }) {
    return (
        <form action={async () => {
            'use server'
            await removeMemberFromMinistry(ministryMemberId, ministryId)
        }}>
            <button
                type="submit"
                className="text-red-600 hover:text-red-900 font-medium text-sm px-3 py-1 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                title="Quitar"
            >
                Remover
            </button>
        </form>
    )
}

function RoleBadge({ role }: { role: string }) {
    switch (role) {
        case 'LEADER':
            return <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">Líder Principal</span>
        case 'COLEADER':
            return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Co-líder / Ayudante</span>
        case 'SECRETARY':
            return <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">Secretario(a)</span>
        case 'TREASURER':
            return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Tesorero(a)</span>
        default:
            return <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">Miembro Regular</span>
    }
}

export default async function MinistryDetailsPage({ params }: { params: { id: string } }) {
    // Nota: Next 15+ espera que `params` sea objeto asincrono, pero aquí estamos en Next 14/15 con Turbopack configurado estándar.
    // Usamos await params para la compatibilidad Next 15 si falla
    const resolvedParams = await Promise.resolve(params)
    const ministryId = resolvedParams.id

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const userChurch = await prisma.userChurch.findFirst({
        where: { userId: user.id }
    })

    if (!userChurch) redirect('/dashboard')

    // Obtener detalles del ministerio con sus miembros
    const ministry = await prisma.ministry.findUnique({
        where: {
            id: ministryId,
            church_id: userChurch.church_id
        },
        include: {
            parent: true,
            members: {
                include: {
                    member: true
                },
                orderBy: {
                    joined_at: 'asc'
                }
            }
        }
    })

    if (!ministry) {
        notFound()
    }

    return (
        <div className="max-w-5xl">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/dashboard/ministries" className="text-slate-400 hover:text-slate-800 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{ministry.name}</h1>
                    <div className="flex items-center gap-2 mt-1">
                        {ministry.parent && (
                            <span className="text-sm bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full inline-block">
                                Dept. de {ministry.parent.name}
                            </span>
                        )}
                        <p className="text-slate-500">Gestión de integrantes y roles</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna Izquierda: Información y Formulario */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Acerca de</h3>
                        <p className="text-slate-700 text-sm mb-4">
                            {ministry.description || "No hay descripción para este grupo."}
                        </p>
                        <div className="space-y-3 pt-4 border-t border-slate-100">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Integrantes:</span>
                                <span className="font-medium text-slate-900">{ministry.members.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Creado en:</span>
                                <span className="font-medium text-slate-900">{format(new Date(ministry.created_at), "MMM yyyy", { locale: es })}</span>
                            </div>
                        </div>
                    </div>

                    <AddMemberForm ministryId={ministry.id} />
                </div>

                {/* Columna Derecha: Lista de Miembros */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
                            <h2 className="font-semibold text-slate-800">Personas en el Grupo ({ministry.members.length})</h2>
                        </div>

                        {ministry.members.length === 0 ? (
                            <div className="p-12 text-center text-slate-500">
                                <UsersIcon />
                                <p className="text-lg mb-2">Aún no hay personas asignadas.</p>
                                <p className="text-sm">Usa el formulario para añadir miembros desde el directorio a este ministerio.</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {ministry.members.map((mm) => (
                                    <li key={mm.id} className="p-4 sm:px-6 hover:bg-slate-50 transition-colors flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-blue-100 text-blue-700 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                                                {mm.member.first_name.charAt(0)}{mm.member.last_name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">
                                                    {mm.member.first_name} {mm.member.last_name}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                                                    <RoleBadge role={mm.role} />
                                                    {mm.member.phone && <span>• {mm.member.phone}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <RemoveButton ministryMemberId={mm.id} ministryId={ministry.id} />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function UsersIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-300 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
    )
}
