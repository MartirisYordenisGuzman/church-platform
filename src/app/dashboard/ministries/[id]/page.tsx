import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { removeMemberFromMinistry } from './actions'
import { AddMemberForm } from './components/AddMemberForm'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
    ChevronLeft,
    Users,
    Calendar,
    Layers,
    Shield,
    Briefcase,
    Wallet,
    Layout,
    Trash2,
    Info,
    Sparkles
} from 'lucide-react'

function RemoveButton({ ministryMemberId, ministryId }: { ministryMemberId: string, ministryId: string }) {
    return (
        <form action={async () => {
            'use server'
            await removeMemberFromMinistry(ministryMemberId, ministryId)
        }}>
            <button
                type="submit"
                className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:text-red-600 hover:border-red-100 hover:shadow-lg hover:shadow-red-500/10 transition-all group"
                title="Quitar del ministerio"
            >
                <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
            </button>
        </form>
    )
}

function RoleBadge({ role }: { role: string }) {
    switch (role) {
        case 'LEADER':
            return (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-100 shadow-sm animate-in fade-in zoom-in-95 duration-500">
                    <Shield size={12} className="fill-amber-700/10" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Líder Principal</span>
                </div>
            )
        case 'COLEADER':
            return (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100 shadow-sm">
                    <Users size={12} className="fill-blue-700/10" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Co-líder</span>
                </div>
            )
        case 'SECRETARY':
            return (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-100 shadow-sm">
                    <Layout size={12} className="fill-purple-700/10" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Secretaría</span>
                </div>
            )
        case 'TREASURER':
            return (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 shadow-sm">
                    <Wallet size={12} className="fill-emerald-700/10" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Tesorería</span>
                </div>
            )
        default:
            return (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-500 rounded-full border border-slate-100 shadow-sm">
                    <Briefcase size={12} className="fill-slate-500/10" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Integrante</span>
                </div>
            )
    }
}

export default async function MinistryDetailsPage({ params }: { params: { id: string } }) {
    const resolvedParams = await Promise.resolve(params)
    const ministryId = resolvedParams.id

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const userChurch = await prisma.userChurch.findFirst({
        where: { userId: user.id }
    })

    if (!userChurch) redirect('/dashboard')

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

    const m = ministry as any

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            {/* Header / Navigation */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                    <Link
                        href="/dashboard/ministries"
                        className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all group"
                    >
                        <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{m.name}</h1>
                            {m.parent && (
                                <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100 flex items-center gap-2">
                                    <Layers size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Sub-departamento</span>
                                </div>
                            )}
                        </div>
                        <p className="text-slate-500 text-lg font-light">Gestión interna de colaboradores y funciones.</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard/ministries"
                        className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-slate-400 font-bold hover:text-indigo-600 transition-all flex items-center gap-2 shadow-sm"
                    >
                        <Layout size={18} />
                        <span>Ver Todos</span>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column: Info & Action */}
                <div className="lg:col-span-4 space-y-8">
                    {/* About Card */}
                    <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 text-indigo-50/50 group-hover:text-indigo-100/50 transition-colors">
                            <Info size={120} strokeWidth={4} />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                                    <Sparkles size={16} />
                                </div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ficha Técnica</h3>
                            </div>

                            <p className="text-slate-700 text-sm mb-4">
                                {m.description || "Este ministerio aún no cuenta con una descripción detallada de su misión."}
                            </p>

                            <div className="space-y-4 pt-8 border-t border-slate-50">
                                <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-indigo-500 shadow-sm">
                                            <Users size={16} />
                                        </div>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fuerza Laboral</span>
                                    </div>
                                    <span className="text-xl font-black text-indigo-600">{m.members.length}</span>
                                </div>

                                <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-amber-500 shadow-sm">
                                            <Calendar size={16} />
                                        </div>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Antigüedad</span>
                                    </div>
                                    <span className="text-sm font-black text-slate-700">{format(new Date(m.created_at), "MMM yyyy", { locale: es })}</span>
                                </div>

                                {m.parent && (
                                    <div className="flex justify-between items-center bg-indigo-50/40 p-4 rounded-2xl border border-indigo-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                                                <Layers size={16} />
                                            </div>
                                            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Bajo el mando</span>
                                        </div>
                                        <span className="text-xs font-black text-indigo-600">{m.parent.name}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <AddMemberForm ministryId={m.id} />
                </div>

                {/* Right Column: Member List */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden min-h-[600px] flex flex-col">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 leading-none mb-1">Cuerpo de Colaboradores</h2>
                                    <p className="text-sm text-slate-400 font-medium">{m.members.length} integrantes activos</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1">
                            {m.members.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center p-12 text-center text-slate-300">
                                    <div className="w-24 h-24 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-6">
                                        <Users size={48} strokeWidth={1} />
                                    </div>
                                    <p className="text-xl font-black text-slate-400 mb-2">Grupo sin integrantes</p>
                                    <p className="text-sm font-medium text-slate-300 max-w-[280px]">Utiliza el panel lateral para asignar personas del directorio a este ministerio.</p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-slate-100">
                                    {m.members.map((mm: any) => (
                                        <li key={mm.id} className="p-4 sm:px-10 hover:bg-slate-50 transition-colors flex items-center justify-between group/row">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-indigo-50 to-slate-100 border border-white flex items-center justify-center font-black text-indigo-600 text-lg shadow-sm">
                                                    {mm.member.first_name.charAt(0)}{mm.member.last_name.charAt(0)}
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-black text-slate-900 text-lg leading-none">
                                                        {mm.member.first_name} {mm.member.last_name}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                                        <RoleBadge role={mm.role} />
                                                        {mm.member.phone && <span>• {mm.member.phone}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <RemoveButton ministryMemberId={mm.id} ministryId={m.id} />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="p-8 bg-slate-50/50 border-t border-slate-50 text-center">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Fin del Listado</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
