# Guía de desarrollo — Cuidado Asilo

Cómo instalar, ejecutar, modificar y publicar la app.

## 1. Requisitos

| Herramienta | Versión usada |
|---|---|
| Node.js | 26.x |
| npm | 11.x |
| Git | cualquiera reciente |
| Teléfono con **Expo Go** | Android o iOS, en la misma red Wi‑Fi que el PC |
| (Opcional) Android Studio | Para emulador Android |

## 2. Instalación

```bash
npm install
```

## 3. Ejecutar

```bash
npx expo start
```

- Escanea el QR con **Expo Go** (Android) o con la cámara (iOS).
- Pulsa `w` para abrir la versión web, `a` para el emulador Android.
- Si cambias dependencias o la caché falla: `npx expo start --clear`.

> En la versión web todo funciona excepto los recordatorios (notificaciones), que solo existen en Android/iOS.

## 4. Verificar antes de entregar

```bash
npx tsc --noEmit
```

```bash
npx expo lint
```

```bash
npx expo export --platform android
```

Los tres deben terminar sin errores.

## 5. Convenciones

- **Idioma**: nombres de variables, funciones y textos en español (`guardarPaciente`, `tomasDelDia`).
- **Rutas**: cada archivo de `src/app/` es una pantalla. El código que no es pantalla va en `src/components/` o `src/lib/`.
- **Imports**: usa el alias `@/` (p. ej. `import { useDatos } from '@/lib/store'`).
- **Estado**: las pantallas **no** acceden a AsyncStorage ni a notificaciones; usan acciones de `useDatos()`.
- **Inmutabilidad**: las acciones crean nuevos arreglos/objetos con `setDatos((d) => ({ ...d, ... }))`.
- **Estilos**: reutiliza `colores` y `s` de `src/components/ui.tsx`. Tamaño de texto mínimo 13–15 px; botones de al menos 40–50 px de alto.
- **Diálogos**: usa `confirmar()` y `avisar()` (funcionan en web y móvil).
- **Dependencias**: siempre con `npx expo install <paquete>` para obtener versiones compatibles con el SDK.

## 6. Recetas comunes

### 6.1 Agregar un campo al residente

1. Agrégalo al tipo `Paciente` en `src/lib/types.ts`.
2. Agrégalo al estado del formulario en `src/app/paciente/editar.tsx` y crea su `<Campo>`.
3. Muéstralo en la ficha (`src/app/paciente/[id].tsx`) con `<Dato etiqueta=… valor=… />`.
4. Actualiza `src/lib/demo.ts`.

Los datos guardados antes no tendrán el campo: trátalo como opcional o usa un valor por defecto.

### 6.2 Agregar un tipo de cuidado

1. Añádelo a `TIPOS_CUIDADO` en `src/lib/types.ts`.
2. Añade su icono en `ICONOS` de `src/components/CuidadoItem.tsx`.

### 6.3 Agregar una pantalla

1. Crea el archivo, por ejemplo `src/app/reportes.tsx`.
2. Si necesita título u opciones, decláralo en `src/app/_layout.tsx` con `<Stack.Screen name="reportes" options={{ title: 'Reportes' }} />`.
3. Navega con `router.push('/reportes')`.

Para que sea una pestaña, créala en `src/app/(tabs)/` y agrega su `<Tabs.Screen>` en `src/app/(tabs)/_layout.tsx`.

### 6.4 Cambiar la tolerancia de "atrasada"

Modifica `TOLERANCIA_MIN` en `src/lib/store.tsx`.

### 6.5 Cambiar el formato guardado

Si cambias la estructura de `Datos` de forma incompatible, cambia la clave `CLAVE` (`cuidado-asilo:v1` → `v2`) y escribe una migración que lea la versión anterior en el `useEffect` de carga.

## 7. Generar la app instalable (APK / AAB / IPA)

Se usa **EAS Build** (en la nube; requiere cuenta gratuita de Expo):

```bash
npx eas-cli@latest login
```

```bash
npx eas-cli@latest build:configure
```

APK para instalar directamente en Android (perfil de prueba interna):

```bash
npx eas-cli@latest build -p android --profile preview
```

Para la tienda (AAB / iOS):

```bash
npx eas-cli@latest build -p android --profile production
```

Antes de publicar:
- Cambia el icono y splash en `assets/` y el nombre en `app.json`.
- Define `android.package` e `ios.bundleIdentifier` en `app.json`.
- Para avisos a la hora exacta en Android 12+, añade el permiso `SCHEDULE_EXACT_ALARM` en `android.permissions` y solicítalo con `requestExactAlarmPermissionsAsync` (ver documentación de expo-notifications).

> No edites carpetas `android/` o `ios/` a mano: Expo las genera. Toda la configuración nativa va en `app.json`.

## 8. Solución de problemas

| Síntoma | Solución |
|---|---|
| `Unable to resolve module …` tras instalar un paquete | Detén el servidor y ejecuta `npx expo start --clear` |
| El teléfono no conecta al QR | Misma red Wi‑Fi; o `npx expo start --tunnel` |
| Pantalla en blanco en web | Revisa la consola del navegador y la terminal de Metro |
| Quiero volver a los datos iniciales | Ajustes → Cargar datos de ejemplo, o borra los datos de la app / `localStorage` en web |
| Las notificaciones no llegan en Expo Go | Revisa permisos del sistema para Expo Go y el modo "No molestar" |

## 9. Documentación relacionada

- [Arquitectura](arquitectura.md)
- [Documentación técnica](documentacion-tecnica.md)
- [Diagramas UML](diagramas-uml.md)
- Expo: <https://docs.expo.dev/versions/v58.0.0/>
- Expo Router: <https://docs.expo.dev/router/introduction/>
- expo-notifications: <https://docs.expo.dev/versions/v58.0.0/sdk/notifications/>
