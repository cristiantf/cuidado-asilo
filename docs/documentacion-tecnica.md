# Documentación técnica — Cuidado Asilo

Referencia del código: modelo de datos, estado global, reglas de negocio, recordatorios, pantallas y configuración. Para la vista de alto nivel ver [arquitectura.md](arquitectura.md).

---

## 1. Modelo de datos (`src/lib/types.ts`)

### 1.1 `Paciente` (residente)

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `string` | Identificador único |
| `nombre` | `string` | Nombre completo (obligatorio) |
| `edad` | `string` | Edad en años |
| `habitacion` | `string` | Número de habitación; se usa para ordenar la lista |
| `alergias` | `string` | Se muestra en rojo en las tomas y la ficha |
| `condiciones` | `string` | Diagnósticos / condiciones |
| `contactoEmergencia` | `string` | Nombre, parentesco y teléfono |
| `notas` | `string` | Dieta, movilidad, preferencias |
| `creadoEn` | `number` | Marca de tiempo (ms) de creación |

### 1.2 `Medicamento`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `string` | Identificador único |
| `pacienteId` | `string` | Residente al que pertenece |
| `nombre` | `string` | Nombre del fármaco (obligatorio) |
| `dosis` | `string` | Texto libre: "50 mg", "1 tableta" |
| `via` | `string` | Oral, Sublingual, Inyectable, Tópica, Inhalada, Gotas, Otra |
| `horarios` | `string[]` | Horas `"HH:MM"` en formato 24 h, ordenadas (al menos una) |
| `indicaciones` | `string` | Instrucciones para el cuidador |
| `activo` | `boolean` | `false` = suspendido: no genera tomas ni avisos |

### 1.3 `Administracion` (registro de una toma)

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `string` | Identificador único |
| `medicamentoId` / `pacienteId` | `string` | Referencias |
| `fecha` | `string` | Día programado `"YYYY-MM-DD"` |
| `hora` | `string` | Hora programada `"HH:MM"` |
| `estado` | `'dada' \| 'omitida'` | Resultado registrado |
| `registradoEn` | `number` | Momento real del registro (ms) |
| `cuidador` | `string` | Cuidador en turno al registrar |
| `nota` | `string` | Observación (reservado, hoy vacío) |

La terna **(medicamentoId, fecha, hora)** identifica una toma; solo puede haber un registro por terna (registrar de nuevo reemplaza el anterior).

### 1.4 `Cuidado`

| Campo | Tipo | Descripción |
|---|---|---|
| `id`, `pacienteId` | `string` | |
| `tipo` | `TipoCuidado` | Uno de `TIPOS_CUIDADO` |
| `detalle` | `string` | Observación |
| `signos?` | `SignosVitales` | Solo para "Signos vitales": `presion`, `pulso`, `temperatura`, `saturacion`, `glucosa` (todos `string` opcionales) |
| `registradoEn` | `number` | Momento del registro |
| `cuidador` | `string` | Cuidador en turno |

`TIPOS_CUIDADO`: Signos vitales · Higiene · Alimentación · Movilidad / cambio de posición · Curación · Ánimo / conducta · Incidente / caída · Otro.

### 1.5 `Recordatorios` y `Datos`

```ts
type Recordatorios = { activos: boolean; anticipoMin: number }; // anticipo: 0, 5, 10, 15 o 30

type Datos = {
  pacientes: Paciente[];
  medicamentos: Medicamento[];
  administraciones: Administracion[];
  cuidados: Cuidado[];
  cuidadorActual: string;
  recordatorios: Recordatorios;
};
```

### 1.6 Tipos derivados (`src/lib/store.tsx`)

```ts
type EstadoToma = 'pendiente' | 'atrasada' | 'dada' | 'omitida';

type Toma = {
  clave: string;          // "YYYY-MM-DD|medicamentoId|HH:MM"
  hora: string;
  paciente: Paciente;
  medicamento: Medicamento;
  registro?: Administracion;
  estado: EstadoToma;
};
```

`Toma` **no se guarda**: se genera al vuelo con `tomasDelDia()`.

---

## 2. Estado global (`src/lib/store.tsx`)

`<DatosProvider>` envuelve la app y expone, con el hook `useDatos()`, todos los campos de `Datos` más:

