# 🚀 Guía Rápida de Inicio

## Ejecutar el Proyecto en Desarrollo

```bash
npm start
# o
ng serve
```

Accede en: **http://localhost:4200**

## Flujo de Demostración

### 1. Landing Page
- URL: `http://localhost:4200/`
- Verás el inicio de bienvenida
- Haz clic en **"Iniciar Sesión"**

### 2. Login
- URL: `http://localhost:4200/login`
- Email: Cualquiera (ej: `user@example.com`)
- Contraseña: Cualquiera con 6+ caracteres (ej: `password123`)
- Haz clic en **"Iniciar Sesión"**

### 3. Dashboard (Autenticado)
- URL: `http://localhost:4200/app/dashboard`
- Verás el nombre del usuario en el header
- Puedes navegar a **Perfil**
- Hay un botón **"Cerrar sesión"** en el header

### 4. Intentar Acceder sin Login
- Abre una nueva pestaña y ve a: `http://localhost:4200/app/dashboard`
- Serás redirigido automáticamente a `/login`

### 5. Intentar Acceder a Login Estando Autenticado
- Estando en `/app/dashboard`, ve a: `http://localhost:4200/login`
- Serás redirigido automáticamente a `/app/dashboard`

## Archivos Clave para Modificar

### Para Conectar con Backend Real

**Archivo**: `src/app/core/auth/auth.service.ts`

Cambia esto:
```typescript
this.authService.mockLogin(email, password).subscribe({...})
```

Por esto:
```typescript
this.authService.login({ email, password }).subscribe({...})
```

**Archivo**: `src/app/app.config.ts`

Agrega la URL base del API:
```typescript
import { provideHttpClient, withInterceptors, withBaseUrl } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor]),
      withBaseUrl('https://tu-api.com')
    )
  ]
};
```

### Personalizar Estilos

Los componentes usan estilos inline en Angular. Para cambiar colores:

**Archivo**: `src/app/layouts/private/private-layout.component.ts`

Busca el color `#007bff` y reemplázalo con tu color preferido.

### Agregar Nuevas Rutas Privadas

**Archivo**: `src/app/app.routes.ts`

En la sección de `/app`:
```typescript
{
  path: 'app',
  component: PrivateLayoutComponent,
  canActivate: [AuthGuard.prototype.canActivate.bind(AuthGuard)],
  children: [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'profile', component: ProfileComponent },
    // Agrega aquí nuevas rutas privadas
    { path: 'nueva-ruta', component: NuevoComponent },
    // ...
  ]
}
```

## Variables de Entorno (Opcional)

Puedes crear un archivo `environment.ts`:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.ejemplo.com'
};
```

Luego en `auth.service.ts`:
```typescript
import { environment } from '../../../environments/environment';

// Usar: environment.apiUrl
```

## Estructura de Respuesta del API (Esperado)

### Login Endpoint
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Respuesta esperada (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "Nombre del Usuario"
  }
}
```

### Requests Autenticados
Todos los requests posteriores incluirán automáticamente:
```
Authorization: Bearer <token>
```

## Troubleshooting

### Error: "Cannot find module"
- Asegúrate de que los paths relativos en las importaciones son correctos
- El proyecto está estructurado como:
  - `src/app/core/` - Servicios y guards
  - `src/app/features/` - Componentes de páginas
  - `src/app/layouts/` - Layouts principales

### El login no funciona
- Usa cualquier email en formato válido (ej: `test@test.com`)
- La contraseña debe tener mínimo 6 caracteres
- El mockLogin siempre funciona (sin backend requerido)

### Estilos no se ven correctamente
- Los estilos están definidos inline en cada componente
- Verifica que no hay conflictos con `src/app/app.css`
- Abre las Developer Tools (F12) → Elements para debuggear

## Comandos Útiles

```bash
# Desarrollo
npm start

# Build para producción
npm run build

# Build + output en dist/
ng build --configuration production

# Tests
npm test

# Linting (si está configurado)
npm run lint
```

---

**¡Listo!** Tu sistema de autenticación está completamente funcional. 🎉
