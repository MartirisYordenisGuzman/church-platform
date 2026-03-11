import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { logout } from "./actions"
import {
    LayoutDashboard,
    Calendar,
    Video,
    Users,
    Music,
    Settings,
    LogOut,
    Bell,
    Search,
    ChevronRight,
    Sparkles,
    Globe
} from "lucide-react"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    }

    const userEmail = data.user.email
    const userInitial = userEmail?.[0].toUpperCase() || 'U'

    const navLinks = [
        { href: '/dashboard', label: 'Resumen', icon: LayoutDashboard },
        { href: '/dashboard/events', label: 'Eventos', icon: Calendar },
        { href: '/dashboard/sermons', label: 'Prédicas', icon: Video },
        { href: '/dashboard/ministries', label: 'Ministerios', icon: Users },
        { href: '/dashboard/directory', label: 'Directorio', icon: Users },
        { href: '/dashboard/songs', label: 'Canciones', icon: Music },
        { href: '/dashboard/settings', label: 'Configuración', icon: Settings },
        { href: '/dashboard/settings/portal', label: 'Portal Web', icon: Globe },
    ]

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Sidebar Izquierdo - Estilo SaaS Premium */}
            <aside className="w-72 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 left-0 z-50">
                <div className="h-20 flex items-center px-8 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <span className="font-extrabold text-xl tracking-tight text-slate-900">Digital <span className="text-indigo-600">Church</span></span>
                    </div>
                </div>

                <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="mb-4 px-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Menú Principal</p>
                    </div>
                    <nav className="space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center justify-between group px-4 py-3 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-2xl transition-all duration-300"
                            >
                                <div className="flex items-center gap-3">
                                    <link.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                                    <span className="font-bold text-sm">{link.label}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-12 mb-4 px-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Soporte</p>
                    </div>
                    <Link href="/help" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-2xl transition-all">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600">?</div>
                        <span className="font-bold text-sm">Centro de Ayuda</span>
                    </Link>
                </div>

                <div className="p-6 border-t border-slate-50 bg-slate-50/30">
                    <div className="flex items-center gap-3 mb-6 px-2">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">
                            {userInitial}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-xs font-bold text-slate-900 truncate">Administrador</span>
                            <span className="text-[10px] text-slate-500 truncate">{userEmail}</span>
                        </div>
                    </div>
                    <form action={logout}>
                        <button className="group w-full py-3 px-4 flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-red-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-2xl transition-all duration-300 font-bold text-sm shadow-sm hover:shadow-red-500/5">
                            <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                            Cerrar Sesión
                        </button>
                    </form>
                </div>
            </aside>

            {/* Área del Contenido Principal */}
            <div className="flex-1 ml-72 min-h-screen flex flex-col">
                {/* Top Navbar */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-40">
                    <div className="flex items-center gap-4 text-sm font-bold text-slate-400">
                        <span className="hover:text-slate-600 cursor-pointer transition-colors">Digital Church</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-slate-900">Dashboard</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all relative">
                            <Bell size={20} />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-px bg-slate-200"></div>
                        <div className="relative group">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all cursor-pointer">
                                <Search size={18} className="text-slate-400" />
                                <span className="text-xs text-slate-400 font-medium">Buscar...</span>
                                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-slate-50 px-1.5 font-mono text-[10px] font-medium text-slate-400 opacity-100">
                                    <span className="text-xs">⌘</span>K
                                </kbd>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-10">
                    <div className="max-w-[1200px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>

        </div>
    )
}