| Miembro | Firma | Comportamiento |
|---|---|---|
| `cargando` | `boolean` | `true` mientras se lee AsyncStorage |
| `guardarPaciente` | `(p) => string` | Crea (sin `id`) o actualiza; devuelve el id |
| `eliminarPaciente` | `(id) => void` | Borra el residente **y en cascada** sus medicamentos, tomas y cuidados |
| `guardarMedicamento` | `(m) => void` | Crea o reemplaza |
| `eliminarMedicamento` | `(id) => void` | Borra el medicamento (sus registros históricos se conservan) |
| `registrarToma` | `(toma, estado, nota?) => void` | Crea el registro de la toma; reemplaza uno previo de la misma terna. Guarda `cuidadorActual` |
| `deshacerToma` | `(registroId) => void` | Elimina el registro; la toma vuelve a *pendiente*/*atrasada* |
| `registrarCuidado` | `(c) => void` | Agrega un cuidado con hora actual y cuidador |
| `eliminarCuidado` | `(id) => void` | Borra un cuidado |
| `setCuidador` | `(nombre) => void` | Cambia el cuidador en turno |
| `setRecordatorios` | `(r) => void` | Cambia la configuración de avisos |
| `avisosProgramados` | `number` | Cantidad de avisos diarios programados en el SO |
| `tomasDelDia` | `(fecha?, pacienteId?) => Toma[]` | Calcula la agenda del día |
| `reiniciarDemo` | `() => void` | Reemplaza los datos por los de ejemplo (conserva la config. de recordatorios) |

### 2.1 Persistencia

- Clave: **`cuidado-asilo:v1`** en AsyncStorage (en web, `localStorage`).
- Se guarda el objeto `Datos` completo serializado en JSON **en cada cambio**.
- Al cargar se mezcla con los valores por defecto (`{ ...VACIO, ...guardado }`), de modo que campos nuevos (como `recordatorios`) reciben un valor inicial en datos antiguos.
- Si no hay datos o la lectura falla, se cargan los datos de ejemplo.

### 2.2 Algoritmo `tomasDelDia(fecha, pacienteId?)`

```
para cada medicamento m con m.activo (y del paciente, si se filtró):
  si el paciente de m no existe → saltar
  para cada hora h en m.horarios:
    registro = administración con (m.id, día, h)
    si hay registro → estado = registro.estado        (dada | omitida)
    si no:
      si el día es anterior a hoy, o (es hoy y ahora > h + 30 min) → 'atrasada'
      si no → 'pendiente'
ordenar por hora y luego por nombre del residente
```

- Tolerancia: constante `TOLERANCIA_MIN = 30` minutos.
- El reloj interno se actualiza cada 60 s, por lo que los estados cambian solos.

---

## 3. Recordatorios (`src/lib/recordatorios.ts`)

| Función | Descripción |
|---|---|
| `notificacionesDisponibles` | `true` solo en Android e iOS |
| `tienePermiso()` | Consulta permisos (acepta `PROVISIONAL` en iOS) |
| `pedirPermiso()` | Solicita permiso si aún no se concedió |
| `reprogramar(meds, pacientes, config)` | Cancela los avisos con prefijo `toma-` y, si están activos y hay permiso, programa uno por cada hora distinta. Devuelve la cantidad |
| `notificacionDePrueba()` | Aviso a los 3 segundos |

Detalles:

- **Canal Android** `tomas` con importancia `MAX` y vibración (necesario además para que Android 13+ muestre el diálogo de permiso).
- **Disparador** `DAILY` con `hour`/`minute` = hora de la toma − `anticipoMin` (con ajuste circular sobre las 24 h; p. ej. 00:10 − 15 min → 23:55).
- **Identificador**: `toma-HH:MM` (permite cancelar solo los avisos de la app).
- **Contenido**: título "💊 Hora de la medicación (HH:MM)" o "💊 En N min: medicación de las HH:MM"; cuerpo con hasta 4 líneas `Residente (hab. X): Medicamento dosis` y "…y N más" si hay más.
- **`data`**: `{ ruta: '/', hora }`. Al tocar, `_layout.tsx` navega a Hoy.
- **Reprogramación automática**: efecto en `DatosProvider` que depende de `medicamentos`, `pacientes` y `recordatorios`.
- **Plugin** en `app.json`: `["expo-notifications", { "color": "#1F6F8B", "enableRemoteNotifications": false }]` (solo notificaciones locales, sin push).

---

## 4. Utilidades (`src/lib/fechas.ts`)

| Función | Ejemplo |
|---|---|
| `claveDia(d)` | `2026-11-19` (fecha local) |
| `horaActual(d)` | `15:38` |
| `minutosDe('08:30')` | `510` |
| `normalizarHora('8')` | `'08:00'`; `'25:00'` → `null` |
| `formatoFechaHora(ts)` | `19/11/2026 15:38` |
| `fechaLarga(d)` | `jueves 19 de noviembre` |
| `nuevoId()` | id base‑36 basado en tiempo + aleatorio |

---

## 5. Pantallas

| Ruta | Archivo | Responsabilidad |
|---|---|---|
| `/` | `(tabs)/index.tsx` | Resumen (atrasadas/pendientes/dadas/omitidas), filtros *Por hacer · Registradas · Todas*, lista de `TomaItem` |
| `/pacientes` | `(tabs)/pacientes.tsx` | Búsqueda por nombre/habitación, orden por habitación, insignias de atrasadas, pendientes y alergias |
| `/registros` | `(tabs)/registros.tsx` | Historial de cuidados o de medicación (últimos 100), filtro por residente |
| `/ajustes` | `(tabs)/ajustes.tsx` | Cuidador en turno, recordatorios, datos de ejemplo, borrar todo |
| `/paciente/[id]` | `paciente/[id].tsx` | Ficha, tomas de hoy, medicamentos, últimos 10 cuidados |
| `/paciente/editar?id` | `paciente/editar.tsx` | Formulario de residente; eliminar |
| `/medicamento/editar?pacienteId&id` | `medicamento/editar.tsx` | Formulario con vías, horas rápidas, hora libre, activo; eliminar |
| `/cuidado/nuevo?pacienteId` | `cuidado/nuevo.tsx` | Tipo de cuidado, signos vitales, detalle |

### 5.1 Componentes (`src/components`)

- **`ui.tsx`**: paleta `colores`, estilos compartidos `s`, y `Tarjeta`, `Boton` (primario/secundario/ok/peligro), `Campo`, `Chip`, `Insignia`, `Vacio`, `Titulo`, `confirmar()` y `avisar()` (usan `window.confirm/alert` en web y `Alert` en móvil).
- **`TomaItem.tsx`**: tarjeta con borde de color según estado (`ESTILO_ESTADO`), botones *✓ Administrada* / *Omitir* o *Deshacer*.
- **`CuidadoItem.tsx`**: tarjeta con icono por tipo, signos vitales formateados; los incidentes se resaltan en rojo.

### 5.2 Validaciones

| Formulario | Regla |
|---|---|
| Residente | Nombre obligatorio |
| Medicamento | Nombre obligatorio; al menos un horario; hora libre en formato 24 h válido |
| Cuidado | Debe tener detalle o al menos un signo vital |

---

## 6. Configuración

**`package.json`**: `"main": "expo-router/entry"`.

**`app.json`** (claves relevantes):

```json
{
  "expo": {
    "name": "Cuidado Asilo",
    "slug": "cuidado-asilo",
    "scheme": "cuidadoasilo",
    "plugins": [
      "expo-router",
      ["expo-notifications", { "color": "#1F6F8B", "enableRemoteNotifications": false }]
    ]
  }
}
```

**`tsconfig.json`**: `strict: true` y alias `@/*` → `./src/*`.

---

## 7. Comandos

| Comando | Para qué |
|---|---|
| `npm install` | Instalar dependencias |
| `npx expo start` | Servidor de desarrollo (QR para Expo Go) |
| `npx expo start --web` | Versión web |
| `npx tsc --noEmit` | Verificar tipos |
| `npx expo lint` | Lint |
| `npx expo install <paquete>` | Agregar dependencias compatibles con el SDK |
| `npx expo export --platform android` | Compilar el bundle (comprobación) |
| `npx eas-cli@latest build -p android` | Generar APK/AAB en la nube |

---

## 8. Pruebas manuales recomendadas

1. Abrir la app por primera vez → aparecen 2 residentes de ejemplo.
2. Marcar una toma como *Administrada* → cambia a verde, muestra hora y cuidador; recargar → persiste.
3. *Deshacer* → vuelve a *Pendiente* o *Atrasada*.
4. Crear un medicamento con hora = ahora − 31 min → aparece *Atrasada* y suma al contador de la pestaña.
5. Suspender el medicamento → desaparece de Hoy.
6. Registrar signos vitales → aparece en la ficha y en Bitácora.
7. Eliminar un residente → desaparecen sus tomas y registros.
8. (Teléfono) Activar recordatorios → aceptar permiso → "Enviar aviso de prueba" llega en ~3 s; tocarlo abre Hoy.
