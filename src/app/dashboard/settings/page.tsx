'use client'

import { useActionState } from 'react'
import { createChurch } from './actions'
import Link from 'next/link'
import {
    Settings as SettingsIcon,
    Globe,
    Type,
    AlignLeft,
    Rocket,
    Sparkles,
    AlertCircle,
    ChevronRight,
    MapPin,
    Link as LinkIcon,
    ArrowUpRight
} from 'lucide-react'

const initialState = { error: '' }

export default function SettingsPage() {
    const [state, formAction, isPending] = useActionState(createChurch, initialState)

    return (
        <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="text-center">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-indigo-100">
                    <SettingsIcon size={36} />
                </div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Configuración de la <span className="text-indigo-600">Iglesia</span></h1>
                <p className="text-slate-500 text-lg font-light max-w-xl mx-auto">
                    Define la identidad digital de tu congregación y configura tu portal público en segundos.
                </p>
            </div>

            {/* Main Form Card */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 md:p-12">
                    <form action={formAction} className="space-y-8">

                        {/* Church Name */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-widest" htmlFor="name">
                                <Type size={14} className="text-indigo-500" />
                                Nombre Oficial
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Ej: Iglesia Cristiana Centro Vida"
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all caret-indigo-600"
                                required
                            />
                        </div>

                        {/* URL Slug */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-widest" htmlFor="slug">
                                <Globe size={14} className="text-indigo-500" />
                                Dirección del Portal (URL)
                            </label>
                            <div className="group relative flex items-center">
                                <div className="absolute left-6 text-slate-400 font-bold text-sm pointer-events-none group-focus-within:text-indigo-500 transition-colors">
                                    church-platform.com/
                                </div>
                                <input
                                    type="text"
                                    name="slug"
                                    id="slug"
                                    className="w-full pl-44 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all caret-indigo-600"
                                    placeholder="centro-vida"
                                    required
                                />
                                <div className="absolute right-4 hidden md:flex items-center gap-1 px-3 py-1 bg-white border border-slate-100 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
                                    <Sparkles size={10} className="text-amber-400" /> Auto-generado
                                </div>
                            </div>
                            <p className="px-2 text-[10px] text-slate-400 font-medium">Usa solo minúsculas, números y guiones. Ej: mi-iglesia-2024</p>
                        </div>

                        {/* Description */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-widest" htmlFor="description">
                                <AlignLeft size={14} className="text-indigo-500" />
                                Misión y Descripción
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                placeholder="Escribe un breve resumen sobre tu iglesia, su visión y lo que los define como comunidad..."
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-medium placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all caret-indigo-600 resize-none leading-relaxed"
                            ></textarea>
                        </div>

                        {state?.error && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-3 animate-pulse">
                                <AlertCircle size={20} />
                                {state.error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full relative group overflow-hidden bg-indigo-600 disabled:bg-slate-200 disabled:cursor-wait text-white py-5 rounded-[2rem] font-black text-lg transition-all shadow-xl shadow-indigo-200 active:scale-95 flex items-center justify-center gap-3"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                {isPending ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Procesando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Rocket size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        <span>Crear y Lanzar Portal</span>
                                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                            <p className="mt-6 text-center text-xs text-slate-400 font-medium">
                                Al hacer clic, tu portal estará disponible instantáneamente para todo el mundo.
                            </p>
                        </div>
                    </form>
                </div>

                {/* Footer Info Card */}
                <div className="bg-slate-50 p-8 border-t border-slate-100 flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div className="flex items-center gap-4 text-slate-400">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                            <Sparkles size={20} className="text-amber-400" />
                        </div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">¿Necesitas ayuda con el diseño?</p>
                    </div>
                    <Link href="/help" className="text-sm font-black text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1 group">
                        Ver Guía de Diseño <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Additional Tips Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-50">
                    <h4 className="font-black text-indigo-900 mb-2 flex items-center gap-2">
                        <MapPin size={18} /> Ubicación Física
                    </h4>
                    <p className="text-indigo-700/70 text-sm font-light leading-relaxed">
                        Próximamente podrás añadir la dirección física y el mapa interactivo para que nuevos miembros te encuentren fácilmente.
                    </p>
                </div>
                <div className="p-8 bg-emerald-50/50 rounded-[2.5rem] border border-emerald-50">
                    <h4 className="font-black text-emerald-900 mb-2 flex items-center gap-2">
                        <LinkIcon size={18} /> Redes Sociales
                    </h4>
                    <p className="text-emerald-700/70 text-sm font-light leading-relaxed">
                        Conecta tu Instagram, Facebook y canal de YouTube para centralizar toda tu presencia digital en un solo lugar.
                    </p>
                </div>
            </div>
        </div>
    )
}
