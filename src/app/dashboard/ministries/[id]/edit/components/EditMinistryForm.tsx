'use client'

import { useActionState, useEffect, useState } from 'react'
import { updateMinistry } from '../../../actions'
import Link from 'next/link'
import { Ministry } from '@prisma/client'
import {
    Users,
    Type,
    Layers,
    ChevronLeft,
    Save,
    Rocket,
    AlertCircle,
    Sparkles,
    User,
    UserPlus,
    AlignLeft
} from 'lucide-react'

// Cargar ministerios para llenar el selector de "Departamento de..."
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

// Cargar miembros del directorio para autocompletado nativo
function useMembers() {
    const [members, setMembers] = useState<{ id: string, first_name: string, last_name: string }[]>([])

    useEffect(() => {
        fetch('/api/directory')
            .then(res => res.json())
            .then(data => setMembers(data))
            .catch(err => console.error("Error fetching members:", err))
    }, [])

    return members
}

const initialState = { error: '' }

export function EditMinistryForm({ ministry: initialMinistry }: { ministry: any }) {
    const ministry = initialMinistry
    const [state, formAction, isPending] = useActionState(updateMinistry, initialState)
    const ministries = useMinistries()
    const members = useMembers()

    return (
        <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <datalist id="members-list">
                {members.map(member => (
                    <option key={member.id} value={`${member.first_name} ${member.last_name}`} />
                ))}
            </datalist>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                    <Link
                        href="/dashboard/ministries"
                        className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all group"
                    >
                        <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
                    </Link>
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-1">Editar <span className="text-indigo-600">Ministerio</span></h1>
                        <p className="text-slate-500 text-lg font-light">Actualizando: <span className="font-bold text-slate-700">{ministry.name}</span></p>
                    </div>
                </div>
            </div>

            {/* Main Form Card */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 md:p-12">
                    <form action={formAction} className="space-y-10">
                        <input type="hidden" name="id" value={ministry.id} />

                        {/* Section: Basic Identity */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                    <Sparkles size={16} />
                                </div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identidad del Grupo</h3>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest" htmlFor="name">
                                    <Type size={14} className="text-indigo-500" />
                                    Nombre del Ministerio <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    defaultValue={ministry.name}
                                    placeholder="Ej: Jóvenes, Ujieres, Alabanza"
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all caret-indigo-600"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest" htmlFor="parent_id">
                                    <Layers size={14} className="text-indigo-500" />
                                    Jerarquía
                                </label>
                                <select
                                    id="parent_id"
                                    name="parent_id"
                                    defaultValue={ministry.parent_id || ''}
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer"
                                >
                                    <option value="">Ninguno (Es un Ministerio Principal)</option>
                                    {ministries.map(min => (
                                        <option key={min.id} value={min.id} disabled={min.id === ministry.id}>{min.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Section: Leadership */}
                        <div className="space-y-6 pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    <UserPlus size={16} />
                                </div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Liderazgo y Responsables</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest" htmlFor="leader_name">
                                        <User size={14} className="text-emerald-500" />
                                        Líder Designado
                                    </label>
                                    <input
                                        id="leader_name"
                                        name="leader_name"
                                        type="text"
                                        defaultValue={ministry.leader_name || ''}
                                        list="members-list"
                                        placeholder="Busca en el directorio..."
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white transition-all caret-emerald-600"
                                        autoComplete="off"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest" htmlFor="coleader_name">
                                        <User size={14} className="text-emerald-500" />
                                        Asistente / Co-Líder
                                    </label>
                                    <input
                                        id="coleader_name"
                                        name="coleader_name"
                                        type="text"
                                        defaultValue={ministry.coleader_name || ''}
                                        list="members-list"
                                        placeholder="Busca en el directorio..."
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white transition-all caret-emerald-600"
                                        autoComplete="off"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Details */}
                        <div className="space-y-6 pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                    <AlignLeft size={16} />
                                </div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Misión y Propósito</h3>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest" htmlFor="description">
                                    Descripción del Ministerio
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    defaultValue={ministry.description || ''}
                                    placeholder="Describe la función principal de este grupo dentro de la iglesia..."
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-medium placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 focus:bg-white transition-all resize-none leading-relaxed caret-amber-600"
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
                                href="/dashboard/ministries"
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
                                        <span>Guardar Cambios</span>
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
