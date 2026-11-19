# Historias de usuario — Cuidado Asilo

## Roles

| Rol | Descripción |
|---|---|
| **Cuidador/a** | Personal de turno que da la medicación y realiza los cuidados diarios |
| **Enfermero/a** | Registra y ajusta tratamientos, revisa signos vitales e historial |
| **Coordinador/a** | Administra residentes y configura el dispositivo |

Formato: *Como **rol**, quiero **acción**, para **beneficio**.* Prioridad MoSCoW: **M** (debe), **S** (debería), **C** (podría). Estado: ✅ implementado · 🔜 pendiente.

---

## Épica 1 — Medicación diaria

### HU-01 · Ver las tomas del día ✅ (M)
Como **cuidador/a**, quiero ver en una sola pantalla todas las tomas de hoy ordenadas por hora, para saber qué medicamento dar a cada residente.

**Criterios de aceptación**
- Dado que hay medicamentos activos, cuando abro la pestaña **Hoy**, entonces veo cada toma con hora, residente, habitación, medicamento, dosis, vía e indicaciones.
- Las tomas se ordenan por hora y luego por nombre.
- Arriba veo cuántas están atrasadas, pendientes, dadas y omitidas.
- Los medicamentos suspendidos no aparecen.

### HU-02 · Registrar una toma administrada ✅ (M)
Como **cuidador/a**, quiero marcar una toma como administrada con un toque, para dejar constancia de que la di.

**Criterios**
- Al pulsar **✓ Administrada** la tarjeta pasa a verde, muestra fecha/hora del registro y mi nombre.
- El registro se conserva al cerrar y abrir la app.

### HU-03 · Registrar una toma omitida ✅ (M)
Como **cuidador/a**, quiero marcar que una toma no se dio (rechazo, ayuno, ausencia), para que quede registrado.

**Criterios**
- Al pulsar **Omitir** la tarjeta pasa a ámbar con el estado *Omitida*.

### HU-04 · Corregir un registro ✅ (M)
Como **cuidador/a**, quiero deshacer un registro equivocado, para corregir errores.

**Criterios**
- Al pulsar **Deshacer** la toma vuelve a *Pendiente* o *Atrasada* y desaparece del historial.

### HU-05 · Ver tomas atrasadas ✅ (M)
Como **cuidador/a**, quiero que las tomas no registradas 30 minutos después de su hora se marquen como atrasadas, para priorizarlas.

**Criterios**
- Se muestran en rojo con la etiqueta *Atrasada*.
- La pestaña **Hoy** muestra un número con la cantidad de atrasadas.
- El estado se actualiza solo cada minuto.

### HU-06 · Filtrar la agenda ✅ (S)
Como **cuidador/a**, quiero filtrar entre *Por hacer*, *Registradas* y *Todas*, para concentrarme en lo pendiente.

### HU-07 · Recibir recordatorios ✅ (S)
Como **cuidador/a**, quiero que el teléfono me avise a la hora de cada toma aunque la app esté cerrada, para no olvidar ninguna.

**Criterios**
- Se activan en Ajustes y piden permiso al sistema.
- Puedo elegir avisar a la hora o 5, 10, 15 o 30 min antes.
- Las tomas de la misma hora llegan en un solo aviso con la lista de residentes.
- Al tocar el aviso se abre la pantalla Hoy.
- Si cambio medicamentos, los avisos se actualizan solos.
- Puedo enviar un aviso de prueba.

---

## Épica 2 — Residentes

### HU-08 · Registrar un residente ✅ (M)
Como **coordinador/a**, quiero dar de alta un residente con nombre, edad, habitación, alergias, diagnósticos, contacto de emergencia y notas, para tener su información a mano.

**Criterios**
- El nombre es obligatorio; si falta, se muestra un aviso.
- Al guardar se abre su ficha.

### HU-09 · Editar y eliminar un residente ✅ (M)
Como **coordinador/a**, quiero editar los datos o eliminar a un residente que ya no está, para mantener la lista al día.

**Criterios**
- Eliminar pide confirmación y borra también sus medicamentos y registros.

