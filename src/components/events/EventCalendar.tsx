'use client'

import { useState } from 'react'
import { startOfMonth, endOfMonth, eachDayOfInterval, format, addMonths, subMonths, isSameMonth, isSameDay, addWeeks, subWeeks, startOfWeek, endOfWeek } from 'date-fns'
import { es } from 'date-fns/locale'

// Asumiremos que eventService o el servidor nos inyecta los eventos directamente
type CalendarEvent = {
    id: string
    title: string
    description: string | null
    start_date: Date
    end_date: Date
    location: string | null
    recurrence: string
    recurrence_end_date: Date | null
    image_url?: string | null
    ministry?: { id: string, name: string } | null
}

export default function EventCalendar({ initialEvents }: { initialEvents: CalendarEvent[] }) {
    const [viewMode, setViewMode] = useState<'month' | 'week'>('week')
    const [currentDate, setCurrentDate] = useState(new Date())

    const nextPeriod = () => {
        if (viewMode === 'month') setCurrentDate(addMonths(currentDate, 1))
        else setCurrentDate(addWeeks(currentDate, 1))
    }

    const prevPeriod = () => {
        if (viewMode === 'month') setCurrentDate(subMonths(currentDate, 1))
        else setCurrentDate(subWeeks(currentDate, 1))
    }

    // Aquí calcularíamos los eventos generados por recurrencia.
    // Para simplificar, calcularemos en caliente los eventos que caen dentro del intervalo visible.
    const getVisibleEvents = (start: Date, end: Date) => {
        const instances: (CalendarEvent & { instanceDate: Date })[] = []

        initialEvents.forEach(event => {
            const currentInstance = new Date(event.start_date)
            // Límite de la recurrencia o final del mes
            const recurStop = event.recurrence_end_date ? new Date(event.recurrence_end_date) : new Date(end.getFullYear() + 1, end.getMonth(), end.getDate());

            // Si el evento original comienza después del rango de fin, no cuenta
            if (currentInstance > end) return;

            if (event.recurrence === 'NONE') {
                if (currentInstance >= start && currentInstance <= end) {
                    instances.push({ ...event, instanceDate: new Date(currentInstance) })
                }
            } else {
                // Cálculo simple de recurrencia en cliente
                while (currentInstance <= end && currentInstance <= recurStop) {
                    if (currentInstance >= start && currentInstance <= end) {
                        instances.push({ ...event, instanceDate: new Date(currentInstance) })
                    }

                    // Aumentar la instancia según la recurrencia
                    if (event.recurrence === 'DAILY') {
                        currentInstance.setDate(currentInstance.getDate() + 1)
                    } else if (event.recurrence === 'WEEKLY') {
                        currentInstance.setDate(currentInstance.getDate() + 7)
                    } else if (event.recurrence === 'MONTHLY') {
                        currentInstance.setMonth(currentInstance.getMonth() + 1)
                    } else if (event.recurrence === 'YEARLY') {
                        currentInstance.setFullYear(currentInstance.getFullYear() + 1)
                    } else {
                        break; // Error fallback
                    }
                }
            }
        })

        return instances.sort((a, b) => a.instanceDate.getTime() - b.instanceDate.getTime())
    }

    const intervalStart = viewMode === 'month' ? startOfMonth(currentDate) : startOfWeek(currentDate, { weekStartsOn: 1 })
    const intervalEnd = viewMode === 'month' ? endOfMonth(currentDate) : endOfWeek(currentDate, { weekStartsOn: 1 })

    // Obtener "días" para la cuadrícula del calendario
    const displayStart = startOfWeek(intervalStart, { weekStartsOn: 1 })
    const displayEnd = endOfWeek(intervalEnd, { weekStartsOn: 1 })
    const daysInterval = eachDayOfInterval({ start: displayStart, end: displayEnd })

    const visibleEvents = getVisibleEvents(displayStart, displayEnd)

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={prevPeriod} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    <h2 className="text-xl font-bold text-slate-800 w-48 text-center capitalize">
                        {format(currentDate, viewMode === 'month' ? 'MMMM yyyy' : "'Semana del' d 'de' MMMM", { locale: es })}
                    </h2>
                    <button onClick={nextPeriod} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                    <button
                        onClick={() => setCurrentDate(new Date())}
                        className="ml-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                        Hoy
                    </button>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button
                        onClick={() => setViewMode('week')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'week' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Semana
                    </button>
                    <button
                        onClick={() => setViewMode('month')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'month' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Mes
                    </button>
                </div>
            </div>

            {/* Nueva sección: Tarjetas de Eventos (Ahora arriba) */}
            <div className="p-6 bg-slate-50 border-b border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-6">
                    Eventos de {viewMode === 'month' ? 'este mes' : 'esta semana'}
                </h3>

                {visibleEvents.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                        No hay eventos programados para este período.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {visibleEvents.map((event, idx) => (
                            <div key={`${event.id}-${idx}`} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
                                {event.image_url ? (
                                    <div className="h-48 w-full relative">
                                        <img
                                            src={event.image_url}
                                            alt={event.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <div className="text-sm font-semibold capitalize drop-shadow-md">
                                                {format(event.instanceDate, "EEEE d 'de' MMMM", { locale: es })}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-3 bg-blue-600 w-full"></div>
                                )}

                                <div className="p-6 flex flex-col flex-grow">
                                    {!event.image_url && (
                                        <div className="text-sm font-semibold text-blue-600 mb-2 capitalize">
                                            {format(event.instanceDate, "EEEE d 'de' MMMM", { locale: es })}
                                        </div>
                                    )}
                                    <div className="flex items-start gap-2 justify-between mb-2">
                                        <h3 className="text-xl font-bold text-slate-900 leading-tight">{event.title}</h3>
                                        {event.ministry && (
                                            <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full whitespace-nowrap">
                                                {event.ministry.name}
                                            </span>
                                        )}
                                    </div>
                                    {event.description && (
                                        <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                                            {event.description}
                                        </p>
                                    )}
                                    <div className="space-y-2 mt-4 text-sm text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                            {format(event.instanceDate, 'HH:mm')} hrs
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                            {event.location || 'Por definir'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-6">
                <div className="grid grid-cols-7 mb-2">
                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                        <div key={day} className="text-center font-semibold text-sm text-slate-500 py-2">
                            {day}
                        </div>
                    ))}
                </div>

                <div className={`grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-xl overflow-hidden ${viewMode === 'month' ? 'auto-rows-[120px]' : 'auto-rows-[250px]'}`}>
                    {daysInterval.map((day, dayIdx) => {
                        const dayEvents = visibleEvents.filter(e => isSameDay(e.instanceDate, day))
                        const isCurrentMonth = isSameMonth(day, currentDate)
                        const isToday = isSameDay(day, new Date())

                        return (
                            <div key={day.toISOString()} className={`bg-white p-2 transition-colors ${!isCurrentMonth && viewMode === 'month' ? 'bg-slate-50/50' : ''}`}>
                                <div className={`text-right text-sm font-medium mb-1 ${isToday ? 'bg-blue-600 text-white w-7 h-7 flex items-center justify-center rounded-full ml-auto' : !isCurrentMonth ? 'text-slate-400' : 'text-slate-700'}`}>
                                    {format(day, 'd')}
                                </div>
                                <div className="space-y-1 overflow-y-auto max-h-full pb-6 custom-scrollbar">
                                    {dayEvents.map((evt, evtIdx) => (
                                        <div key={`${evt.id}-${evtIdx}`} className="bg-blue-50 border border-blue-100 px-2 py-1 rounded text-xs select-none hover:bg-blue-100 transition-colors cursor-pointer group relative">
                                            <div className="font-semibold text-blue-700 truncate">{format(evt.instanceDate, 'HH:mm')} - {evt.title}</div>

                                            {/* Tooltip flotante simple */}
                                            <div className="hidden group-hover:block absolute z-10 bg-slate-900 text-white p-3 rounded-lg shadow-xl w-48 w-max bottom-full left-1/2 transform -translate-x-1/2 mb-2">
                                                <div className="font-bold text-sm mb-1">{evt.title}</div>
                                                <div className="text-xs text-slate-300 mb-2">{format(evt.instanceDate, "EEEE d 'de' MMMM, HH:mm", { locale: es })}</div>
                                                {evt.location && <div className="text-xs text-slate-400 mb-1 flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>{evt.location}</div>}
                                                {evt.description && <div className="text-xs text-slate-400 mt-2 line-clamp-3">{evt.description}</div>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
