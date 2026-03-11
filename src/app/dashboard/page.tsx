import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
    LayoutDashboard,
    Calendar,
    Video,
    Users,
    ExternalLink,
    Plus,
    ArrowUpRight,
    Activity,
    Globe,
    Settings as SettingsIcon,
    ChevronRight,
    Sparkles
} from 'lucide-react'

export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    const userChurch = await prisma.userChurch.findFirst({
        where: { userId: user.id },
        include: { church: true }
    })

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Panel de <span className="text-indigo-600">Control</span></h1>
                <p className="text-slate-500 text-lg font-light max-w-2xl">
                    Bienvenido de nuevo. Aquí tienes un resumen del estado actual de tu plataforma digital y las herramientas para gestionarla.
                </p>
            </div>

            {/* Tarjetas Estadísticas Premium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'Próximos Eventos', value: '12', icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Prédicas Activas', value: '45', icon: Video, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Miembros Totales', value: '89', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                ].map((stat, i) => (
                    <div key={i} className="group bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 transition-all duration-500 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 relative overflow-hidden">
                        <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
                            <stat.icon size={80} strokeWidth={1} />
                        </div>
                        <div className="flex items-center justify-between mb-6">
                            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                                <stat.icon size={28} />
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-widest">
                                <ArrowUpRight size={12} />
                                +5%
                            </div>
                        </div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <div className="text-4xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{stat.value}</div>
                    </div>
                ))}
            </div>

            {!userChurch ? (
                <div className="relative group overflow-hidden p-1 rounded-[3rem] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl shadow-indigo-200">
                    <div className="bg-white rounded-[2.8rem] p-12 md:p-16 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
                        <div className="max-w-2xl mx-auto relative z-10">
                            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce">
                                <Sparkles className="w-10 h-10" />
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 tracking-tight">¡Tu Iglesia merece un Portal Premium!</h3>
                            <p className="text-slate-500 text-lg md:text-xl mb-12 font-light leading-relaxed">
                                Aún no has configurado tu iglesia principal. Da el primer paso para digitalizar tu comunidad y conectar con más personas.
                            </p>
                            <Link
                                href="/dashboard/settings"
                                className="inline-flex items-center gap-3 bg-indigo-600 hover:bg-slate-900 text-white px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl shadow-indigo-200 hover:-translate-y-1 active:scale-95"
                            >
                                <Plus className="w-6 h-6" />
                                Crear Mi Portal
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <Globe size={24} className="text-indigo-600" />
                            Portal Activo
                        </h3>
                        <Link href="/dashboard/settings" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors">
                            Gestionar<ChevronRight size={16} />
                        </Link>
                    </div>

                    <div className="group bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/5">
                        <div className="flex flex-col lg:flex-row gap-10 items-start lg:items-center">
                            <div className="w-24 h-24 rounded-[2rem] bg-slate-900 text-white flex items-center justify-center text-3xl font-black shadow-xl shadow-slate-200 shrink-0">
                                {userChurch.church.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h4 className="text-3xl font-black text-slate-900 tracking-tight">{userChurch.church.name}</h4>
                                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest">Online</span>
                                </div>
                                <p className="text-slate-500 text-lg font-light leading-relaxed max-w-2xl">
                                    {userChurch.church.description || 'Impulsando el crecimiento espiritual de nuestra comunidad a través de la tecnología y la fe.'}
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                                <a
                                    href={`/${userChurch.church.slug}`}
                                    target="_blank"
                                    className="flex items-center justify-center gap-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-sm"
                                >
                                    Ver Portal <ExternalLink size={18} />
                                </a>
                                <Link
                                    href="/dashboard/settings"
                                    className="flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-8 py-4 rounded-2xl font-bold transition-all"
                                >
                                    Ajustes <SettingsIcon size={18} />
                                </Link>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 pt-12 border-t border-slate-50">
                            <div className="flex items-center gap-4 p-6 rounded-[2rem] bg-slate-50/50 border border-slate-50 transition-transform hover:scale-[1.02]">
                                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-500">
                                    <Activity size={24} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visitas hoy</span>
                                    <span className="text-xl font-black text-slate-800">1,240</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-6 rounded-[2rem] bg-slate-100/30 border border-slate-50 transition-transform hover:scale-[1.02]">
                                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-500">
                                    <Plus size={24} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nuevos Miembros</span>
                                    <span className="text-xl font-black text-slate-800">+12</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

