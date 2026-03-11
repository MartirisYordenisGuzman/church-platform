import {
  ArrowRight,
  Calendar,
  MonitorPlay,
  Users,
  Sparkles,
  Layout,
  Zap,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* Navbar - Glassmorphism */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Zap size={22} fill="currentColor" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              Church<span className="text-indigo-600">Platform</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
            <Link href="#features" className="hover:text-indigo-600 transition-colors">Funcionalidades</Link>
            <Link href="#solutions" className="hover:text-indigo-600 transition-colors">Soluciones</Link>
            <Link href="#contact" className="hover:text-indigo-600 transition-colors">Contacto</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="px-6 py-2.5 bg-slate-900 text-white text-sm font-black rounded-xl hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200 active:scale-95"
            >
              Comenzar Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest ring-1 ring-indigo-100">
              <Sparkles size={14} />
              La nueva era de la gestión eclesiástica
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tighter">
              Eleva tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Ministerio</span> a un nivel profesional.
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
              La plataforma SaaS todo-en-uno diseñada para iglesias modernas. Gestiona membresía, eventos, sermones y departamentos con una interfaz premium y minimalista.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/dashboard"
                className="group px-8 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-indigo-200 hover:bg-slate-900 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                Empezar Ahora
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#features"
                className="px-8 py-5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all text-center"
              >
                Ver Funciones
              </Link>
            </div>
            <div className="flex items-center gap-6 pt-8 border-t border-slate-100">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 shadow-sm overflow-hidden relative">
                    <Image
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt="User"
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm font-bold text-slate-400 italic">
                Únete a más de <span className="text-slate-900">+500 Pastores</span> que ya están digitalizando su iglesia.
              </p>
            </div>
          </div>

          <div className="relative animate-in fade-in zoom-in-95 duration-1000 delay-200">
            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 to-violet-500/20 blur-3xl rounded-full opacity-50"></div>
            <div className="relative bg-white p-4 rounded-[2.5rem] shadow-2xl shadow-indigo-100 ring-1 ring-slate-100">
              <Image
                src="/assets/images/hero.png"
                alt="Church Platform Interface"
                width={800}
                height={600}
                className="rounded-[2rem] shadow-inner"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto space-y-20 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-indigo-400 text-sm font-black uppercase tracking-[0.3em]">Potencia tu Iglesia</h2>
            <h3 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
              Herramientas diseñadas para el crecimiento espiritual y organizativo.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Users size={24} />}
              title="Directorio Inteligente"
              description="Gestión completa de miembros, familias y roles con perfiles detallados y búsqueda instantánea."
              color="bg-blue-500"
            />
            <FeatureCard
              icon={<Calendar size={24} />}
              title="Eventos y Calendarios"
              description="Planifica servicios, congresos y reuniones con recurrencia inteligente y portal público automático."
              color="bg-violet-500"
            />
            <FeatureCard
              icon={<MonitorPlay size={24} />}
              title="Módulo de Prédicas"
              description="Centraliza tus enseñanzas con integración directa a YouTube y organización por series."
              color="bg-emerald-500"
            />
            <FeatureCard
              icon={<Layout size={24} />}
              title="Portales Públicos"
              description="Cada iglesia obtiene un portal web profesional y responsive generado automáticamente."
              color="bg-amber-500"
            />
          </div>
        </div>
      </section>

      {/* Stats/Social Proof Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200 border border-slate-50 space-y-4 text-center group hover:-translate-y-2 transition-transform">
            <p className="text-5xl font-black text-slate-900">99%</p>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Ahorro de Tiempo</p>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">Automatiza procesos administrativos y enfócate en lo que importa: El ministerio.</p>
          </div>
          <div className="bg-indigo-600 p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-200 space-y-4 text-center text-white scale-110 group hover:-translate-y-2 transition-transform">
            <p className="text-5xl font-black">24/7</p>
            <p className="text-indigo-100 font-bold uppercase tracking-widest text-xs">Acceso Cloud</p>
            <p className="text-sm text-indigo-100 font-medium leading-relaxed">Toda tu información segura y accesible desde cualquier lugar del mundo.</p>
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200 border border-slate-50 space-y-4 text-center group hover:-translate-y-2 transition-transform">
            <p className="text-5xl font-black">+10k</p>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Miemnbros Gestionados</p>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">Nuestra plataforma escala contigo, desde iglesias locales hasta redes globales.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-32 px-6">
        <div className="max-w-7xl mx-auto rounded-[3.5rem] bg-slate-900 p-12 md:p-24 relative overflow-hidden text-center space-y-12">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2"></div>

          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">¿Listo para transformar tu iglesia?</h2>
            <p className="text-xl text-slate-400 font-medium">Únete hoy a la comunidad de ChurchPlatform y comienza a experimentar el futuro de la administración eclesiástica.</p>
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-12 py-5 bg-white text-slate-900 rounded-2xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl"
              >
                Comenzar Gratis
              </Link>
              <button className="text-white font-bold flex items-center gap-2 hover:text-indigo-400 transition-colors">
                Agendar una Demo <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Zap size={18} fill="currentColor" />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-900">
              Church<span className="text-indigo-600">Platform</span>
            </span>
          </div>

          <div className="flex gap-8 text-sm font-bold text-slate-400">
            <Link href="#" className="hover:text-indigo-600 transition-colors">Términos</Link>
            <Link href="#" className="hover:text-indigo-600 transition-colors">Privacidad</Link>
            <Link href="#" className="hover:text-indigo-600 transition-colors">Cookies</Link>
            <Link href="#" className="hover:text-indigo-600 transition-colors">Soporte</Link>
          </div>

          <p className="text-sm font-bold text-slate-400">
            © 2026 ChurchPlatform. Made for the Kingdom.
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
  return (
    <div className="p-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-[2.5rem] group hover:bg-slate-800 hover:border-indigo-500/50 transition-all duration-500 space-y-6">
      <div className={`w-14 h-14 ${color} text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
        {icon}
      </div>
      <div className="space-y-3">
        <h4 className="text-xl font-black text-white tracking-tight">{title}</h4>
        <p className="text-slate-400 font-medium leading-relaxed text-sm">
          {description}
        </p>
      </div>
    </div>
  )
}
