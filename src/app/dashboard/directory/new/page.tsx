'use client'

import { useActionState } from 'react'
import { createMember } from '../actions'
import Link from 'next/link'
import {
    Users,
    UserPlus,
    Type,
    Mail,
    Phone,
    Cake,
    ChevronLeft,
    User,
    Rocket,
    AlertCircle,
    CheckCircle2,
    Calendar,
    Sparkles
} from 'lucide-react'

const initialState = { error: '' }

export default function NewMemberPage() {
    const [state, formAction, isPending] = useActionState(createMember, initialState)

    return (
        <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                    <Link
                        href="/dashboard/directory"
                        className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all group"
                    >
                        <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
                    </Link>
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-1">Registrar <span className="text-indigo-600">Persona</span></h1>
                        <p className="text-slate-500 text-lg font-light">Agrega un nuevo integrante al directorio de tu congregación.</p>
                    </div>
                </div>
            </div>

            {/* Main Form Card */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 md:p-12">
                    <form action={formAction} className="space-y-10">

                        {/* Section: Personal Identity */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                    <Sparkles size={16} />
                                </div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identidad Personal</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest" htmlFor="first_name">
                                        <Type size={14} className="text-indigo-500" />
                                        Nombres <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="first_name"
                                        name="first_name"
                                        type="text"
                                        placeholder="Ej: Mateo"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all caret-indigo-600"
                                        required
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest" htmlFor="last_name">
                                        <Type size={14} className="text-indigo-500" />
                                        Apellidos <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="last_name"
                                        name="last_name"
                                        type="text"
                                        placeholder="Ej: García"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all caret-indigo-600"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Contact Details */}
                        <div className="space-y-6 pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    <Mail size={16} />
                                </div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Datos de Contacto</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest" htmlFor="email">
                                        <Mail size={14} className="text-emerald-500" />
                                        Correo Electrónico
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="correo@ejemplo.com"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white transition-all caret-emerald-600"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest" htmlFor="phone">
                                        <Phone size={14} className="text-emerald-500" />
                                        Teléfono / WhatsApp
                                    </label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="+1 809 000 0000"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white transition-all caret-emerald-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Dates */}
                        <div className="space-y-6 pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                    <Cake size={16} />
                                </div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fechas Importantes</h3>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest" htmlFor="birth_date">
                                    <Calendar size={14} className="text-amber-500" />
                                    Fecha de Nacimiento
                                </label>
                                <input
                                    id="birth_date"
                                    name="birth_date"
                                    type="date"
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 focus:bg-white transition-all caret-amber-600 cursor-pointer"
                                />
                                <p className="px-2 text-[10px] text-slate-400 font-medium italic">Esto nos ayudará a recordarte los cumpleaños en el dashboard.</p>
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
                                href="/dashboard/directory"
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
                                        <span>Registrando...</span>
                                    </>
                                ) : (
                                    <>
                                        <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
                                        <span>Registrar en Directorio</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Quick Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                <div className="p-8 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-50 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                        <CheckCircle2 size={18} />
                    </div>
                    <div>
                        <h4 className="font-black text-indigo-900 text-sm uppercase tracking-widest mb-1">Membresía Digital</h4>
                        <p className="text-indigo-700/70 text-xs leading-relaxed">
                            Al registrar a alguien, podrás asignarlo luego a ministerios y seguir su crecimiento.
                        </p>
                    </div>
                </div>
                <div className="p-8 bg-emerald-50/50 rounded-[2.5rem] border border-emerald-50 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                        <CheckCircle2 size={18} />
                    </div>
                    <div>
                        <h4 className="font-black text-emerald-900 text-sm uppercase tracking-widest mb-1">Privacidad Total</h4>
                        <p className="text-emerald-700/70 text-xs leading-relaxed">
                            Los datos de contacto son privados y solo accesibles por los administradores de la iglesia.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
