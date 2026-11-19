# Arquitectura del proyecto — Cuidado Asilo

## 1. Visión general

**Cuidado Asilo** es una aplicación móvil para que el personal de un asilo registre y controle:

- la **medicación diaria** de cada residente (qué dar, a quién, a qué hora, si se dio o se omitió);
- los **cuidados** realizados (signos vitales, higiene, alimentación, movilidad, curaciones, ánimo, incidentes);
- los **datos clínicos básicos** del residente (alergias, diagnósticos, contacto de emergencia).

Es una app **offline-first de un solo dispositivo**: no tiene servidor. Todos los datos viven en el almacenamiento local del teléfono y los recordatorios son notificaciones locales programadas en el propio sistema operativo.

## 2. Tecnologías

| Capa | Tecnología | Uso |
|---|---|---|
| Framework | **Expo SDK 58** + **React Native 0.88** | App multiplataforma (Android, iOS y web) |
| Lenguaje | **TypeScript 6** (modo `strict`) | Tipado de todo el código |
| UI | React 19 + componentes nativos de React Native | Pantallas y componentes propios |
| Navegación | **Expo Router** (rutas por archivos) | Pila (Stack) + pestañas (Tabs) |
| Iconos | `@expo/vector-icons` (Ionicons) | Iconos de la barra de pestañas |
| Persistencia | `@react-native-async-storage/async-storage` | Guardar todo el estado como JSON |
| Notificaciones | `expo-notifications` | Recordatorios diarios locales |
| Calidad | ESLint (`eslint-config-expo`), `tsc --noEmit` | Lint y verificación de tipos |

## 3. Estilo arquitectónico

La app sigue una arquitectura en **capas** sencilla, con un **estado global único** expuesto mediante React Context:

```
┌──────────────────────────────────────────────────────────────┐
│  CAPA DE PRESENTACIÓN  (src/app, src/components)             │
│  Pantallas de Expo Router + componentes reutilizables        │
└───────────────▲──────────────────────────────┬───────────────┘
                │ useDatos() (lectura)         │ acciones (escritura)
┌───────────────┴──────────────────────────────▼───────────────┐
│  CAPA DE ESTADO / LÓGICA  (src/lib/store.tsx)                │
│  DatosProvider: estado, acciones, cálculo de tomas del día   │
└──────┬─────────────────────────────┬─────────────────────────┘
       │ JSON (cada cambio)          │ reprogramar(...)
┌──────▼──────────────┐   ┌──────────▼──────────────────────────┐
│ PERSISTENCIA        │   │ SERVICIO DE RECORDATORIOS           │
│ AsyncStorage        │   │ src/lib/recordatorios.ts            │
│ clave cuidado-asilo:v1│ │ expo-notifications (SO del teléfono)│
└─────────────────────┘   └─────────────────────────────────────┘
```

Principios aplicados:

1. **Fuente única de verdad**: todo el estado (`Datos`) está en un solo objeto dentro de `DatosProvider`.
2. **Estado derivado, no almacenado**: el estado de una toma (*pendiente*, *atrasada*) se **calcula** a partir de medicamentos + registros + hora actual; solo se guardan los registros reales (*dada*, *omitida*).
3. **Efectos reactivos**: guardar en disco y reprogramar notificaciones son efectos (`useEffect`) que reaccionan a los cambios del estado; las pantallas nunca llaman a AsyncStorage ni a las notificaciones para programar.
4. **Rutas como archivos**: cada archivo en `src/app/` es una pantalla; los `_layout.tsx` definen los navegadores.

## 4. Estructura de carpetas

```
appmovil1/
├── app.json                 Configuración de Expo (nombre, scheme, plugins)
├── package.json             Dependencias; "main": "expo-router/entry"
├── tsconfig.json            TypeScript estricto + alias "@/*" → "src/*"
├── assets/                  Iconos y splash
├── docs/                    Esta documentación
└── src/
    ├── app/                 RUTAS (Expo Router)
    │   ├── _layout.tsx          Raíz: DatosProvider + Stack + listener de notificaciones
    │   ├── (tabs)/
    │   │   ├── _layout.tsx      Barra de pestañas (con contador de atrasadas)
    │   │   ├── index.tsx        "Hoy": agenda de tomas del día
    │   │   ├── pacientes.tsx    "Residentes": lista y búsqueda
    │   │   ├── registros.tsx    "Bitácora": historial
    │   │   └── ajustes.tsx      Cuidador, recordatorios, datos
    │   ├── paciente/
    │   │   ├── [id].tsx         Ficha del residente
    │   │   └── editar.tsx       Alta / edición (modal)
    │   ├── medicamento/
    │   │   └── editar.tsx       Alta / edición de medicamento (modal)
    │   └── cuidado/
    │       └── nuevo.tsx        Registro de cuidado (modal)
    ├── components/
    │   ├── ui.tsx               Paleta de colores, Boton, Campo, Chip, Tarjeta, confirmar/avisar
    │   ├── TomaItem.tsx         Tarjeta de una toma con acciones
    │   └── CuidadoItem.tsx      Tarjeta de un registro de cuidado
    └── lib/
        ├── types.ts             Modelo de datos
        ├── store.tsx            Estado global, acciones y persistencia
        ├── recordatorios.ts     Programación de notificaciones locales
        ├── fechas.ts            Utilidades de fecha/hora e IDs
        └── demo.ts              Datos de ejemplo
```

