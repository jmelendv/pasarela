# Estructura de Autenticación - CatchToApp Pasarela

## 📁 Estructura de Carpetas Creada

```
src/app/
├── core/
│   ├── auth/
│   │   ├── auth.service.ts              # Servicio principal de autenticación
│   │   └── token-storage.service.ts     # Gestión de tokens en localStorage
│   ├── guards/
│   │   └── auth.guard.ts                # Guards para rutas (públicas y privadas)
│   └── interceptors/
│       └── auth.interceptor.ts          # Interceptor para agregar tokens a requests
├── features/
│   ├── public/
│   │   ├── login/
│   │   │   └── login.component.ts       # Componente de login
│   │   └── landing/
│   │       └── landing.component.ts     # Landing page pública
│   └── private/
│       ├── dashboard/
│       │   └── dashboard.component.ts   # Dashboard autenticado
│       └── profile/
│           └── profile.component.ts     # Perfil de usuario
├── layouts/
│   ├── public/
│   │   └── public-layout.component.ts   # Layout para páginas públicas
│   └── private/
│       └── private-layout.component.ts  # Layout para páginas autenticadas
├── app.routes.ts                        # Configuración de rutas (ACTUALIZADO)
├── app.config.ts                        # Configuración de aplicación (ACTUALIZADO)
└── app.ts                               # Componente raíz (ACTUALIZADO)
```

## 🔐 Funcionalidades Implementadas

### 1. **Autenticación**
- ✅ Login con email y contraseña
- ✅ Almacenamiento seguro de tokens (localStorage)
- ✅ Persistencia de usuario autenticado
- ✅ Logout
- ✅ Mock login para demo (sin backend requerido)

### 2. **Guards y Protección de Rutas**
- ✅ `AuthGuard`: Protege rutas privadas (requiere autenticación)
- ✅ `PublicGuard`: Previene acceso a login si ya está autenticado
- ✅ Redirecciones automáticas

### 3. **Interceptor HTTP**
- ✅ Agrega automáticamente token Bearer a todas las requests
- ✅ Funciona para conexiones a backend

### 4. **Layouts**
- ✅ **PublicLayout**: Header simple, para login y landing
- ✅ **PrivateLayout**: Header con navegación y botón de logout

### 5. **Componentes Completos**
- ✅ **LoginComponent**: Formulario de login funcional
- ✅ **LandingComponent**: Página inicial pública
- ✅ **DashboardComponent**: Página principal autenticada
- ✅ **ProfileComponent**: Página de perfil con edición

## 🛣️ Rutas Configuradas

### Públicas (sin login requerido)
- `/` - Landing page
- `/login` - Formulario de login

### Privadas (requieren login)
- `/app/dashboard` - Dashboard principal
- `/app/profile` - Perfil del usuario

## 🔄 Flujo de Autenticación

```
Usuario no autenticado
        ↓
    Ingresa a app
        ↓
¿Accede a /app/*? → SÍ → AuthGuard redirige a /login
        ↓ NO
    Accede a landing o /login
        ↓
¿Ya autenticado en /login? → SÍ → PublicGuard redirige a /app/dashboard
        ↓ NO
    Ingresa credenciales
        ↓
    mockLogin() guarda token y usuario
        ↓
    Redirige a /app/dashboard
        ↓
PrivateLayout carga con navegación
        ↓
    Logout → Limpia token/usuario → Redirige a /login
```

## 💾 Almacenamiento

Los datos se guardan en `localStorage`:
- **Token**: `auth_token`
- **Usuario**: `auth_user` (JSON)

## 🚀 Próximos Pasos

Para conectar con un backend real:

1. **En `auth.service.ts`**, reemplaza `mockLogin()` con `login()`:
   ```typescript
   this.authService.login({ email, password }).subscribe({...})
   ```

2. **Configura la URL base del API**:
   ```typescript
   provideHttpClient(withBaseUrl('https://tu-api.com'))
   ```

3. **Implementa refresh token** (opcional):
   - Agrega lógica en el interceptor para renovar tokens expirados

4. **Role-based access control**:
   - Extiende `AuthGuard` para validar roles del usuario

## ✅ Estado Actual

- **Build**: ✅ Exitoso (301.58 kB)
- **Componentes**: ✅ Todos funcionales
- **Rutas**: ✅ Configuradas
- **Seguridad**: ✅ Guardas y interceptor activos

## 📝 Notas Importantes

- El **mockLogin** funciona con cualquier email/contraseña para demostración
- Los tokens NO se validan en el backend (son solo para demo)
- Para producción, implementa validación real de tokens
- Los tokens expiran al refrescar la página (sin persistencia de estado)
