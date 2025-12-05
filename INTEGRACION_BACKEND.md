# Integración con API Gateway - Sistema Educativo Frontend

## Estructura Implementada

```
src/
├── services/               # Capa de servicios para API
│   ├── api.js             # Cliente HTTP base
│   ├── authService.js     # Autenticación
│   ├── alumnoService.js   # CRUD Alumnos y Grupos
│   ├── profesorService.js # CRUD Profesores
│   └── divisionService.js # CRUD Divisiones
├── context/
│   └── AuthContext.jsx    # Estado global de autenticación
├── components/ui/          # Componentes reutilizables
│   ├── LoadingSpinner.jsx # Indicador de carga
│   ├── EmptyState.jsx     # Estado vacío
│   └── ErrorState.jsx     # Estado de error
└── middleware.js           # Protección de rutas

```

---

## 1. Configuración de Variables de Entorno

### `.env.local`
```env
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:8080
NODE_ENV=development
```

**Nota:** Asegúrate de que el API Gateway esté corriendo en `localhost:8080`

---

## 2. Servicios API

### `api.js` - Cliente HTTP Base

Funciones principales:
- `api.get(endpoint, options)` - GET request
- `api.post(endpoint, data, options)` - POST request
- `api.put(endpoint, data, options)` - PUT request
- `api.patch(endpoint, data, options)` - PATCH request
- `api.delete(endpoint, options)` - DELETE request
- `buildQueryString(params)` - Construir query strings

**Características:**
- Manejo automático de tokens JWT (desde localStorage)
- Manejo centralizado de errores
- Headers automáticos (Content-Type, Authorization)
- Soporte para respuestas JSON y texto

### `alumnoService.js`

**Endpoints disponibles:**
```javascript
// Alumnos
alumnoService.getAllAlumnos(filters)
alumnoService.getAlumnoById(id)
alumnoService.getAlumnoByMatricula(matricula)
alumnoService.createAlumno(alumnoData)
alumnoService.updateAlumno(id, alumnoData)
alumnoService.deleteAlumno(id)
alumnoService.toggleAlumnoEstado(id)
alumnoService.searchAlumnosByNombre(nombre)

// Grupos
alumnoService.getAllGrupos(filters)
alumnoService.getGrupoById(id)
alumnoService.createGrupo(grupoData)
alumnoService.updateGrupo(id, grupoData)
alumnoService.deleteGrupo(id)
alumnoService.toggleGrupoEstado(id)
alumnoService.getAlumnosByGrupo(grupoId)
```

### `profesorService.js`

**Endpoints disponibles:**
```javascript
profesorService.getAllProfesores(filters)
profesorService.getProfesorById(id)
profesorService.getProfesorConDivision(id)
profesorService.createProfesor(profesorData)
profesorService.updateProfesor(id, profesorData)
profesorService.deleteProfesor(id)
profesorService.toggleProfesorEstado(id)
profesorService.searchProfesoresByNombre(nombre)
profesorService.getProfesoresByDivision(divisionId)
profesorService.checkEmailDisponible(email)
```

### `divisionService.js`

**Endpoints disponibles:**
```javascript
// Divisiones
divisionService.getAllDivisiones(filters)
divisionService.getDivisionById(id)
divisionService.createDivision(divisionData)
divisionService.updateDivision(id, divisionData)
divisionService.deleteDivision(id)
divisionService.toggleDivisionEstado(id)
divisionService.getDivisionesActivas()

// Programas Educativos
divisionService.getAllProgramas(filters)
divisionService.getProgramaById(id)
divisionService.getProgramasByDivision(divisionId)
divisionService.createPrograma(programaData)
divisionService.updatePrograma(id, programaData)
divisionService.deletePrograma(id)
divisionService.toggleProgramaEstado(id)
divisionService.getProgramasActivos()

// Coordinadores
divisionService.getAllCoordinadores(filters)
divisionService.getCoordinadorById(id)
divisionService.createCoordinador(coordinadorData)
divisionService.updateCoordinador(id, coordinadorData)
divisionService.deleteCoordinador(id)
```

---

## 3. Autenticación

### AuthContext

**Hook:** `useAuth()`

```javascript
import { useAuth } from '@/context/AuthContext';

function MiComponente() {
  const { user, login, logout, isAuthenticated, hasRole } = useAuth();

  // Ejemplo de uso
  const handleLogin = async () => {
    const result = await login({ usuario: 'admin', password: '123' });
    if (result.success) {
      // Login exitoso
    }
  };
}
```

**Propiedades disponibles:**
- `user` - Objeto del usuario actual
- `loading` - Estado de carga
- `login(credentials)` - Función para iniciar sesión
- `logout()` - Función para cerrar sesión
- `updateUser(userData)` - Actualizar datos del usuario
- `isAuthenticated()` - Verificar si está autenticado
- `hasRole(role)` - Verificar rol del usuario

---

## 4. Middleware de Protección de Rutas

**`src/middleware.js`**

Protege automáticamente todas las rutas excepto `/` (login).

**Para modificar rutas públicas:**
```javascript
const publicRoutes = ['/', '/registro', '/recuperar-password'];
```

---

## 5. Componentes UI Reutilizables

### LoadingSpinner
```javascript
import LoadingSpinner from '@/components/ui/LoadingSpinner';

<LoadingSpinner size="lg" text="Cargando datos..." />
```

### EmptyState
```javascript
import EmptyState from '@/components/ui/EmptyState';
import { Users } from 'lucide-react';

<EmptyState
  icon={Users}
  title="No hay usuarios"
  description="Comienza agregando tu primer usuario"
  action={<button>Agregar Usuario</button>}
/>
```

