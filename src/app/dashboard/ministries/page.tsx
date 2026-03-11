import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { deleteMinistry } from './actions'
import {
    Users,
    Plus,
    Search,
    Settings,
    User,
    ChevronRight,
    Trash2,
    Edit2,
    Layers,
    BookOpen,
    ArrowUpRight,
    Sparkles,
    MoreHorizontal
} from 'lucide-react'

function DeleteButton({ id }: { id: string }) {
    return (
        <form action={async () => {
            'use server'
            await deleteMinistry(id)
        }}>
            <button
                type="submit"
                className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                title="Eliminar ministerio"
            >
                <Trash2 size={16} />
                <span className="md:hidden lg:inline">Eliminar</span>
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

    // @ts-ignore
    const ministries = await prisma.ministry.findMany({
        where: { church_id: userChurch.church_id },
        include: {
            // @ts-ignore
            departments: true,
        },
        orderBy: { name: 'asc' }
    }) as any[]

    const rootMinistries = ministries.filter(m => m.parent_id === null)

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2 flex items-center gap-3">
                        <Users className="text-indigo-600 w-8 h-8" />
                        Ministerios y <span className="text-indigo-600">Grupos</span>
                    </h1>
                    <p className="text-slate-500 text-lg font-light">Estructura y lidera el trabajo de los diferentes equipos de tu comunidad.</p>
                </div>

                <Link
                    href="/dashboard/ministries/new"
                    className="group bg-indigo-600 hover:bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-200 hover:-translate-y-1 active:scale-95 flex items-center gap-3"
                >
                    <Plus size={20} className="transition-transform group-hover:rotate-90" />
                    Nuevo Ministerio
                </Link>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Ministerios Base', count: rootMinistries.length, icon: Layers, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Sub-departamentos', count: ministries.length - rootMinistries.length, icon: Sparkles, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Líderes Activos', count: ministries.filter(m => m.leader_name).length, icon: User, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Total Áreas', count: ministries.length, icon: BookOpen, color: 'text-pink-600', bg: 'bg-pink-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group">
                        <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                            <stat.icon size={22} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                            <p className="text-2xl font-black text-slate-900 leading-none">{stat.count}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                {/* Search Bar */}
                <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
                    <div className="relative w-full sm:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar ministerios..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all"
                        />
                    </div>
                </div>

                {rootMinistries.length === 0 ? (
                    <div className="p-24 text-center">
                        <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                            <Users size={48} strokeWidth={1} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-4">No hay ministerios registrados</h3>
                        <p className="text-slate-500 max-w-sm mx-auto text-lg font-light leading-relaxed mb-8">
                            Comienza a organizar tu estructura eclesiástica creando los departamentos principales.
                        </p>
                        <Link
                            href="/dashboard/ministries/new"
                            className="group inline-flex items-center gap-3 bg-indigo-600 hover:bg-slate-900 text-white px-8 py-4 rounded-full font-bold transition-all shadow-xl shadow-indigo-200"
                        >
                            <Plus size={18} /> Crear Mi Primer Ministerio
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {rootMinistries.map((ministry) => (
                            <div key={ministry.id} className="p-10 group hover:bg-slate-50/30 transition-all duration-500">
                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-8">
                                    <div className="flex gap-6 items-start">
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-sm border border-indigo-100">
                                            <Users size={28} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{ministry.name}</h3>
                                                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest">Base</span>
                                            </div>
                                            <p className="text-lg text-slate-500 font-light max-w-2xl leading-relaxed">
                                                {ministry.description || 'Sin descripción asignada para este ministerio.'}
                                            </p>

                                            <div className="flex flex-wrap gap-3 mt-6">
                                                {ministry.leader_name && (
                                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-xl text-[11px] font-bold text-slate-600 shadow-sm">
                                                        <User size={12} className="text-indigo-400" />
                                                        Líder: <span className="text-slate-900">{ministry.leader_name}</span>
                                                    </div>
                                                )}
                                                {ministry.coleader_name && (
                                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-xl text-[11px] font-bold text-slate-600 shadow-sm">
                                                        <User size={12} className="text-emerald-400" />
                                                        Co-líder: <span className="text-slate-900">{ministry.coleader_name}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto shrink-0">
                                        <Link
                                            href={`/dashboard/ministries/${ministry.id}`}
                                            className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-6 py-3 rounded-2xl font-bold transition-all shadow-sm"
                                        >
                                            <Plus size={16} /> Gestionar Miembros
                                        </Link>
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/dashboard/ministries/${ministry.id}/edit`}
                                                className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"
                                                title="Editar"
                                            >
                                                <Edit2 size={20} />
                                            </Link>
                                            <DeleteButton id={ministry.id} />
                                        </div>
                                    </div>
                                </div>

                                {ministry.departments && ministry.departments.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-50">
                                        <div className="col-span-1 md:col-span-2 lg:col-span-3 mb-2">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <Layers size={14} /> Sub-departamentos
                                            </h4>
                                        </div>
                                        {ministry.departments.map((dept: any) => (
                                            <div key={dept.id} className="group/dept flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-50 hover:bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover/dept:text-indigo-500 transition-colors shadow-sm">
                                                        <Sparkles size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800 tracking-tight">{dept.name}</p>
                                                        {(dept.leader_name) && (
                                                            <p className="text-[10px] text-slate-400 font-medium">Liderado por {dept.leader_name}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <Link
                                                    href={`/dashboard/ministries/${dept.id}`}
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                                                >
                                                    <ChevronRight size={20} />
                                                </Link>
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
