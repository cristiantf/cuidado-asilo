# Cuidado Asilo

App móvil (Expo / React Native) para el seguimiento de medicación y cuidados de residentes adultos mayores en un asilo.

## Funciones

- **Hoy**: agenda de todas las tomas del día, ordenadas por hora. Estados: *pendiente*, *atrasada* (más de 30 min tarde), *administrada*, *omitida*. Botón para marcar o deshacer. El ícono de la pestaña muestra cuántas tomas van atrasadas.
- **Residentes**: ficha con habitación, edad, alergias (en rojo), diagnósticos, contacto de emergencia y notas. Cada residente tiene sus medicamentos (dosis, vía, horarios, indicaciones, activo/suspendido).
- **Registrar cuidado**: signos vitales (presión, pulso, temperatura, SpO₂, glucosa), higiene, alimentación, movilidad, curaciones, ánimo, incidentes/caídas y otros.
- **Bitácora**: historial de cuidados y de tomas, filtrable por residente.
- **Recordatorios** (Ajustes → Recordatorios de medicación): notificación diaria en el teléfono a la hora de cada toma, o 5–30 min antes. Las tomas de la misma hora se agrupan en un solo aviso, y al tocarlo se abre la pantalla Hoy. Se reprograman solos al cambiar medicamentos o residentes. Incluye un botón de aviso de prueba. Solo funcionan en Android/iPhone, no en el navegador. En Android 12+ el aviso puede llegar con unos minutos de diferencia.
- **Ajustes**: nombre del cuidador/a en turno (queda guardado en cada registro), cargar datos de ejemplo o borrar todo.

Los datos se guardan **solo en el dispositivo** (AsyncStorage). La primera vez se cargan dos residentes de ejemplo.

## Documentación

Toda la documentación está en [docs/](docs/README.md): [arquitectura](docs/arquitectura.md), [documentación técnica](docs/documentacion-tecnica.md), [historias de usuario](docs/historias-de-usuario.md), [casos de uso](docs/casos-de-uso.md), [diagramas UML](docs/diagramas-uml.md), [guía de uso](docs/guia-de-uso.md) y [guía de desarrollo](docs/guia-de-desarrollo.md).

## Cómo ejecutarla

```bash
npm install
npx expo start
```

- En el teléfono: instala **Expo Go** y escanea el código QR.
- En el navegador: pulsa `w` o ejecuta `npx expo start --web`.
- Android: `npx expo start --android` (con emulador o dispositivo conectado).

## Estructura

```
src/app/            Pantallas (Expo Router)
  (tabs)/           Hoy, Residentes, Bitácora, Ajustes
  paciente/[id]     Ficha del residente
  paciente/editar   Alta / edición de residente
  medicamento/editar
  cuidado/nuevo
src/components/     Componentes de interfaz
src/lib/            Tipos, almacenamiento (store.tsx), fechas, datos demo
```