## 5. Mapa de navegación

```
Stack raíz (_layout.tsx)
├── (tabs)                         ← sin encabezado propio
│   ├── /            Hoy
│   ├── /pacientes   Residentes ──────────┐
│   ├── /registros   Bitácora             │
│   └── /ajustes     Ajustes              │
├── /paciente/[id]   Ficha  ◄─────────────┘
│     ├──► /paciente/editar?id=…          (modal)
│     ├──► /medicamento/editar?pacienteId=…[&id=…]  (modal)
│     └──► /cuidado/nuevo?pacienteId=…    (modal)
└── /paciente/editar  (desde "+ Nuevo residente")
```

Al tocar una notificación de recordatorio, el listener de `_layout.tsx` navega a `/` (Hoy).

## 6. Flujo de datos

1. **Arranque**: `DatosProvider` lee `cuidado-asilo:v1` de AsyncStorage. Si no existe, carga `datosDemo()`. Mientras tanto se muestra un indicador de carga.
2. **Lectura**: las pantallas usan `useDatos()` para obtener datos y funciones.
3. **Escritura**: las pantallas llaman acciones (`registrarToma`, `guardarMedicamento`, …) que actualizan el estado de forma inmutable con `setDatos`.
4. **Persistencia**: un efecto guarda el objeto `Datos` completo en AsyncStorage cada vez que cambia.
5. **Recordatorios**: otro efecto observa `medicamentos`, `pacientes` y `recordatorios`; cuando cambian, cancela los avisos anteriores y programa los nuevos.
6. **Reloj**: un intervalo de 60 s actualiza `reloj` para que las tomas pasen a *atrasada* sin recargar la pantalla.

## 7. Decisiones de diseño

| Decisión | Motivo | Consecuencia |
|---|---|---|
| Sin backend, AsyncStorage local | Simplicidad, funciona sin internet, sin costos | Los datos no se comparten entre teléfonos; no hay copia de seguridad |
| Un solo objeto JSON | Modelo pequeño, fácil de guardar/cargar | Con miles de registros la escritura será más lenta; migrar a SQLite si crece |
| Estados de toma calculados | Evita inconsistencias y tareas en segundo plano | Hay que recalcular cada minuto (barato) |
| Avisos agrupados por hora | Menos notificaciones, menos fatiga de alertas | Una notificación puede incluir varios residentes |
| Avisos diarios repetitivos | No hace falta reprogramar cada día | El aviso suena aunque la toma ya esté registrada |
| Contexto de React en vez de Redux/Zustand | Pocas pantallas y un solo estado | Toda la app se re-renderiza en cada cambio (aceptable al tamaño actual) |
| Botones grandes, texto ≥ 15 px | Uso rápido durante el turno, con guantes o con prisa | Pantallas más largas |

## 8. Atributos de calidad

- **Disponibilidad**: funciona sin conexión.
- **Usabilidad**: colores por estado (rojo atrasada, verde dada, ámbar omitida, azul pendiente), alergias resaltadas en rojo, confirmación antes de borrar.
- **Trazabilidad**: cada toma y cuidado guarda fecha/hora de registro y nombre del cuidador en turno.
- **Mantenibilidad**: TypeScript estricto, lint, capas separadas.
- **Privacidad**: los datos no salen del dispositivo.

## 9. Limitaciones conocidas y evolución

| Limitación | Evolución propuesta |
|---|---|
| Datos solo en un teléfono | Backend (p. ej. Supabase/Firebase) con sincronización y cuentas por cuidador |
| Sin copia de seguridad / exportación | Exportar a CSV/PDF y respaldo en la nube |
| Sin control de acceso | Inicio de sesión con roles (enfermería, cuidador, administración) |
| Aviso suena aunque la toma esté dada | Programar avisos de un solo día y reprogramar a diario |
| Android 12+: hora aproximada | Build propia con permiso `SCHEDULE_EXACT_ALARM` |
| Sin inventario de medicamentos | Stock y alerta de reposición |
| Sin medicación "si es necesario" (PRN) | Tipo de medicamento sin horario con registro libre |
