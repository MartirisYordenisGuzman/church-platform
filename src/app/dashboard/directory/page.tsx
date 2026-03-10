import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { deleteMember } from './actions'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

function DeleteButton({ id }: { id: string }) {
    return (
        <form action={async () => {
            'use server'
            await deleteMember(id)
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

export default async function DirectoryDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const userChurch = await prisma.userChurch.findFirst({
        where: { userId: user.id }
    })

    if (!userChurch) redirect('/dashboard/settings')

    // Obtenemos todos los miembros
    const members = await prisma.member.findMany({
        where: { church_id: userChurch.church_id },
        orderBy: [{ last_name: 'asc' }, { first_name: 'asc' }]
    })

    return (
        <div className="max-w-5xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Directorio de Miembros</h1>
                    <p className="text-slate-500">Administra la base de datos de personas de tu congregación.</p>
                </div>

                <Link
                    href="/dashboard/directory/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                    Añadir Persona
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {members.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-300 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        <p className="text-lg mb-2">Aún no hay personas registradas.</p>
                        <p className="text-sm">Comienza agregando miembros para luego asignarlos a ministerios.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Nombre Completo</th>
                                    <th className="px-6 py-4 font-medium">Contacto</th>
                                    <th className="px-6 py-4 font-medium">Cumpleaños</th>
                                    <th className="px-6 py-4 font-medium text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {members.map((member) => (
                                    <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-slate-900">{member.first_name} {member.last_name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                {member.email ? <span className="flex gap-2 items-center"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>{member.email}</span> : null}
                                                {member.phone ? <span className="flex gap-2 items-center"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>{member.phone}</span> : null}
                                                {!member.email && !member.phone && <span className="text-slate-400 italic">Sin contacto</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {member.birth_date ? format(new Date(member.birth_date), "d 'de' MMMM", { locale: es }) : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <DeleteButton id={member.id} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