### HU-10 · Buscar residentes ✅ (S)
Como **cuidador/a**, quiero buscar por nombre o habitación, para encontrar rápido a un residente.

### HU-11 · Ver alergias de forma destacada ✅ (M)
Como **enfermero/a**, quiero ver las alergias en rojo en la lista, la ficha y cada toma, para evitar errores de medicación.

### HU-12 · Ver la ficha completa ✅ (M)
Como **enfermero/a**, quiero ver en la ficha del residente sus datos, tomas de hoy, medicamentos y últimos cuidados, para tener una visión completa.

---

## Épica 3 — Tratamientos

### HU-13 · Agregar un medicamento ✅ (M)
Como **enfermero/a**, quiero registrar un medicamento con dosis, vía, horarios e indicaciones, para que aparezca en la agenda diaria.

**Criterios**
- Puedo elegir horas rápidas (06:00, 08:00, 12:00…) o escribir otra en formato 24 h.
- Nombre y al menos un horario son obligatorios.
- Una hora inválida (p. ej. 25:00) muestra un aviso.

### HU-14 · Suspender un medicamento ✅ (M)
Como **enfermero/a**, quiero suspender un tratamiento sin borrarlo, para poder reactivarlo después.

**Criterios**
- Con *Tratamiento activo* apagado deja de aparecer en Hoy y en los avisos; en la ficha se ve como *Suspendido*.

### HU-15 · Editar o eliminar un medicamento ✅ (M)
Como **enfermero/a**, quiero cambiar la dosis u horarios o eliminar un medicamento, para reflejar cambios de prescripción.

---

## Épica 4 — Cuidados y bitácora

### HU-16 · Registrar signos vitales ✅ (M)
Como **enfermero/a**, quiero anotar presión, pulso, temperatura, saturación y glucosa, para hacer seguimiento clínico.

**Criterios**
- No puedo guardar un registro sin ningún dato.

### HU-17 · Registrar otros cuidados ✅ (M)
Como **cuidador/a**, quiero registrar higiene, alimentación, movilidad, curaciones, ánimo y otros, para documentar la atención diaria.

### HU-18 · Registrar incidentes y caídas ✅ (M)
Como **cuidador/a**, quiero registrar una caída o incidente de forma destacada, para que el resto del equipo lo vea.

**Criterios**
- Los incidentes se muestran con fondo rojo en la ficha y la bitácora.

### HU-19 · Consultar la bitácora ✅ (S)
Como **coordinador/a**, quiero ver el historial de cuidados y de medicación, filtrado por residente, para revisar lo ocurrido en otros turnos.

---

## Épica 5 — Configuración

### HU-20 · Identificar al cuidador en turno ✅ (M)
Como **cuidador/a**, quiero indicar mi nombre al empezar el turno, para que mis registros queden firmados.

### HU-21 · Datos de ejemplo ✅ (C)
Como **coordinador/a**, quiero cargar datos de ejemplo, para capacitar al personal sin usar datos reales.

### HU-22 · Borrar todos los datos ✅ (C)
Como **coordinador/a**, quiero borrar todos los residentes, para empezar de cero.

---

## Backlog (pendientes)

| ID | Historia | Prioridad |
|---|---|---|
| HU-23 | Como coordinador/a, quiero sincronizar los datos entre varios teléfonos, para que todos los turnos vean lo mismo | 🔜 M |
| HU-24 | Como coordinador/a, quiero exportar el historial a PDF/CSV, para entregarlo al médico o a la familia | 🔜 S |
| HU-25 | Como enfermero/a, quiero registrar medicación "si es necesario" (PRN) sin horario fijo | 🔜 S |
| HU-26 | Como coordinador/a, quiero controlar el stock de cada medicamento y recibir alerta de reposición | 🔜 C |
| HU-27 | Como cuidador/a, quiero agregar una nota al omitir una toma (motivo) | 🔜 S |
| HU-28 | Como coordinador/a, quiero cuentas con contraseña y roles | 🔜 S |
| HU-29 | Como enfermero/a, quiero ver gráficas de evolución de signos vitales | 🔜 C |
