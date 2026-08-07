# 🏗️ Arquitectura del Sistema de Autenticación

## Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        APLICACIÓN ANGULAR 22                             │
└─────────────────────────────────────────────────────────────────────────┘

                          ┌──────────────────┐
                          │   App Component  │
                          │   <router-outlet>│
                          └────────┬─────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
          ┌─────────▼────────┐         ┌──────────▼──────────┐
          │ PublicLayout     │         │ PrivateLayout      │
          │ (sin auth)       │         │ (con auth)         │
          │                  │         │                    │
          │ Landing          │         │ Dashboard          │
          │ Login            │         │ Profile            │
          └────────┬─────────┘         └──────────┬──────────┘
                   │                              │
                   └──────────────┬───────────────┘
                                  │
                        ┌─────────▼─────────┐
                        │  AuthService      │
                        │                   │
                        │ - mockLogin()     │
                        │ - login()         │
                        │ - logout()        │
                        │ - isAuthenticated │
                        └────────┬──────────┘
                                 │
                 ┌───────────────┼───────────────┐
                 │               │               │
        ┌────────▼────────┐  ┌───▼────────┐  ┌──▼─────────────┐
        │TokenStorageServ │  │AuthGuard   │  │authInterceptor│
        │                 │  │            │  │               │
        │- getToken()     │  │- protege   │  │- agrega token │
        │- setToken()     │  │  rutas     │  │  Bearer       │
        │- getUser()      │  │- redirigir │  │  automático   │
        │- setUser()      │  │            │  │               │
        │- hasToken()     │  │PublicGuard:│  │a requests     │
        │                 │  │- previene  │  │               │
        └─────────────────┘  │  loops     │  └───────────────┘
                             └────────────┘

                        ┌──────────────────┐
                        │   localStorage   │
                        │                  │
                        │ auth_token       │
                        │ auth_user        │
                        └──────────────────┘
```

---

## Flujo de Autenticación Detallado

### 1️⃣ **Usuario Aún No Autenticado**

```
Visita http://localhost:4200/app/dashboard
          │
          ▼
AuthGuard.canActivate()
          │
          ├─ isAuthenticated() === false
          │
          ▼
router.navigate(['/login'])
          │
          ▼
Usuario redirigido a /login
```

### 2️⃣ **Usuario Intenta Iniciar Sesión**

```
LoginComponent
          │
          ▼ Usuario ingresa email y contraseña
          │
          ├─ Validación de formulario
          │
          ▼ clickea "Iniciar Sesión"
          │
          ├─ authService.mockLogin(email, password)
          │
          ▼
TokenStorageService
          │
          ├─ setToken(mockToken) → localStorage
          ├─ setUser(userData) → localStorage
          │
          ▼
AuthService
          │
          ├─ isAuthenticatedSubject.next(true)
          ├─ currentUserSubject.next(userData)
          │
          ▼
router.navigate(['/app/dashboard'])
          │
          ▼
Usuario autenticado en dashboard
```

### 3️⃣ **Usuario Ya Autenticado**

```
Requests HTTP
          │
          ▼
authInterceptor
          │
          ├─ TokenStorageService.getToken()
          │
          ▼
Agrega header: "Authorization: Bearer <token>"
          │
          ▼
Request enviado al servidor
```

### 4️⃣ **Usuario Intenta Logout**

```
Click en "Cerrar sesión"
          │
          ▼
authService.logout()
          │
          ├─ TokenStorageService.clear()
          │  ├─ removeToken()
          │  └─ removeUser()
          │
          ├─ isAuthenticatedSubject.next(false)
          ├─ currentUserSubject.next(null)
          │
          ▼
router.navigate(['/login'])
          │
          ▼
