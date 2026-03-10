import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { deleteEvent } from './actions'

function DeleteButton({ id }: { id: string }) {
    return (
        <form action={async () => {
            'use server'
            await deleteEvent(id)
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

export default async function EventsDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const userChurch = await prisma.userChurch.findFirst({
        where: { userId: user.id }
    })

    // Si aún no ha configurado su iglesia, lo mandamos a settings
    if (!userChurch) redirect('/dashboard/settings')

    // Obtenemos los eventos de la base de datos (ordenados por fecha de inicio)
    const events = await prisma.event.findMany({
        where: { church_id: userChurch.church_id },
        include: { ministry: true },
        orderBy: { start_date: 'asc' }
    })

    return (
        <div className="max-w-5xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Gestión de Eventos</h1>
                    <p className="text-slate-500">Administra el calendario de los próximos servicios y reuniones.</p>
                </div>

                <Link
                    href="/dashboard/events/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Crear Evento
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {events.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-300 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        <p className="text-lg">No tienes ningún evento programado.</p>
                        <p className="text-sm">Tus eventos aparecerán automáticamente también en el portal público.</p>
                    </div>
                ) : (
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-700 font-medium border-b border-slate-200">
                            <tr>
                                <th scope="col" className="px-6 py-4">Evento</th>
                                <th scope="col" className="px-6 py-4">Fecha de Inicio</th>
                                <th scope="col" className="px-6 py-4">Ubicación</th>
                                <th scope="col" className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => (
                                <tr key={event.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="font-semibold text-slate-900">{event.title}</div>
                                            {event.visibility === 'PRIVATE' && (
                                                <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">Privado</span>
                                            )}
                                            {event.visibility === 'MINISTRY' && (
                                                <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">Solo Ministerio</span>
                                            )}
                                            {event.recurrence !== 'NONE' && (
                                                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                                                    {event.recurrence === 'DAILY' ? 'Diario' :
                                                        event.recurrence === 'WEEKLY' ? 'Semanal' :
                                                            event.recurrence === 'MONTHLY' ? 'Mensual' : 'Anual'}
                                                </span>
                                            )}
                                            {event.ministry && (
                                                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium ml-1">
                                                    {event.ministry.name}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-slate-500 truncate max-w-xs">{event.description}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1">
                                            {event.start_date.toLocaleDateString()} a las {event.start_date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {event.location || <span className="text-slate-400 italic">No especificada</span>}
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-3">
                                        <DeleteButton id={event.id} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
