'use client'

import { useState } from 'react'
import { startOfMonth, endOfMonth, eachDayOfInterval, format, addMonths, subMonths, isSameMonth, isSameDay, addWeeks, subWeeks, startOfWeek, endOfWeek } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, LayoutGrid, List } from 'lucide-react'

type CalendarEvent = {
    id: string
    title: string
    description: string | null
    start_date: Date
    end_date: Date
    location: string | null
    recurrence?: string
    recurrence_end_date?: Date | null
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

    const getVisibleEvents = (start: Date, end: Date) => {
        const instances: (CalendarEvent & { instanceDate: Date })[] = []

        initialEvents.forEach(event => {
            const currentInstance = new Date(event.start_date)
            const recurStop = event.recurrence_end_date ? new Date(event.recurrence_end_date) : new Date(end.getFullYear() + 1, end.getMonth(), end.getDate());

            if (currentInstance > end) return;

            if (!event.recurrence || event.recurrence === 'NONE') {
                if (currentInstance >= start && currentInstance <= end) {
                    instances.push({ ...event, instanceDate: new Date(currentInstance) })
                }
            } else {
                while (currentInstance <= end && currentInstance <= recurStop) {
                    if (currentInstance >= start && currentInstance <= end) {
                        instances.push({ ...event, instanceDate: new Date(currentInstance) })
                    }

                    if (event.recurrence === 'DAILY') {
                        currentInstance.setDate(currentInstance.getDate() + 1)
                    } else if (event.recurrence === 'WEEKLY') {
                        currentInstance.setDate(currentInstance.getDate() + 7)
                    } else if (event.recurrence === 'MONTHLY') {
                        currentInstance.setMonth(currentInstance.getMonth() + 1)
                    } else if (event.recurrence === 'YEARLY') {
                        currentInstance.setFullYear(currentInstance.getFullYear() + 1)
                    } else {
                        break;
                    }
                }
            }
        })

        return instances.sort((a, b) => a.instanceDate.getTime() - b.instanceDate.getTime())
    }

    const intervalStart = viewMode === 'month' ? startOfMonth(currentDate) : startOfWeek(currentDate, { weekStartsOn: 1 })
    const intervalEnd = viewMode === 'month' ? endOfMonth(currentDate) : endOfWeek(currentDate, { weekStartsOn: 1 })

    const displayStart = startOfWeek(intervalStart, { weekStartsOn: 1 })
    const displayEnd = endOfWeek(intervalEnd, { weekStartsOn: 1 })
    const daysInterval = eachDayOfInterval({ start: displayStart, end: displayEnd })

    const visibleEvents = getVisibleEvents(displayStart, displayEnd)

    return (
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
            {/* Calendar Controls */}
            <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 bg-white">
                <div className="flex items-center gap-2">
                    <button
                        onClick={prevPeriod}
                        className="p-2.5 hover:bg-slate-50 border border-slate-100 rounded-xl transition-all active:scale-95"
                    >
                        <ChevronLeft className="w-5 h-5 text-slate-600" />
                    </button>

                    <div className="px-6 py-2 min-w-[240px] text-center">
                        <h2 className="text-2xl font-bold text-slate-900 capitalize tracking-tight">
                            {format(currentDate, viewMode === 'month' ? 'MMMM yyyy' : "'Semana del' d 'de' MMMM", { locale: es })}
                        </h2>
                    </div>

                    <button
                        onClick={nextPeriod}
                        className="p-2.5 hover:bg-slate-50 border border-slate-100 rounded-xl transition-all active:scale-95"
                    >
                        <ChevronRight className="w-5 h-5 text-slate-600" />
                    </button>

                    <button
                        onClick={() => setCurrentDate(new Date())}
                        className="ml-4 px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                    >
                        Hoy
                    </button>
                </div>

                <div className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50">
                    <button
                        onClick={() => setViewMode('week')}
                        className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'week' ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                        Semana
                    </button>
                    <button
                        onClick={() => setViewMode('month')}
                        className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'month' ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <CalendarIcon className="w-4 h-4" />
                        Mes
                    </button>
                </div>
            </div>

            {/* Featured Events List (Sliding cards) */}
            <div className="p-10 bg-slate-50/50 border-b border-slate-100">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
                        Eventos {viewMode === 'month' ? 'del mes' : 'de la semana'}
                    </h3>
                </div>

                {visibleEvents.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
                        <p className="text-slate-400 font-medium">No hay eventos programados para este período.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {visibleEvents.map((event, idx) => (
                            <div key={`${event.id}-${idx}`} className="group bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 flex flex-col h-full transform hover:-translate-y-1">
                                <div className="h-56 w-full relative overflow-hidden">
                                    {event.image_url ? (
                                        <img
                                            src={event.image_url}
                                            alt={event.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                            <CalendarIcon className="w-12 h-12 text-white/30" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>

                                    <div className="absolute top-4 left-4">
                                        <div className="px-3 py-1.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest">
                                            {event.ministry?.name || 'Evento General'}
                                        </div>
                                    </div>

                                    <div className="absolute bottom-5 left-6 text-white">
                                        <div className="text-sm font-bold capitalize tracking-tight flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-indigo-400" />
                                            {format(event.instanceDate, "EEEE d 'de' MMMM", { locale: es })}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-grow">
                                    <h3 className="text-2xl font-bold text-slate-900 leading-tight mb-3 group-hover:text-indigo-600 transition-colors">
                                        {event.title}
                                    </h3>

                                    {event.description && (
                                        <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed font-light">
                                            {event.description}
                                        </p>
                                    )}

                                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                                            <MapPin className="w-4 h-4" />
                                            <span className="truncate max-w-[150px]">{event.location || 'Por definir'}</span>
                                        </div>
                                        <div className="text-indigo-600 font-bold text-sm">
                                            {format(event.instanceDate, 'HH:mm')} hrs
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Calendar Grid */}
            <div className="p-8 md:p-12">
                <div className="grid grid-cols-7 mb-4">
                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                        <div key={day} className="text-center font-bold text-xs text-slate-400 uppercase tracking-widest py-2">
                            {day}
                        </div>
                    ))}
                </div>

                <div className={`grid grid-cols-7 gap-3 ${viewMode === 'month' ? 'auto-rows-[110px]' : 'auto-rows-[220px]'}`}>
                    {daysInterval.map((day, dayIdx) => {
                        const dayEvents = visibleEvents.filter(e => isSameDay(e.instanceDate, day))
                        const isCurrentMonth = isSameMonth(day, currentDate)
                        const isToday = isSameDay(day, new Date())

                        return (
                            <div
                                key={day.toISOString()}
                                className={`group relative rounded-2xl border transition-all duration-300 p-2 flex flex-col ${isToday
                                        ? 'bg-indigo-50/30 border-indigo-100 ring-2 ring-indigo-500/20'
                                        : !isCurrentMonth && viewMode === 'month'
                                            ? 'bg-slate-50/50 border-slate-50 text-slate-300 opacity-40'
                                            : 'bg-white border-slate-100 hover:border-indigo-100 hover:bg-slate-50/30'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2 px-1">
                                    <span className={`text-sm font-bold ${isToday
                                            ? 'bg-indigo-600 text-white w-7 h-7 flex items-center justify-center rounded-lg shadow-lg shadow-indigo-200'
                                            : !isCurrentMonth && viewMode === 'month'
                                                ? 'text-slate-300'
                                                : 'text-slate-700'
                                        }`}>
                                        {format(day, 'd')}
                                    </span>
                                    {dayEvents.length > 0 && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 md:hidden"></div>
                                    )}
                                </div>

                                <div className="flex-grow space-y-1.5 overflow-y-auto custom-scrollbar pr-0.5">
                                    {dayEvents.map((evt, evtIdx) => (
                                        <div
                                            key={`${evt.id}-${evtIdx}`}
                                            className="group/item bg-white border border-slate-100 px-2.5 py-1.5 rounded-xl text-[10px] font-bold shadow-sm hover:border-indigo-100 hover:shadow-md hover:shadow-indigo-500/5 transition-all text-slate-700 hover:text-indigo-700 cursor-pointer"
                                        >
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-1 h-3 bg-indigo-500 rounded-full"></div>
                                                <span className="truncate">{evt.title}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {isToday && (
                                    <div className="absolute top-1 right-1">
                                        <div className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse"></div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </div>
    )
}