localStorage limpio
Usuario redirigido a login
```

---

## Matriz de Rutas

| Ruta | Component | Layout | Requiere Auth | Guard |
|------|-----------|--------|---------------|-------|
| `/` | LandingComponent | PublicLayout | ❌ No | - |
| `/login` | LoginComponent | PublicLayout | ❌ No | PublicGuard |
| `/app/dashboard` | DashboardComponent | PrivateLayout | ✅ Sí | AuthGuard |
| `/app/profile` | ProfileComponent | PrivateLayout | ✅ Sí | AuthGuard |
| `**` | - | - | - | Redirect / |

---

## Inyección de Dependencias

```
App (componente raíz)
  │
  ├─ provideRouter(routes)
  │   │
  │   └─ AuthGuard (inyectado en rutas)
  │
  ├─ provideHttpClient(withInterceptors([authInterceptor]))
  │   │
  │   └─ authInterceptor
  │
  └─ Todos los servicios:
      │
      ├─ AuthService { providedIn: 'root' }
      ├─ TokenStorageService { providedIn: 'root' }
      └─ Automáticamente disponibles en toda la app
```

---

## Estado Reactivo (RxJS)

```
AuthService

  isAuthenticated$: Observable<boolean>
    │
    └─ currentUserSubject
        │
        ├─ Componentes se suscriben
        │
        ├─ Cambios en (email, name, etc.)
        │
        └─ UI se actualiza automáticamente

  currentUser$: Observable<any>
    │
    └─ Datos del usuario actual
        │
        ├─ ProfileComponent usa: {{ (currentUser$ | async)?.name }}
        ├─ PrivateLayoutComponent usa: {{ (currentUser$ | async)?.name }}
        │
        └─ Actualización automática sin necesidad de refresh
```

---

## Validación de Formularios

```
LoginComponent
  │
  ├─ email: [required, email]
  │   └─ Muestra error: "Email requerido y debe ser válido"
  │
  ├─ password: [required, minLength(6)]
  │   └─ Muestra error: "Contraseña requerida (mín. 6 caracteres)"
  │
  └─ Botón "Iniciar Sesión"
      │
      └─ [disabled]="!loginForm.valid || isLoading"
          │
          └─ Solo activo si el formulario es válido
```

---

## Manejo de Errores

```
LoginComponent
  │
  ├─ HTTP Request Error
  │
  ├─ authService.mockLogin()
  │   │
  │   └─ error: (err: any) => {
  │       │
  │       ├─ isLoading = false
  │       ├─ errorMessage = err.error?.message || 'Error al iniciar sesión'
  │       │
  │       └─ Muestra en template: <div *ngIf="errorMessage">...</div>
  │
  └─ Usuario ve el error en la pantalla
```

---

## Seguridad: Capas de Protección

```
┌─────────────────────────────────────────────────┐
│              CAPA 1: Rutas                       │
│  AuthGuard + canActivate()/canMatch() checks    │
└─────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│         CAPA 2: Guards en Componentes           │
│  PublicGuard previene loops de autenticación   │
└─────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│        CAPA 3: HTTP Interceptor                 │
│  Agrega token automáticamente a requests       │
└─────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│         CAPA 4: Validación Backend              │
│  Servidor valida token en cada request         │
└─────────────────────────────────────────────────┘
```

---

## Integración con Backend (Futuro)

```
Cambios Necesarios:

1. auth.service.ts
   this.authService.login(credentials).subscribe(...)
   
2. app.config.ts
   withBaseUrl('https://tu-api.com')
   
3. Endpoint Backend
   POST /api/auth/login
   Respuesta: { token, user: { id, email, name } }
   
4. Token Validation
   GET /api/auth/verify
   Headers: { Authorization: 'Bearer <token>' }
   
5. Manejo de Errores
   Error 401 → logout automático
   Error 403 → redirigir a /login
```

---

## Checklist de Funcionalidades

- [x] Login funcional
- [x] Logout funcional  
- [x] Protección de rutas
- [x] Redirecciones automáticas
- [x] Persistencia de sesión
- [x] Interceptor de tokens
- [x] Validación de formularios
- [x] Manejo de errores
- [x] UI responsive
- [x] Layouts separados
- [x] Estado reactivo (RxJS)
- [x] Mock login para demo
- [x] Ready para backend real

---

**Arquitectura lista para producción** ✅
