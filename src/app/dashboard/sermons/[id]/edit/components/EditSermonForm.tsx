'use client'

import { useActionState } from 'react'
import { updateSermon } from '../../../actions'
import Link from 'next/link'
// import { Sermon } from '@prisma/client'
import {
    Youtube,
    Type,
    User,
    Calendar,
    Sparkles,
    ChevronLeft,
    MonitorPlay,
    AlertCircle,
    Save
} from 'lucide-react'

const initialState = { error: '' }

export function EditSermonForm({ sermon }: { sermon: any }) {
    const [state, formAction, isPending] = useActionState(updateSermon, initialState)

    // Format date for input
    const formattedDate = sermon.date ? new Date(sermon.date).toISOString().split('T')[0] : ''

    return (
        <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                    <Link
                        href="/dashboard/sermons"
                        className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all group"
                    >
                        <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
                    </Link>
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-1">Editar <span className="text-indigo-600">Prédica</span></h1>
                        <p className="text-slate-500 text-lg font-light">Actualizando: <span className="font-bold text-slate-700">{sermon.title}</span></p>
                    </div>
                </div>
            </div>

            {/* Main Form Card */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 md:p-12">
                    <form action={formAction} className="space-y-10">
                        <input type="hidden" name="id" value={sermon.id} />

                        {/* Section: YouTube Integration */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                                    <Youtube size={16} />
                                </div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Integración con YouTube</h3>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest" htmlFor="youtube_url">
                                    Enlace del Video <span className="text-red-500">*</span>
                                </label>
                                <div className="group relative flex items-center">
                                    <div className="absolute left-6 text-red-500 pointer-events-none group-focus-within:scale-110 transition-transform">
                                        <Youtube size={20} />
                                    </div>
                                    <input
                                        id="youtube_url"
                                        name="youtube_url"
                                        type="url"
                                        defaultValue={`https://www.youtube.com/watch?v=${sermon.youtube_video_id}`}
                                        placeholder="Copia aquí el enlace: https://www.youtube.com/watch?v=..."
                                        className="w-full pl-16 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-red-500 focus:bg-white transition-all caret-red-600"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Message Content */}
                        <div className="space-y-6 pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                    <MonitorPlay size={16} />
                                </div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Información del Mensaje</h3>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest" htmlFor="title">
                                    <Type size={14} className="text-indigo-500" />
                                    Título de la Prédica <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    defaultValue={sermon.title}
                                    placeholder="Ej: El Poder de la Oración Perseverante"
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all caret-indigo-600"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest" htmlFor="preacher">
                                        <User size={14} className="text-indigo-500" />
                                        Predicador <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="preacher"
                                        name="preacher"
                                        type="text"
                                        defaultValue={sermon.preacher}
                                        placeholder="Ej: Pastor David Wilkerson"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all caret-indigo-600"
                                        required
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest" htmlFor="date">
                                        <Calendar size={14} className="text-indigo-500" />
                                        Fecha de Emisión <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="date"
                                        name="date"
                                        type="date"
                                        defaultValue={formattedDate}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all caret-indigo-600"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest" htmlFor="series">
                                    <Sparkles size={14} className="text-amber-500" />
                                    Serie de Enseñanzas (Opcional)
                                </label>
                                <input
                                    id="series"
                                    name="series"
                                    type="text"
                                    defaultValue={sermon.series || ''}
                                    placeholder="Ej: Fundamentos de la Fe Cristiana"
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 focus:bg-white transition-all caret-amber-600"
                                />
                            </div>
                        </div>

                        {state?.error && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-3 animate-pulse">
                                <AlertCircle size={20} />
                                {state.error}
                            </div>
                        )}

                        {/* Footer / Buttons */}
                        <div className="pt-10 flex flex-col sm:flex-row justify-end gap-4 border-t border-slate-50">
                            <Link
                                href="/dashboard/sermons"
                                className="px-10 py-4 bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-2xl font-bold transition-all text-center focus:outline-none focus:ring-4 focus:ring-slate-100"
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="group px-10 py-4 bg-indigo-600 hover:bg-slate-900 disabled:bg-slate-200 text-white rounded-2xl font-black transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 active:scale-95"
                            >
                                {isPending ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Actualizando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} className="group-hover:scale-110 transition-transform" />
                                        <span>Actualizar Prédica</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
