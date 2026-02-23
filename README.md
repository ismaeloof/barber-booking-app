# 🔥 Barber Booking SaaS

Sistema de reservas multi-tenant para barberías construido en público durante 90 días.

## 🎯 Objetivo

Demostrar habilidades de desarrollo full-stack construyendo un SaaS completo desde cero, documentando todo el proceso.

## 🛠️ Stack Tecnológico

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Estilos:** Tailwind CSS 4
- **Pagos:** Stripe (próximamente)
- **Deploy:** Vercel (próximamente)

## ✨ Características

### Implementadas ✅
- Arquitectura multi-tenant con Row Level Security
- Sistema de autenticación
- Reservas de citas por horas
- Panel de administración
- Bloqueo automático de horarios ocupados
- Resumen de caja diario
- Rutas dinámicas por slug de barbería

### En desarrollo 🚧
- Sistema de suscripciones con Stripe
- Notificaciones por email/SMS
- Personalización de colores por barbería
- Analytics y estadísticas avanzadas

## 🗄️ Arquitectura de Base de Datos
```
barberias (tenants)
├── servicios (1:N)
└── citas (1:N)
    └── servicios (N:1)
```

**Row Level Security:** Cada barbería solo puede acceder a sus propios datos.

## 🚀 Instalación Local
```bash
# Clonar repositorio
git clone https://github.com/ismaeloof/barber-booking-saas.git
cd barber-booking-saas

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Añade tus credenciales de Supabase

# Ejecutar en desarrollo
npm run dev
```

## 📊 Progreso del Proyecto

Este proyecto se está construyendo en público durante 90 días.

**Día 1 (23/02/2026):** 
- ✅ Arquitectura multi-tenant con RLS
- ✅ Políticas de seguridad

**Día 2-3 (24-25/02/2026):**
- ✅ Reestructuración de rutas dinámicas
- ✅ Integración frontend-backend

**Día 4 (26/02/2026):**
- ✅ Sistema de reservas completo
- ✅ Panel de admin con autenticación
- ✅ Bloqueo de horas ocupadas
- ✅ Resumen de caja

Sigue el progreso:
- [X](https://x.com/Ismaeloof_)
- [LinkedIn](https://www.linkedin.com/in/ismael-carranza-g%C3%B3mez-706a65177/)

## 🙏 Build in Public

Este proyecto es parte de mi journey de #buildinpublic. Comparto todo el proceso de desarrollo, decisiones arquitectónicas, y aprendizajes.

## 📝 Licencia

MIT

---

Desarrollado por [Ismael](https://github.com/ismaeloof) | Sevilla, España 🇪🇸
```
