import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { deleteSermon } from './actions'

function DeleteButton({ id }: { id: string }) {
    return (
        <form action={async () => {
            'use server'
            await deleteSermon(id)
        }}>
            <button
                type="submit"
                className="text-red-600 hover:text-red-900 font-medium text-sm"
            >
                Eliminar
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

    // Obtenemos las prédicas ordenadas por fecha (más recientes primero)
    const sermons = await prisma.sermon.findMany({
        where: { church_id: userChurch.church_id },
        orderBy: { date: 'desc' }
    })

    return (
        <div className="max-w-6xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Videoteca de Prédicas</h1>
                    <p className="text-slate-500">Agrega y administra los mensajes y enseñanzas en video.</p>
                </div>

                <Link
                    href="/dashboard/sermons/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    Subir Prédica
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {sermons.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-300 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>
                        <p className="text-lg">No has añadido ninguna prédica.</p>
                        <p className="text-sm">Solo necesitas el enlace de YouTube para empezar.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                        {sermons.map((sermon) => (
                            <div key={sermon.id} className="group relative border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                                {/* Thumbnail de YouTube autogenerado mediante su ID */}
                                <div className="aspect-video bg-slate-100 relative overflow-hidden">
                                    <img
                                        src={`https://img.youtube.com/vi/${sermon.youtube_video_id}/mqdefault.jpg`}
                                        alt={sermon.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                                    <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                                        {sermon.date.toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="p-4">
                                    {sermon.series && (
                                        <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                                            Serie: {sermon.series}
                                        </div>
                                    )}
                                    <h3 className="font-bold text-slate-900 line-clamp-2 mt-1 mb-2 leading-tight" title={sermon.title}>
                                        {sermon.title}
                                    </h3>
                                    <div className="text-sm text-slate-500 font-medium">
                                        Por: <span className="text-slate-700">{sermon.preacher}</span>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                                        <a
                                            href={`https://youtube.com/watch?v=${sermon.youtube_video_id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-slate-400 hover:text-blue-600 transition-colors text-sm font-medium flex items-center gap-1"
                                        >
                                            Ver en YouTube
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                        </a>
                                        <DeleteButton id={sermon.id} />
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
