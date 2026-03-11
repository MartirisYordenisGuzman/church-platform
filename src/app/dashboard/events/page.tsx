import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { deleteEvent } from './actions'
import { es } from 'date-fns/locale'
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Edit2,
    Trash2,
    Calendar,
    MapPin,
    Clock,
    Eye,
    EyeOff,
    Repeat,
    Users,
    Activity,
    Sparkles
} from 'lucide-react'

function DeleteButton({ id }: { id: string }) {
    return (
        <form action={async () => {
            'use server'
            await deleteEvent(id)
        }}>
            <button
                type="submit"
                className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                title="Eliminar evento"
            >
                <Trash2 size={16} />
                <span className="md:hidden lg:inline">Eliminar</span>
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

    if (!userChurch) redirect('/dashboard/settings')

    // @ts-ignore
    const events = await prisma.event.findMany({
        where: { church_id: userChurch.church_id },
        include: {
            // @ts-ignore
            ministry: true
        },
        orderBy: { start_date: 'asc' }
    }) as any[]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2 flex items-center gap-3">
                        <Calendar className="text-indigo-600 w-8 h-8" />
                        Gestión de <span className="text-indigo-600">Eventos</span>
                    </h1>
                    <p className="text-slate-500 text-lg font-light">Organiza el calendario y las actividades de tu congregación.</p>
                </div>

                <Link
                    href="/dashboard/events/new"
                    className="group bg-indigo-600 hover:bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-200 hover:-translate-y-1 active:scale-95 flex items-center gap-3"
                >
                    <Plus size={20} className="transition-transform group-hover:rotate-90" />
                    Crear Nuevo Evento
                </Link>
            </div>

            {/* Main Content Table/Grid */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                {/* Table Header / Filters Placeholder */}
                <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
                    <div className="relative w-full sm:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o ubicación..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-slate-500 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all">
                            <Filter size={18} />
                            Filtros
                        </button>
                    </div>
                </div>

                {events.length === 0 ? (
                    <div className="p-24 text-center">
                        <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                            <Calendar size={48} strokeWidth={1} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-4">No hay eventos activos</h3>
                        <p className="text-slate-500 max-w-sm mx-auto text-lg font-light leading-relaxed mb-8">
                            Empieza a dar vida a tu calendario añadiendo tu primer servicio o reunión especial.
                        </p>
                        <Link
                            href="/dashboard/events/new"
                            className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:underline"
                        >
                            <Plus size={18} /> Crear mi primer evento
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Información del Evento</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Fecha y Hora</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Localización</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Privacidad</th>
                                    <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {events.map((event: any) => (
                                    <tr key={event.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">{event.title}</span>
                                                    {event.recurrence && event.recurrence !== 'NONE' && (
                                                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-tighter">
                                                            <Repeat size={10} />
                                                            {event.recurrence === 'DAILY' ? 'Diario' :
                                                                event.recurrence === 'WEEKLY' ? 'Semanal' :
                                                                    event.recurrence === 'MONTHLY' ? 'Mensual' : 'Anual'}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {event.ministry && (
                                                        <span className="text-[10px] font-bold text-indigo-400 bg-indigo-50/50 px-2 py-0.5 rounded-md">
                                                            {event.ministry.name}
                                                        </span>
                                                    )}
                                                    <span className="text-xs text-slate-400 font-light truncate max-w-[200px]">{event.description || 'Sin descripción'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                                    <Calendar size={14} className="text-slate-400" />
                                                    <span className="capitalize">{event.start_date.toLocaleDateString(es.code, { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                                    <Clock size={14} />
                                                    {event.start_date.toLocaleTimeString(es.code, { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                                                <MapPin size={14} className="text-slate-400" />
                                                <span className="truncate max-w-[150px]">{event.location || 'Online / No definida'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {event.visibility === 'PRIVATE' ? (
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest border border-red-100">
                                                    <EyeOff size={12} /> Privado
                                                </div>
                                            ) : event.visibility === 'MINISTRY' ? (
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest border border-amber-100">
                                                    <Users size={12} /> Ministerio
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                                    <Eye size={12} /> Público
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/dashboard/events/${event.id}/edit`}
                                                    className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                                    title="Editar evento"
                                                >
                                                    <Edit2 size={16} />
                                                    <span className="md:hidden lg:inline">Editar</span>
                                                </Link>
                                                <DeleteButton id={event.id} />
                                                <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                                                    <MoreHorizontal size={20} />
                                                </button>
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
