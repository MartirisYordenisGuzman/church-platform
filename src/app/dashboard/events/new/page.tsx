'use client'

import { useActionState, useEffect, useState } from 'react'
import { createEvent } from '../actions'
import Link from 'next/link'

// Cargar ministerios para llenar el selector
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
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/dashboard/events" className="text-slate-400 hover:text-slate-800 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Programar Evento</h1>
                    <p className="text-slate-500">Agrega un nuevo servicio, ensayo o reunión especial.</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <form action={formAction} className="flex flex-col gap-6">

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="title">
                            Título del Evento <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            placeholder="Ej: Servicio de Acción de Gracias"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="image_url">
                            Imagen Destacada (URL Opcional)
                        </label>
                        <input
                            id="image_url"
                            name="image_url"
                            type="url"
                            placeholder="https://ejemplo.com/foto.jpg"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="start_date">
                                Inicia (Fecha y Hora) <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="start_date"
                                name="start_date"
                                type="datetime-local"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="end_date">
                                Termina (Fecha y Hora) <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="end_date"
                                name="end_date"
                                type="datetime-local"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="location">
                            Ubicación
                        </label>
                        <input
                            id="location"
                            name="location"
                            type="text"
                            placeholder="Ej: Auditorio Principal o Zoom"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="recurrence">
                                Repetición del Evento
                            </label>
                            <select
                                id="recurrence"
                                name="recurrence"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
                            >
                                <option value="NONE">No se repite (Un solo día)</option>
                                <option value="DAILY">Diariamente</option>
                                <option value="WEEKLY">Semanalmente</option>
                                <option value="MONTHLY">Mensualmente</option>
                                <option value="YEARLY">Anualmente</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="recurrence_end_date">
                                Repetir hasta (Opcional)
                            </label>
                            <input
                                id="recurrence_end_date"
                                name="recurrence_end_date"
                                type="date"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="visibility">
                            Visibilidad (Quién puede ver esto)
                        </label>
                        <select
                            id="visibility"
                            name="visibility"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
                        >
                            <option value="PUBLIC">Público (Visible en el portal web de la iglesia)</option>
                            <option value="PRIVATE">Privado (Solo miembros con sesión iniciada)</option>
                            <option value="MINISTRY">Solo Ministerio (Solo para un grupo específico)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="ministry_id">
                            Asignar a un Ministerio (Opcional)
                        </label>
                        <select
                            id="ministry_id"
                            name="ministry_id"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
                        >
                            <option value="">Ninguno (Evento General)</option>
                            {ministries.map(min => (
                                <option key={min.id} value={min.id}>{min.name}</option>
                            ))}
                        </select>
                        <p className="text-xs text-slate-500 mt-1">Si este evento es solo para un grupo en específico, selecciónalo aquí para que aparezca en su página.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="description">
                            Descripción Corta
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={3}
                            placeholder="Detalles sobre el evento..."
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50 resize-none"
                        ></textarea>
                    </div>

                    {state?.error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                            {state.error}
                        </div>
                    )}

                    <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                        <Link
                            href="/dashboard/events"
                            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                        >
                            {isPending ? 'Guardando...' : 'Guardar Evento'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
