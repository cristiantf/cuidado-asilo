# Casos de uso — Cuidado Asilo

## Actores

| Actor | Tipo | Descripción |
|---|---|---|
| **Cuidador/a** | Principal | Administra medicación y registra cuidados |
| **Enfermero/a** | Principal | Gestiona tratamientos y signos vitales (hereda lo del cuidador) |
| **Coordinador/a** | Principal | Gestiona residentes y ajustes (hereda lo del enfermero) |
| **Sistema operativo del teléfono** | Secundario | Muestra las notificaciones programadas |
| **Reloj** | Secundario (temporal) | Hace que las tomas pasen a *atrasada* y dispara los avisos |

> La app no tiene inicio de sesión: los roles son organizativos. El diagrama de casos de uso está en [diagramas-uml.md](diagramas-uml.md#1-diagrama-de-casos-de-uso).

## Lista de casos de uso

| ID | Caso de uso | Actor principal | Historias |
|---|---|---|---|
| CU-01 | Consultar tomas del día | Cuidador/a | HU-01, HU-05, HU-06 |
| CU-02 | Registrar administración de una toma | Cuidador/a | HU-02 |
| CU-03 | Registrar omisión de una toma | Cuidador/a | HU-03 |
| CU-04 | Deshacer registro de toma | Cuidador/a | HU-04 |
| CU-05 | Gestionar residente (alta/edición/baja) | Coordinador/a | HU-08, HU-09 |
| CU-06 | Buscar y consultar residente | Cuidador/a | HU-10, HU-11, HU-12 |
| CU-07 | Gestionar medicamento | Enfermero/a | HU-13, HU-14, HU-15 |
| CU-08 | Registrar cuidado / signos vitales | Cuidador/a | HU-16, HU-17, HU-18 |
| CU-09 | Consultar bitácora | Coordinador/a | HU-19 |
| CU-10 | Configurar cuidador en turno | Cuidador/a | HU-20 |
| CU-11 | Configurar recordatorios | Cuidador/a | HU-07 |
| CU-12 | Recibir y abrir recordatorio | SO / Cuidador/a | HU-07 |
| CU-13 | Gestionar datos (ejemplo / borrar) | Coordinador/a | HU-21, HU-22 |

---

## CU-01 · Consultar tomas del día

| | |
|---|---|
| **Actor** | Cuidador/a |
| **Precondición** | Existen residentes con medicamentos activos |
| **Postcondición** | El cuidador conoce qué tomas faltan |

**Flujo principal**
1. El cuidador abre la pestaña **Hoy**.
2. El sistema calcula las tomas del día a partir de los medicamentos activos y sus horarios.
3. El sistema determina el estado de cada toma (dada, omitida, pendiente o atrasada si pasaron más de 30 min).
4. El sistema muestra el resumen por estado y la lista filtrada en *Por hacer*.
5. El cuidador revisa la lista.

**Flujos alternativos**
- 4a. No hay medicamentos: se muestra "No hay medicamentos programados…".
- 4b. Todo registrado: se muestra "¡Todo al día!".
- 5a. El cuidador cambia el filtro a *Registradas* o *Todas*.

**Reglas**: RN-01 tolerancia de 30 min; RN-02 los medicamentos suspendidos no generan tomas.

---

## CU-02 · Registrar administración de una toma

| | |
|---|---|
| **Actor** | Cuidador/a |
| **Precondición** | La toma está *pendiente* o *atrasada* |
| **Postcondición** | Existe un registro `dada` con fecha/hora y cuidador |

**Flujo principal**
1. El cuidador localiza la toma (en Hoy o en la ficha del residente).
2. Verifica residente, alergias, medicamento, dosis e indicaciones.
3. Administra el medicamento y pulsa **✓ Administrada**.
4. El sistema crea el registro con el cuidador en turno y la hora actual.
5. El sistema guarda los datos y muestra la tarjeta en verde con la hora de registro.

**Flujos alternativos**
- 3a. Ya existía un registro para esa toma: se reemplaza (RN-03).

---

## CU-03 · Registrar omisión de una toma

Igual que CU-02, pero en el paso 3 el cuidador pulsa **Omitir** y el registro queda con estado `omitida` (tarjeta ámbar).

---

## CU-04 · Deshacer registro de toma

| | |
|---|---|
| **Precondición** | La toma tiene registro (dada u omitida) |
| **Postcondición** | El registro se elimina |

**Flujo principal**
1. El cuidador pulsa **Deshacer** en la tarjeta.
2. El sistema elimina el registro.
3. El sistema recalcula el estado (pendiente o atrasada) y lo muestra.

---

## CU-05 · Gestionar residente

**Flujo principal (alta)**
1. El coordinador pulsa **+ Nuevo residente** en Residentes.
2. Completa nombre, edad, habitación, alergias, condiciones, contacto y notas.
3. Pulsa **Guardar**.
4. El sistema valida que el nombre no esté vacío.
5. El sistema crea el residente y abre su ficha.

**Flujos alternativos**
- 4a. Nombre vacío: se muestra "Falta el nombre" y no se guarda.
- **Edición**: desde la ficha, **Editar** → modificar → **Guardar** → vuelve a la ficha.
- **Baja**: en edición, **Eliminar residente** → confirmación → se eliminan el residente y, en cascada, sus medicamentos, tomas y cuidados (RN-05) → vuelve a Residentes. Si cancela, no ocurre nada.

---

## CU-06 · Buscar y consultar residente

1. El cuidador abre **Residentes** (ordenados por habitación).
2. Opcionalmente escribe un nombre o habitación en la búsqueda.
3. El sistema filtra la lista; cada tarjeta muestra atrasadas, pendientes y alergias.
4. El cuidador toca un residente.
5. El sistema muestra la ficha: datos, tomas de hoy, medicamentos y últimos 10 cuidados.

- 3a. Sin coincidencias: "Sin resultados."

---

## CU-07 · Gestionar medicamento

| | |
|---|---|
| **Actor** | Enfermero/a |
| **Precondición** | Existe el residente |
| **Postcondición** | El medicamento queda guardado; la agenda y los avisos se actualizan |

**Flujo principal (alta)**
1. En la ficha, el enfermero pulsa **+ Medicamento**.
2. Escribe nombre y dosis; elige la vía.
3. Selecciona horas rápidas y/o escribe una hora libre y pulsa **Agregar**.
4. Escribe indicaciones y deja *Tratamiento activo* encendido.
5. Pulsa **Guardar**.
6. El sistema valida (RN-06) y guarda.
7. El sistema reprograma los recordatorios (incluye CU-11 si están activos).

**Flujos alternativos**
- 3a. Hora inválida: aviso "Hora no válida".
- 6a. Sin nombre o sin horarios: aviso y no se guarda.
- **Edición**: tocar el medicamento en la ficha → modificar → Guardar.
- **Suspender**: apagar *Tratamiento activo* → Guardar.
- **Eliminar**: **Eliminar medicamento** → confirmación → se borra (el historial de tomas se conserva).

---

## CU-08 · Registrar cuidado / signos vitales

1. En la ficha, el cuidador pulsa **+ Cuidado**.
2. Elige el tipo (por defecto *Signos vitales*).
3. Si es *Signos vitales*, completa los valores que tenga.
4. Escribe observaciones.
5. Pulsa **Guardar registro**.
6. El sistema valida (RN-07), guarda con hora y cuidador, y vuelve a la ficha.

- 6a. Sin detalle ni signos: aviso "Registro vacío".
- 2a. *Incidente / caída*: el registro se mostrará resaltado en rojo.

---

## CU-09 · Consultar bitácora

1. El coordinador abre **Bitácora**.
2. Elige *Cuidados* o *Medicación*.
3. Opcionalmente elige un residente.
4. El sistema muestra los últimos 100 registros, del más reciente al más antiguo.
5. Opcionalmente elimina un cuidado con **✕** (con confirmación).

---

## CU-10 · Configurar cuidador en turno

1. En **Ajustes**, el cuidador escribe su nombre (p. ej. "Carmen — turno mañana").
2. Pulsa **Guardar**.
3. El sistema guarda el nombre; los siguientes registros lo incluirán.

---

## CU-11 · Configurar recordatorios

| | |
|---|---|
| **Precondición** | App ejecutándose en Android o iOS |
| **Postcondición** | Hay un aviso diario por cada hora con tomas activas |

**Flujo principal**
1. En **Ajustes**, el cuidador enciende *Activar recordatorios*.
2. El sistema solicita permiso de notificaciones al SO.
3. El cuidador acepta.
4. El sistema guarda la configuración y programa los avisos.
5. El cuidador elige la anticipación (a la hora, 5, 10, 15 o 30 min).
6. El sistema reprograma y muestra cuántos avisos diarios hay.
7. Opcionalmente pulsa **Enviar aviso de prueba**.

**Flujos alternativos**
- 1a. En navegador: se muestra que los recordatorios solo funcionan en el teléfono.
- 3a. Permiso denegado: aviso "Permiso denegado" y el interruptor queda apagado.
- 1b. Apagar: se cancelan todos los avisos de la app.

---

## CU-12 · Recibir y abrir recordatorio

1. Llega la hora programada; el SO muestra la notificación con las tomas de esa hora.
2. El cuidador toca la notificación.
3. La app se abre en **Hoy**.
4. Continúa con CU-02 / CU-03.

---

## CU-13 · Gestionar datos

- **Cargar ejemplo**: Ajustes → *Cargar datos de ejemplo* → confirmar → se reemplazan los datos (se conserva la configuración de recordatorios).
- **Borrar todo**: Ajustes → *Borrar todos los residentes* → confirmar → se eliminan residentes y todo lo asociado.

---

## Reglas de negocio

| ID | Regla |
|---|---|
| RN-01 | Una toma sin registro pasa a *atrasada* 30 min después de su hora (o si es de un día anterior) |
| RN-02 | Los medicamentos con `activo = false` no generan tomas ni avisos |
| RN-03 | Solo hay un registro por (medicamento, fecha, hora); registrar otra vez reemplaza el anterior |
| RN-04 | Cada registro guarda el nombre del cuidador en turno y la hora real |
| RN-05 | Eliminar un residente elimina en cascada sus medicamentos, tomas y cuidados |
| RN-06 | Un medicamento requiere nombre y al menos un horario válido en formato 24 h |
| RN-07 | Un cuidado requiere detalle o al menos un signo vital |
| RN-08 | Los avisos de una misma hora se agrupan en una sola notificación diaria |
| RN-09 | Los datos se guardan únicamente en el dispositivo |
