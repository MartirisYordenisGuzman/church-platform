'use client'

import { useActionState, useEffect, useState } from 'react'
import { createEvent } from '../actions'
import Link from 'next/link'
import {
    Calendar,
    Type,
    Image as ImageIcon,
    MapPin,
    Clock,
    Repeat,
    Eye,
    Users,
    AlignLeft,
    ChevronLeft,
    Plus,
    Rocket,
    AlertCircle,
    Sparkles,
    Upload
} from 'lucide-react'

function useMinistries() {
    const [ministries, setMinistries] = useState<{ id: string, name: string }[]>([])

    useEffect(() => {
        fetch('/api/ministries')
            .then(res => res.json())
            .then(data => setMinistries(data))
            .catch(err => console.error("Error fetching ministries:", err))
    }, [])

    return ministries
}

const initialState = { error: '' }

export default function NewEventPage() {
    const [state, formAction, isPending] = useActionState(createEvent, initialState)
    const ministries = useMinistries()

    return (
        <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                    <Link
                        href="/dashboard/events"
                        className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all group"
                    >
                        <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
                    </Link>
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-1">Programar <span className="text-indigo-600">Evento</span></h1>
                        <p className="text-slate-500 text-lg font-light">Crea una nueva actividad para el calendario de tu iglesia.</p>
                    </div>
                </div>
            </div>

            {/* Main Form Card */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 md:p-12">
                    <form action={formAction} className="space-y-10">

                        {/* Section: Basic Info */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                    <Sparkles size={16} />
                                </div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Información Básica</h3>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest" htmlFor="title">
                                    <Type size={14} className="text-indigo-500" />
                                    Título del Evento <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    placeholder="Ej: Servicio Especial de Adoración"
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest" htmlFor="image_url">
                                        <ImageIcon size={14} className="text-indigo-500" />
                                        Imagen (URL)
                                    </label>
                                    <input
                                        id="image_url"
                                        name="image_url"
                                        type="url"
                                        placeholder="https://..."
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-medium placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest" htmlFor="image_file">
                                        <Upload size={14} className="text-indigo-500" />
                                        O Subir Archivo
                                    </label>
                                    <div className="relative group/file">
                                        <input
                                            id="image_file"
                                            name="image_file"
                                            type="file"
                                            accept="image/*"
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all file:hidden cursor-pointer"
                                        />
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-500 font-bold text-xs flex items-center gap-2">
                                            <Plus size={14} /> Seleccionar
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Schedule */}
                        <div className="space-y-6 pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    <Clock size={16} />
                                </div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Horario y Lugar</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest" htmlFor="start_date">
                                        <Calendar size={14} className="text-emerald-500" />
                                        Inicia <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="start_date"
                                        name="start_date"
                                        type="datetime-local"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white transition-all"
                                        required
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest" htmlFor="end_date">
                                        <Clock size={14} className="text-emerald-500" />
                                        Termina <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="end_date"
                                        name="end_date"
                                        type="datetime-local"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest" htmlFor="location">
                                    <MapPin size={14} className="text-emerald-500" />
                                    Ubicación / Modalidad
                                </label>
                                <input
                                    id="location"
                                    name="location"
                                    type="text"
                                    placeholder="Ej: Auditorio Principal, Zoom, o Calle #123"
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-medium placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        {/* Section: Advanced Configuration */}
                        <div className="space-y-6 pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                    <Repeat size={16} />
                                </div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Configuración Avanzada</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest" htmlFor="recurrence">
                                        Frecuencia de Repetición
                                    </label>
                                    <select
                                        id="recurrence"
                                        name="recurrence"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 focus:bg-white transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="NONE">No se repite</option>
                                        <option value="DAILY">Diariamente</option>
                                        <option value="WEEKLY">Semanalmente</option>
                                        <option value="MONTHLY">Mensualmente</option>
                                        <option value="YEARLY">Anualmente</option>
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest" htmlFor="recurrence_end_date">
                                        Fecha Límite Repetición
                                    </label>
                                    <input
                                        id="recurrence_end_date"
                                        name="recurrence_end_date"
                                        type="date"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest" htmlFor="visibility">
                                        Visibilidad
                                    </label>
                                    <select
                                        id="visibility"
                                        name="visibility"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 focus:bg-white transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="PUBLIC">Público (Todo el mundo)</option>
                                        <option value="PRIVATE">Privado (Solo Miembros)</option>
                                        <option value="MINISTRY">Solo Ministerio</option>
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest" htmlFor="ministry_id">
                                        Vincular a Ministerio
                                    </label>
                                    <select
                                        id="ministry_id"
                                        name="ministry_id"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 focus:bg-white transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Ninguno (Evento General)</option>
                                        {ministries.map(min => (
                                            <option key={min.id} value={min.id}>{min.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest" htmlFor="description">
                                    <AlignLeft size={14} className="text-amber-500" />
                                    Detalles Adicionales
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    placeholder="Añade cualquier información extra que tus miembros deban saber..."
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-medium placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 focus:bg-white transition-all resize-none leading-relaxed"
                                ></textarea>
                            </div>
                        </div>

                        {state?.error && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-3">
                                <AlertCircle size={20} />
                                {state.error}
                            </div>
                        )}

                        {/* Footer / Buttons */}
                        <div className="pt-10 flex flex-col sm:flex-row justify-end gap-4 border-t border-slate-50">
                            <Link
                                href="/dashboard/events"
                                className="px-10 py-4 bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-2xl font-bold transition-all text-center"
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
                                        <span>Guardando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Rocket size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        <span>Programar Evento</span>
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
