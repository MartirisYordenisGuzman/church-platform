import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { deleteSermon } from './actions'
import { es } from 'date-fns/locale'
import {
    Video,
    Upload,
    Search,
    Play,
    User,
    Youtube,
    Trash2,
    Edit2,
    ExternalLink,
    Sparkles,
    MonitorPlay,
    Plus
} from 'lucide-react'

function DeleteButton({ id }: { id: string }) {
    return (
        <form action={async () => {
            'use server'
            await deleteSermon(id)
        }}>
            <button
                type="submit"
                className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                title="Eliminar prédica"
            >
                <Trash2 size={16} />
                <span className="md:hidden lg:inline">Eliminar</span>
            </button>
        </form>
    )
}

export default async function SermonsDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const userChurch = await prisma.userChurch.findFirst({
        where: { userId: user.id }
    })

    if (!userChurch) redirect('/dashboard/settings')

    const sermons = await prisma.sermon.findMany({
        where: { church_id: userChurch.church_id },
        orderBy: { date: 'desc' }
    })

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2 flex items-center gap-3">
                        <MonitorPlay className="text-indigo-600 w-8 h-8" />
                        Videoteca de <span className="text-indigo-600">Prédicas</span>
                    </h1>
                    <p className="text-slate-500 text-lg font-light">Administra y organiza las enseñanzas y mensajes de tu iglesia.</p>
                </div>

                <Link
                    href="/dashboard/sermons/new"
                    className="group bg-indigo-600 hover:bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-200 hover:-translate-y-1 active:scale-95 flex items-center gap-3"
                >
                    <Upload size={20} className="transition-transform group-hover:scale-110" />
                    Subir Nueva Prédica
                </Link>
            </div>

            {/* Statistics Bar Placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Video size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Mensajes</p>
                        <p className="text-2xl font-black text-slate-900 leading-none">{sermons.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Más Reciente</p>
                        <p className="text-xs font-bold text-slate-900 leading-tight">
                            {sermons[0]?.title || 'Sin mensajes'}
                        </p>
                    </div>
                </div>
                <div className="bg-slate-900 p-6 rounded-3xl shadow-xl shadow-slate-200 flex items-center gap-4 text-white">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                        <Youtube size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-white/50 uppercase tracking-widest leading-none mb-1">Canal Sincronizado</p>
                        <p className="text-xs font-bold text-white leading-tight">Canal de la Iglesia</p>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                {/* Filters/Search */}
                <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
                    <div className="relative w-full sm:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar mensaje por título o predicador..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all"
                        />
                    </div>
                </div>

                {sermons.length === 0 ? (
                    <div className="p-24 text-center">
                        <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                            <Video size={48} strokeWidth={1} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-4">Aún no has subido prédicas</h3>
                        <p className="text-slate-500 max-w-sm mx-auto text-lg font-light leading-relaxed mb-8">
                            Digitaliza tus enseñanzas y permítele a tu comunidad revivirlas en cualquier momento.
                        </p>
                        <Link
                            href="/dashboard/sermons/new"
                            className="group inline-flex items-center gap-3 bg-indigo-600 hover:bg-slate-900 text-white px-8 py-4 rounded-full font-bold transition-all shadow-xl shadow-indigo-200"
                        >
                            <Plus size={18} /> Subir Mi Primera Prédica
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-10">
                        {sermons.map((sermon) => (
                            <div key={sermon.id} className="group flex flex-col bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 hover:-translate-y-2">
                                <div className="aspect-video relative overflow-hidden bg-slate-900">
                                    <img
                                        src={`https://img.youtube.com/vi/${sermon.youtube_video_id}/maxresdefault.jpg`}
                                        alt={sermon.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${sermon.youtube_video_id}/mqdefault.jpg`;
                                        }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-transform duration-500 border border-white/30">
                                            <Play size={32} className="fill-current" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center pointer-events-none">
                                        <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest border border-white/10">
                                            {sermon.date.toLocaleDateString(es.code, { day: 'numeric', month: 'short' })}
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg">
                                            <Youtube size={14} />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-grow">
                                    {sermon.series && (
                                        <div className="inline-flex items-center gap-1 text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-3">
                                            <Sparkles size={10} />
                                            Serie: {sermon.series}
                                        </div>
                                    )}
                                    <h3 className="text-xl font-bold text-slate-900 line-clamp-2 mb-6 group-hover:text-indigo-600 transition-colors leading-tight min-h-[3rem]">
                                        {sermon.title}
                                    </h3>

                                    <div className="mt-auto pt-6 border-t border-slate-50 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                                                <User size={18} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Predicador</span>
                                                <span className="text-sm font-bold text-slate-700">{sermon.preacher}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-1 pt-2">
                                            <a
                                                href={`https://youtube.com/watch?v=${sermon.youtube_video_id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-bold text-xs"
                                            >
                                                Ver en sitio <ExternalLink size={14} />
                                            </a>
                                            <div className="flex items-center gap-1">
                                                <Link
                                                    href={`/dashboard/sermons/${sermon.id}/edit`}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                                    title="Editar"
                                                >
                                                    <Edit2 size={16} />
                                                </Link>
                                                <DeleteButton id={sermon.id} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
