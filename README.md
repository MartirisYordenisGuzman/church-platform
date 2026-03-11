# ⚡ ChurchPlatform

**Elevando el Ministerio al Nivel Profesional.**

ChurchPlatform es una solución SaaS multi-tenant diseñada para iglesias modernas. Centraliza la gestión de membresía, eventos, sermones y departamentos a través de una interfaz premium, minimalista y de alto rendimiento.

![Hero Image](file:///c:/Users/marti/OneDrive/Escritorio/Workspace/church-platform/public/assets/images/hero.png)

## ✨ Características Principales

- 🏢 **Arquitectura Multi-tenant**: Cada iglesia gestiona su propia información y personaliza su presencia digital.
- 👥 **Directorio Inteligente**: Gestión fluida de miembros, familias y roles administrativos.
- 📅 **Gestión de Eventos**: Calendarios dinámicos con soporte para recurrencia y filtros por ministerio.
- 🎙️ **Módulo de Sermones**: Centralización de enseñanzas con integración directa a YouTube y organización por series.
- 🏛️ **Gestión de Ministerios**: Estructuración jerárquica de departamentos y sub-departamentos.
- 🌐 **Portales Públicos Dinámicos**: Generación automática de landing pages profesionales para cada iglesia.
- 🎨 **Diseño Premium**: Interfaz moderna construida con una estética de "Glassmorphism" y micro-animaciones.

## 🛠️ Stack Tecnológico

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Base de Datos**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Estilos**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Backend / Auth**: [Supabase](https://supabase.com/)
- **Iconos**: [Lucide React](https://lucide.dev/)
- **Componentes**: [Base UI](https://base-ui.com/) & [Shadcn UI](https://ui.shadcn.com/)

## 📂 Estructura del Proyecto

```text
src/
├── app/             # Rutas y layouts (Next.js App Router)
│   ├── (church)     # Rutas específicas para el portal de la iglesia
│   ├── (platform)   # Rutas generales de la plataforma
│   ├── [churchSlug] # Portales públicos dinámicos
│   ├── dashboard/   # Panel de administración robusto
│   └── login/       # Autenticación centralizada
├── components/      # Componentes UI reutilizables
├── services/        # Lógica de negocio e integración con Prisma
├── lib/             # Utilidades y configuraciones (Prisma, Supabase)
└── assets/          # Imágenes y recursos estáticos
```

## 🚀 Comenzando

### Requisitos Previos

- Node.js 20+
- Instancia de PostgreSQL (Supabase recomendada)

### Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/MartirisYordenisGuzman/church-platform.git
   cd church-platform
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar el entorno:**
   Crea un archivo `.env` basado en `.env.example` y completa las variables:
   ```env
   POSTGRES_PRISMA_URL=
   POSTGRES_URL_NON_POOLING=
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   ```

4. **Preparar la base de datos:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Iniciar desarrollo:**
   ```bash
   npm run dev
   ```

## 📄 Licencia

Este proyecto es privado. Todos los derechos reservados.

---
© 2026 ChurchPlatform. *Made for the Kingdom.*
