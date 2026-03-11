import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { deleteMember } from './actions'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
    Users,
    UserPlus,
    Search,
    Filter,
    Mail,
    Phone,
    Cake,
    MoreHorizontal,
    Trash2,
    Edit2,
    User,
    CalendarCheck,
    Plus
} from 'lucide-react'

function DeleteButton({ id }: { id: string }) {
    return (
        <form action={async () => {
            'use server'
            await deleteMember(id)
        }}>
            <button
                type="submit"
                className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                title="Eliminar registro"
            >
                <Trash2 size={16} />
                <span className="md:hidden lg:inline">Eliminar</span>
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

    // @ts-ignore
    const members = await prisma.member.findMany({
        where: { church_id: userChurch.church_id },
        orderBy: [{ last_name: 'asc' }, { first_name: 'asc' }]
    })

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2 flex items-center gap-3">
                        <Users className="text-indigo-600 w-8 h-8" />
                        Directorio de <span className="text-indigo-600">Miembros</span>
                    </h1>
                    <p className="text-slate-500 text-lg font-light">Gestiona la base de datos de tu congregación y mantén el contacto.</p>
                </div>

                <Link
                    href="/dashboard/directory/new"
                    className="group bg-indigo-600 hover:bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-200 hover:-translate-y-1 active:scale-95 flex items-center gap-3"
                >
                    <UserPlus size={20} className="transition-transform group-hover:scale-110" />
                    Añadir Persona
                </Link>
            </div>

            {/* Statistics Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center transition-transform group-hover:scale-110">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Miembros</p>
                        <p className="text-2xl font-black text-slate-900 leading-none">{members.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center transition-transform group-hover:scale-110">
                        <CalendarCheck size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Activos Hoy</p>
                        <p className="text-2xl font-black text-slate-900 leading-none">{members.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center transition-transform group-hover:scale-110">
                        <Cake size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Cumpleaños Mes</p>
                        <p className="text-2xl font-black text-slate-900 leading-none">
                            {members.filter((m: any) => m.birth_date && new Date(m.birth_date).getMonth() === new Date().getMonth()).length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                {/* Search & Filters */}
                <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
                    <div className="relative w-full sm:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, email o teléfono..."
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

                {members.length === 0 ? (
                    <div className="p-24 text-center">
                        <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                            <User size={48} strokeWidth={1} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-4">Tu directorio está vacío</h3>
                        <p className="text-slate-500 max-w-sm mx-auto text-lg font-light leading-relaxed mb-8">
                            Empieza a registrar a las personas de tu comunidad para organizar mejor el seguimiento y los ministerios.
                        </p>
                        <Link
                            href="/dashboard/directory/new"
                            className="group inline-flex items-center gap-3 bg-indigo-600 hover:bg-slate-900 text-white px-8 py-4 rounded-full font-bold transition-all shadow-xl shadow-indigo-200"
                        >
                            <Plus size={18} /> Registrar Primer Miembro
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Miembro</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Contacto</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Cumpleaños</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {members.map((member: any) => (
                                    <tr key={member.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg border border-indigo-100 group-hover:scale-110 transition-transform">
                                                    {member.first_name.charAt(0)}{member.last_name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                                                        {member.first_name} {member.last_name}
                                                    </span>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Miembro Base</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-2">
                                                {member.email && (
                                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                                        <Mail size={14} className="text-slate-300" />
                                                        {member.email}
                                                    </div>
                                                )}
                                                {member.phone && (
                                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                                        <Phone size={14} className="text-slate-300" />
                                                        {member.phone}
                                                    </div>
                                                )}
                                                {!member.email && !member.phone && (
                                                    <span className="text-xs text-slate-300 italic">Sin datos de contacto</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {member.birth_date ? (
                                                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                                    <Cake size={16} className="text-pink-400" />
                                                    <span className="capitalize">
                                                        {format(new Date(member.birth_date), "d 'de' MMMM", { locale: es })}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-300 italic text-xs">No registrado</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/dashboard/directory/${member.id}/edit`}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                                >
                                                    <Edit2 size={16} />
                                                    <span className="md:hidden lg:inline">Editar</span>
                                                </Link>
                                                <DeleteButton id={member.id} />
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
