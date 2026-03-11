'use client'

import { useState } from 'react'
import { updatePortalTheme, updateBlocksOrder, toggleBlockVisibility, addBlock, deleteBlock, updateBlockData } from './actions'
import {
    Layout,
    Globe,
    ArrowUp,
    ArrowDown,
    Eye,
    EyeOff,
    Palette,
    Save,
    LayoutTemplate,
    Plus,
    Trash2,
    Settings,
    X
} from 'lucide-react'

// Definimos un tipo para TypeScript
type BlockType = 'hero' | 'events' | 'sermons' | 'ministries' | 'custom_text';

export default function PortalSettingsClient({ initialConfig }: { initialConfig: any }) {
    const [themeColor, setThemeColor] = useState(initialConfig.theme?.primaryColor || '#4f46e5')
    const [layout, setLayout] = useState(initialConfig.layout || 'LANDING_PAGE')
    const [blocks, setBlocks] = useState(initialConfig.blocks || [])
    const [isSaving, setIsSaving] = useState(false)
    const [isAddingBlock, setIsAddingBlock] = useState(false)
    const [editingBlock, setEditingBlock] = useState<any | null>(null)

    const handleSaveTheme = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        const formData = new FormData()
        formData.append('primaryColor', themeColor)
        formData.append('layout', layout)

        await updatePortalTheme(null, formData)
        setIsSaving(false)
    }

    const handleMoveBlock = async (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return
        if (direction === 'down' && index === blocks.length - 1) return

        const newBlocks = [...blocks]
        const swapIndex = direction === 'up' ? index - 1 : index + 1

        // Swap arrays
        const temp = newBlocks[index]
        newBlocks[index] = newBlocks[swapIndex]
        newBlocks[swapIndex] = temp

        // Update order property to match new array index
        const mappedBlocks = newBlocks.map((b, i) => ({ ...b, order: i }))
        setBlocks(mappedBlocks)

        // Save layout changes instantly
        await updateBlocksOrder(mappedBlocks.map(b => ({ id: b.id, order: b.order })))
    }

    const handleToggleVisibility = async (index: number) => {
        const newBlocks = [...blocks]
        newBlocks[index].is_visible = !newBlocks[index].is_visible
        setBlocks(newBlocks)

        await toggleBlockVisibility(newBlocks[index].id, newBlocks[index].is_visible)
    }

    // Traducir tipos de bloques
    const getBlockName = (type: string) => {
        const names: Record<string, string> = {
            hero: 'Sección Principal (Hero)',
            events: 'Próximos Eventos',
            sermons: 'Últimas Prédicas',
            ministries: 'Ministerios',
            custom_text: 'Texto Personalizado'
        }
        return names[type] || type
    }

    const handleAddBlock = async (type: BlockType) => {
        setIsSaving(true)
        await addBlock(type)
        // Recargar la página para obtener los datos frescos del servidor (ya que server actions actualizan BD)
        window.location.reload()
    }

    const handleDeleteBlock = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta sección?')) return
        setIsSaving(true)
        await deleteBlock(id)
        window.location.reload()
    }

    const handleSaveBlockData = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingBlock) return
        setIsSaving(true)
        await updateBlockData(editingBlock.id, editingBlock.data)
        window.location.reload()
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="text-center">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-indigo-100">
                    <Globe size={36} />
                </div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Portal <span className="text-indigo-600">Público</span></h1>
                <p className="text-slate-500 text-lg font-light max-w-xl mx-auto">
                    Personaliza la apariencia y disposición de los elementos de la web de tu iglesia.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Theme & Layout Config */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 space-y-8 h-fit">
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800 border-b border-slate-100 pb-4">
                        <Palette size={24} className="text-indigo-500" />
                        Apariencia y Marca
                    </h2>

                    <form onSubmit={handleSaveTheme} className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-sm font-black text-slate-400 uppercase tracking-widest">
                                Color Principal
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="color"
                                    value={themeColor}
                                    onChange={(e) => setThemeColor(e.target.value)}
                                    className="w-14 h-14 p-1 rounded-2xl cursor-pointer bg-slate-50 border border-slate-200"
                                />
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={themeColor}
                                        onChange={(e) => setThemeColor(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-900 font-bold font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <LayoutTemplate size={16} /> Estructura del Portal
                            </label>

                            <div className="grid grid-cols-2 gap-4">
                                <button type="button" onClick={() => setLayout('LANDING_PAGE')} className={`p-4 rounded-2xl border-2 text-left transition-all ${layout === 'LANDING_PAGE' ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-100 bg-white hover:border-indigo-200'}`}>
                                    <h3 className={`font-bold ${layout === 'LANDING_PAGE' ? 'text-indigo-700' : 'text-slate-700'}`}>Landing Page</h3>
                                    <p className="text-xs text-slate-500 mt-1">Todo el contenido en una sola página larga.</p>
                                </button>
                                <button type="button" onClick={() => setLayout('MULTI_PAGE')} className={`p-4 rounded-2xl border-2 text-left transition-all ${layout === 'MULTI_PAGE' ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-100 bg-white hover:border-indigo-200'}`}>
                                    <h3 className={`font-bold ${layout === 'MULTI_PAGE' ? 'text-indigo-700' : 'text-slate-700'}`}>Multi-Página</h3>
                                    <p className="text-xs text-slate-500 mt-1">Menú de navegación y páginas separadas.</p>
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors mt-4"
                        >
                            <Save size={18} />
                            {isSaving ? 'Guardando...' : 'Guardar Apariencia'}
                        </button>
                    </form>
                </div>

                {/* Blocks Management */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                        <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
                            <Layout size={24} className="text-indigo-500" />
                            Disposición de Bloques
                        </h2>
                        <button
                            onClick={() => setIsAddingBlock(true)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
                        >
                            <Plus size={16} /> Añadir Sección
                        </button>
                    </div>

                    <p className="text-sm text-slate-500">
                        Ordena, edita o elimina las secciones del portal. Los cambios aplican automáticamente.
                    </p>

                    <div className="space-y-3">
                        {blocks.map((block: any, index: number) => (
                            <div
                                key={block.id}
                                className={`flex items-center justify-between p-4 rounded-2xl border ${block.is_visible ? 'bg-slate-50 border-slate-200' : 'bg-slate-50/50 border-slate-100 opacity-60'} transition-all`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col gap-1">
                                        <button
                                            onClick={() => handleMoveBlock(index, 'up')}
                                            disabled={index === 0}
                                            className="text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                                        >
                                            <ArrowUp size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleMoveBlock(index, 'down')}
                                            disabled={index === blocks.length - 1}
                                            className="text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                                        >
                                            <ArrowDown size={16} />
                                        </button>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <button onClick={() => setEditingBlock(block)} className="text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline">
                                            {getBlockName(block.type)}
                                        </button>
                                        <p className="text-xs text-slate-500 font-medium capitalize">{block.type.replace('_', ' ')}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setEditingBlock(block)}
                                        className="p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                        title="Editar contenido"
                                    >
                                        <Settings size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleToggleVisibility(index)}
                                        className={`p-2.5 rounded-xl transition-colors ${block.is_visible ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}
                                        title={block.is_visible ? "Ocultar bloque" : "Mostrar bloque"}
                                    >
                                        {block.is_visible ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteBlock(block.id)}
                                        className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                        title="Eliminar bloque"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal: Añadir Bloque */}
            {isAddingBlock && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-slate-900">Añadir Nueva Sección</h3>
                            <button onClick={() => setIsAddingBlock(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            <button onClick={() => handleAddBlock('hero')} className="flex items-center p-4 rounded-xl border border-slate-100 bg-slate-50 hover:border-indigo-200 hover:bg-indigo-50 transition-all text-left">
                                <div>
                                    <p className="font-bold text-slate-900 leading-none mb-1">Sección Hero (Portada)</p>
                                    <p className="text-xs text-slate-500">Título grande principal y fondo destacado.</p>
                                </div>
                            </button>
                            <button onClick={() => handleAddBlock('custom_text')} className="flex items-center p-4 rounded-xl border border-slate-100 bg-slate-50 hover:border-indigo-200 hover:bg-indigo-50 transition-all text-left">
                                <div>
                                    <p className="font-bold text-slate-900 leading-none mb-1">Texto Personalizado</p>
                                    <p className="text-xs text-slate-500">Un bloque libre para escribir párrafos e información extra.</p>
                                </div>
                            </button>
                            <button onClick={() => handleAddBlock('events')} className="flex items-center p-4 rounded-xl border border-slate-100 bg-slate-50 hover:border-indigo-200 hover:bg-indigo-50 transition-all text-left">
                                <div>
                                    <p className="font-bold text-slate-900 leading-none mb-1">Grilla de Eventos</p>
                                    <p className="text-xs text-slate-500">Muestra los próximos 3 eventos de la agenda.</p>
                                </div>
                            </button>
                            <button onClick={() => handleAddBlock('sermons')} className="flex items-center p-4 rounded-xl border border-slate-100 bg-slate-50 hover:border-indigo-200 hover:bg-indigo-50 transition-all text-left">
                                <div>
                                    <p className="font-bold text-slate-900 leading-none mb-1">Grilla de Prédicas</p>
                                    <p className="text-xs text-slate-500">Muestra los videos de las últimas prédicas.</p>
                                </div>
                            </button>
                            <button onClick={() => handleAddBlock('ministries')} className="flex items-center p-4 rounded-xl border border-slate-100 bg-slate-50 hover:border-indigo-200 hover:bg-indigo-50 transition-all text-left">
                                <div>
                                    <p className="font-bold text-slate-900 leading-none mb-1">Tarjetas de Ministerios</p>
                                    <p className="text-xs text-slate-500">Banners de los distintos ministerios para participar.</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Editar Bloque */}
            {editingBlock && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900">Editar Contenido</h3>
                                <p className="text-sm text-slate-500">{getBlockName(editingBlock.type)}</p>
                            </div>
                            <button onClick={() => setEditingBlock(null)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveBlockData} className="space-y-5">
                            {/* Campos dinámicos según el tipo de bloque */}

                            {editingBlock.data.title !== undefined && (
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700">Título de la sección</label>
                                    <input
                                        type="text"
                                        value={editingBlock.data.title}
                                        onChange={(e) => setEditingBlock({ ...editingBlock, data: { ...editingBlock.data, title: e.target.value } })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                            )}

                            {editingBlock.data.subtitle !== undefined && (
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700">Subtítulo (Opcional)</label>
                                    <input
                                        type="text"
                                        value={editingBlock.data.subtitle}
                                        onChange={(e) => setEditingBlock({ ...editingBlock, data: { ...editingBlock.data, subtitle: e.target.value } })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                            )}

                            {editingBlock.data.text !== undefined && (
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700">Cuerpo del texto</label>
                                    <textarea
                                        rows={5}
                                        value={editingBlock.data.text}
                                        onChange={(e) => setEditingBlock({ ...editingBlock, data: { ...editingBlock.data, text: e.target.value } })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                                    />
                                </div>
                            )}

                            <div className="pt-4 border-t border-slate-100">
                                <button type="submit" disabled={isSaving} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                                    <Save size={18} />
                                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