### ErrorState
```javascript
import ErrorState from '@/components/ui/ErrorState';

<ErrorState
  title="Error al cargar"
  description={error.message}
  onRetry={cargarDatos}
/>
```

---

## 6. Ejemplo de Implementación - Página CRUD

Ver: `src/app/divisiones/page.js`

**Patrón recomendado:**

```javascript
'use client';

import { useState, useEffect } from 'react';
import { divisionService } from '@/services/divisionService';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';

export default function MiPagina() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await divisionService.getAllDivisiones();
      setDatos(data);
    } catch (err) {
      setError(err);
      toast.error('Error al cargar', {
        description: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  const crear = async (formData) => {
    try {
      await divisionService.createDivision(formData);
      toast.success('Creado correctamente');
      await cargarDatos();
    } catch (err) {
      toast.error('Error al crear', {
        description: err.message
      });
    }
  };

  const actualizar = async (id, formData) => {
    try {
      await divisionService.updateDivision(id, formData);
      toast.success('Actualizado correctamente');
      await cargarDatos();
    } catch (err) {
      toast.error('Error al actualizar', {
        description: err.message
      });
    }
  };

  const eliminar = async (id) => {
    try {
      await divisionService.deleteDivision(id);
      toast.success('Eliminado correctamente');
      await cargarDatos();
    } catch (err) {
      toast.error('Error al eliminar', {
        description: err.message
      });
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState onRetry={cargarDatos} />;
  if (!datos.length) return <EmptyState />;

  return (
    <div>
      {/* Tu interfaz aquí */}
    </div>
  );
}
```

---

## 7. Notificaciones con Sonner

```javascript
import { toast } from 'sonner';

// Éxito
toast.success('Operación exitosa', {
  description: 'Los datos se guardaron correctamente'
});

// Error
toast.error('Error', {
  description: 'No se pudo completar la operación'
});

// Info
toast.info('Información', {
  description: 'Ten en cuenta que...'
});

// Warning
toast.warning('Advertencia', {
  description: 'Esto podría causar...'
});

// Loading
const promise = fetch('/api/data');
toast.promise(promise, {
  loading: 'Cargando...',
  success: 'Datos cargados',
  error: 'Error al cargar'
});
```

---

## 8. Dependencias Instaladas

```json
{
  "dependencies": {
    "lucide-react": "^0.555.0",
    "next": "16.0.6",
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "react-hook-form": "^7.x.x",
    "zod": "^3.x.x",
    "sonner": "^1.x.x",
    "@hookform/resolvers": "^3.x.x"
  }
}
```

---

## 9. Próximos Pasos

### A. Implementar Autenticación Real

Cuando el microservicio de autenticación esté listo:

1. Actualizar `authService.js` con endpoints reales
2. Implementar refresh token
3. Manejar expiración de tokens
4. Implementar recuperación de contraseña

### B. Crear Páginas CRUD Restantes

Basándote en el patrón de `divisiones/page.js`, crear:

- `/usuarios` - Gestión de usuarios
- `/alumnos` - CRUD de alumnos (usar `alumnoService`)
- `/grupos` - CRUD de grupos (usar `alumnoService`)
- `/materias` - CRUD de materias
- `/clases` - Gestión de clases
- `/perfil` - Perfil de usuario

### C. Implementar Validaciones con Zod

```javascript
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  nombre: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema)
});
```

### D. Implementar Paginación

```javascript
const [page, setPage] = useState(1);
const [limit, setLimit] = useState(10);

const cargarDatos = async () => {
  const filters = { page, limit };
  const data = await divisionService.getAllDivisiones(filters);
};
```

### E. Implementar Búsqueda y Filtros

```javascript
const [searchTerm, setSearchTerm] = useState('');
const [filters, setFilters] = useState({ activo: true });

const cargarDatos = async () => {
  const data = await divisionService.getAllDivisiones({
    search: searchTerm,
    ...filters
  });
};
```

---

## 10. Solución de Problemas

### Error de CORS

Si encuentras errores de CORS, asegúrate de que el API Gateway tenga configurado:

```yaml
spring:
  cloud:
    gateway:
      globalcors:
        corsConfigurations:
          '[/**]':
            allowedOrigins: "http://localhost:3000"
            allowedMethods: "*"
            allowedHeaders: "*"
            allowCredentials: true
```

### Error 401 Unauthorized

- Verifica que el token esté siendo enviado correctamente
- Revisa que el middleware no esté bloqueando rutas incorrectamente
- Comprueba la validez del token en el backend

### Error al conectar con API Gateway

- Verifica que el Gateway esté corriendo en `localhost:8080`
- Revisa que Eureka esté registrando los microservicios
- Comprueba las rutas en el Gateway

---

## 11. Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Producción
npm start

# Lint
npm run lint
```

---

## 12. Estructura de Datos Esperada

### División
```json
{
  "id": 1,
  "nombre": "División Industrial",
  "descripcion": "Carreras de ingeniería",
  "activo": true
}
```

### Alumno
```json
{
  "id": 1,
  "matricula": "2024001",
  "nombre": "Juan",
  "apellidoPaterno": "Pérez",
  "apellidoMaterno": "García",
  "correo": "juan@alumno.edu",
  "grupoId": 1,
  "activo": true
}
```

### Profesor
```json
{
  "id": 1,
  "nombre": "María",
  "apellidoPaterno": "López",
  "correo": "maria@profesor.edu",
  "divisionId": 1,
  "activo": true
}
```

---

**Documentación actualizada:** Diciembre 2024
**Next.js:** 16.0.6 | **React:** 19.2.0 | **Tailwind:** 4
