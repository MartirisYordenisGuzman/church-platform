import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { deleteMinistry } from './actions'

function DeleteButton({ id }: { id: string }) {
    return (
        <form action={async () => {
            'use server'
            await deleteMinistry(id)
        }}>
            <button
                type="submit"
                className="text-red-600 hover:text-red-900 font-medium"
            >
                Eliminar
            </button>
        </form>
    )
}

export default async function MinistriesDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const userChurch = await prisma.userChurch.findFirst({
        where: { userId: user.id }
    })

    if (!userChurch) redirect('/dashboard/settings')

    // Obtenemos todos los ministerios de esta iglesia, organizados por jerarquía
    const ministries = await prisma.ministry.findMany({
        where: { church_id: userChurch.church_id },
        include: {
            departments: true, // Incluye sub-departamentos
        },
        orderBy: { name: 'asc' }
    })

    // Filtramos para mostrar solo los ministerios raíz (sin parent_id)
    const rootMinistries = ministries.filter(m => m.parent_id === null)

    return (
        <div className="max-w-5xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Ministerios y Departamentos</h1>
                    <p className="text-slate-500">Organiza la estructura de grupos, líderes y voluntarios de tu iglesia.</p>
                </div>

                <Link
                    href="/dashboard/ministries/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Nuevo Ministerio
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {rootMinistries.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-300 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        <p className="text-lg mb-2">Aún no hay ministerios creados.</p>
                        <p className="text-sm">Agrega el primer ministerio base y luego podrás crear sub-departamentos dentro de él.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {rootMinistries.map((ministry) => (
                            <div key={ministry.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-4 items-start">
                                        <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 mt-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900">{ministry.name}</h3>
                                            <p className="text-sm text-slate-500 max-w-xl mt-1">{ministry.description || <span className="italic">No hay descripción</span>}</p>

                                            {/* Liderazgo Info */}
                                            {(ministry.leader_name || ministry.coleader_name) && (
                                                <div className="mt-3 flex gap-4 text-xs font-medium text-slate-600">
                                                    {ministry.leader_name && (
                                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-md">
                                                            Líder: {ministry.leader_name}
                                                        </div>
                                                    )}
                                                    {ministry.coleader_name && (
                                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-md">
                                                            Co-líder: {ministry.coleader_name}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Link href={`/dashboard/ministries/${ministry.id}`} className="text-blue-600 hover:text-blue-900 font-medium text-sm">
                                            Miembros
                                        </Link>
                                        <DeleteButton id={ministry.id} />
                                    </div>
                                </div>

                                {/* Renderizado de Sub-departamentos (solo 1 nivel de anidación por simplicidad visual) */}
                                {ministry.departments.length > 0 && (
                                    <div className="mt-4 ml-14 pl-4 border-l-2 border-slate-200 space-y-3">
                                        {ministry.departments.map(dept => (
                                            <div key={dept.id} className="bg-white border text-sm border-slate-200 rounded-lg p-3 flex justify-between items-center group hover:border-blue-300 transition-colors">
                                                <div>
                                                    <div className="font-semibold text-slate-800">{dept.name}</div>
                                                    {(dept.leader_name || dept.coleader_name) && (
                                                        <div className="text-xs text-slate-500 mt-0.5">
                                                            {[dept.leader_name, dept.coleader_name].filter(Boolean).join(' & ')}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-3">
                                                    <Link href={`/dashboard/ministries/${dept.id}`} className="text-blue-600 hover:text-blue-900 font-medium">
                                                        Abrir
                                                    </Link>
                                                    <DeleteButton id={dept.id} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
