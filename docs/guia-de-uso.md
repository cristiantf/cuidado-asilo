# Guía de uso — Cuidado Asilo

Manual para el personal del asilo: cuidadores/as, enfermería y coordinación.

> **Importante:** la app ayuda a organizar y registrar, pero **no reemplaza la prescripción médica**. Verifica siempre la indicación del médico antes de administrar.

---

## 1. Primeros pasos

### 1.1 Instalar y abrir

- **Versión de prueba**: instala **Expo Go** desde Google Play o App Store, y escanea el código QR que te dé el equipo técnico.
- **Versión instalada**: abre el icono **Cuidado Asilo**.

La primera vez la app muestra **dos residentes de ejemplo** (María López y José Ramírez) para practicar. Cuando quieras empezar con datos reales, ve a **Ajustes → Borrar todos los residentes**.

### 1.2 Las cuatro pestañas

| Pestaña | Para qué sirve |
|---|---|
| 💊 **Hoy** | Lista de medicamentos a dar hoy, por hora |
| 👥 **Residentes** | Lista de residentes y sus fichas |
| 📋 **Bitácora** | Historial de cuidados y de medicación |
| ⚙️ **Ajustes** | Tu nombre, recordatorios y datos |

Si la pestaña **Hoy** muestra un número rojo, ese es el número de tomas **atrasadas**.

### 1.3 Al empezar cada turno

1. Abre **Ajustes**.
2. En *Cuidador/a en turno* escribe tu nombre, por ejemplo `Carmen — turno mañana`.
3. Pulsa **Guardar**.

Todo lo que registres desde ese momento quedará con tu nombre.

---

## 2. Dar la medicación (pestaña Hoy)

### 2.1 Entender la pantalla

Arriba ves cuatro contadores:

| Color | Estado | Significado |
|---|---|---|
| 🔴 Rojo | **Atrasada** | Pasaron más de 30 minutos de la hora y no se registró |
| 🔵 Azul | **Pendiente** | Aún no es la hora o está dentro de los 30 minutos |
| 🟢 Verde | **Administrada** | Ya se dio |
| 🟡 Ámbar | **Omitida** | No se dio (y quedó registrado) |

Debajo hay tres filtros:
- **Por hacer** (por defecto): solo pendientes y atrasadas.
- **Registradas**: solo las dadas u omitidas.
- **Todas**.

Cada tarjeta muestra: **hora**, **residente y habitación**, **medicamento, dosis y vía**, **indicaciones** y **alergias en rojo**.

### 2.2 Registrar que diste un medicamento

1. Busca la tarjeta del residente y la hora.
2. Comprueba nombre, alergias, medicamento y dosis.
3. Da el medicamento.
4. Pulsa **✓ Administrada**.

La tarjeta se pone verde y muestra la hora del registro y tu nombre.

### 2.3 Registrar que NO se dio

Si el residente lo rechaza, está en ayunas, dormido o fuera del asilo:

1. Pulsa **Omitir**.
2. Recomendado: anota el motivo en un **cuidado** (ver sección 4) en la ficha del residente.

### 2.4 Me equivoqué

Pulsa **Deshacer** en la tarjeta. La toma vuelve a quedar pendiente (o atrasada) y el registro se borra.

---

## 3. Residentes

### 3.1 Buscar un residente

En **Residentes** escribe parte del nombre o el número de habitación en el buscador. La lista se ordena por habitación y cada tarjeta indica si tiene tomas atrasadas o pendientes y sus alergias.

### 3.2 Agregar un residente

1. Pulsa **+ Nuevo residente**.
2. Completa los datos (solo el **nombre** es obligatorio):
   - Edad y habitación.
   - **Alergias** (aparecerán en rojo en todas partes).
   - Condiciones o diagnósticos.
   - Contacto de emergencia: nombre, parentesco y teléfono.
   - Notas: dieta, movilidad, preferencias.
3. Pulsa **Guardar**. Se abrirá su ficha.

### 3.3 La ficha del residente

Al tocar un residente ves:
- Sus datos, con **alergias en rojo**.
- Botones **+ Cuidado** y **+ Medicamento**.
- **Tomas de hoy** (puedes registrarlas desde aquí también).
- **Medicamentos** (los suspendidos aparecen atenuados).
- **Últimos cuidados** registrados.

### 3.4 Editar o eliminar un residente

En la ficha pulsa **Editar**, cambia lo necesario y **Guardar**.
Para eliminarlo, pulsa **Eliminar residente** y confirma.

> ⚠️ Eliminar un residente borra también **todos** sus medicamentos e historial. No se puede deshacer.

---

## 4. Medicamentos

### 4.1 Agregar un medicamento

1. En la ficha del residente pulsa **+ Medicamento**.
2. Escribe el **nombre** (obligatorio) y la **dosis** (p. ej. `50 mg`, `1 tableta`).
3. Elige la **vía**: Oral, Sublingual, Inyectable, Tópica, Inhalada, Gotas u Otra.
4. Elige los **horarios** tocando las horas (06:00, 08:00, 12:00…). Toca otra vez para quitar una.
5. Si necesitas otra hora, escríbela en *Otra hora (24 h)*, por ejemplo `07:30` o `21:00`, y pulsa **Agregar**.
6. Escribe las **indicaciones** (p. ej. "con alimentos", "medir presión antes").
7. Pulsa **Guardar**.

El medicamento aparecerá en **Hoy** en cada horario elegido.

> Las horas se escriben en formato de 24 horas: las 9 de la noche son `21:00`.

### 4.2 Cambiar dosis u horario

En la ficha, toca el medicamento, modifica y pulsa **Guardar**.

### 4.3 Suspender un tratamiento

Si el médico suspende un medicamento temporalmente, toca el medicamento, **apaga *Tratamiento activo*** y guarda. Ya no aparecerá en Hoy ni en los recordatorios, pero se conserva para reactivarlo.

### 4.4 Eliminar un medicamento

Toca el medicamento → **Eliminar medicamento** → confirmar. El historial de tomas anteriores se conserva.

---

## 5. Registrar cuidados

1. En la ficha del residente pulsa **+ Cuidado**.
2. Elige el tipo:

| Tipo | Ejemplo de detalle |
|---|---|
| ❤️ Signos vitales | Completa presión (`120/80`), pulso, temperatura, saturación, glucosa |
| 🧼 Higiene | "Baño completo, cambio de ropa de cama" |
| 🍽️ Alimentación | "Comió 75 % del almuerzo, buena hidratación" |
| 🚶 Movilidad / cambio de posición | "Cambio a decúbito lateral izquierdo" |
| 🩹 Curación | "Curación de úlcera sacra, buena evolución" |
| 🙂 Ánimo / conducta | "Tranquilo, participó en la actividad" |
| ⚠️ Incidente / caída | "Caída en el baño 10:15, sin lesiones, se avisó a la hija" |
| 📝 Otro | Cualquier otra observación |

3. Escribe las observaciones.
4. Pulsa **Guardar registro**.

En signos vitales no hace falta completar todo: basta con un valor o una observación.
Los **incidentes y caídas** se muestran con fondo rojo para que el resto del equipo los vea.

---

## 6. Bitácora

En **Bitácora** puedes revisar lo que pasó en otros turnos:

1. Elige **Cuidados** o **Medicación**.
2. Toca **Todos** o el nombre de un residente para filtrar.

Se muestran los últimos 100 registros, del más reciente al más antiguo, con fecha, hora y quién lo registró.
Para borrar un cuidado registrado por error, toca la **✕** de la tarjeta y confirma.

---

## 7. Recordatorios

El teléfono puede avisarte a la hora de cada toma, **aunque la app esté cerrada**.

### 7.1 Activarlos

1. Ve a **Ajustes → Recordatorios de medicación**.
2. Enciende **Activar recordatorios**.
3. Cuando el teléfono pregunte, pulsa **Permitir**.
4. Elige cuándo avisar: **A la hora**, **5**, **10**, **15** o **30 min antes**.
5. Pulsa **Enviar aviso de prueba**: en unos segundos debe llegar una notificación.

Debajo verás cuántos avisos diarios hay programados.

### 7.2 Cómo funcionan

- Llega **un aviso por hora** con la lista de residentes y medicamentos de esa hora.
- Al tocar el aviso se abre la pantalla **Hoy**.
- Si agregas, cambias o suspendes medicamentos, los avisos se actualizan solos.
- El aviso suena todos los días aunque ya hayas registrado la toma: revisa siempre **Hoy**.

### 7.3 Si no llegan los avisos

| Problema | Solución |
|---|---|
| Dice "Permiso denegado" | Ajustes del teléfono → Aplicaciones → Cuidado Asilo (o Expo Go) → Notificaciones → Permitir; luego vuelve a activar |
| No suenan | Revisa que el teléfono no esté en silencio o en "No molestar" |
| Llegan unos minutos tarde (Android) | Es normal en Android 12+ por ahorro de batería. Quita la optimización de batería para la app |
| En el navegador no aparecen | Los recordatorios solo funcionan en el teléfono |

---

## 8. Ajustes de datos

- **Cargar datos de ejemplo**: reemplaza todo por los residentes de prueba. Útil para capacitar personal.
- **Borrar todos los residentes**: elimina todo. No se puede deshacer.

> ⚠️ Los datos se guardan **solo en este teléfono**. Si se pierde, se rompe o se desinstala la app, se pierden los datos. Usa siempre el mismo teléfono para el registro del asilo.

---

## 9. Preguntas frecuentes

**¿Por qué una toma aparece como atrasada si la di?**
Porque no se registró. Pulsa **✓ Administrada**: se guarda la hora real del registro.

**¿Puedo registrar una toma de ayer?**
No desde la pantalla Hoy, que muestra solo el día actual.

**¿Varios cuidadores pueden usar la app a la vez en distintos teléfonos?**
No: cada teléfono tiene sus propios datos. Usen un teléfono compartido por turno.

**¿Cómo pongo un medicamento "solo si hay dolor"?**
Por ahora no hay medicación "si es necesario". Regístralo como **cuidado** de tipo *Otro* indicando medicamento, dosis y motivo.

---

## 10. Resumen rápido

| Quiero… | Dónde |
|---|---|
| Ver qué dar ahora | **Hoy** → Por hacer |
| Marcar que lo di | **✓ Administrada** |
| Marcar que no se dio | **Omitir** |
| Corregir un error | **Deshacer** |
| Agregar un residente | **Residentes → + Nuevo residente** |
| Agregar un medicamento | Ficha → **+ Medicamento** |
| Anotar presión, comida, caída… | Ficha → **+ Cuidado** |
| Ver lo del turno anterior | **Bitácora** |
| Poner mi nombre | **Ajustes → Cuidador/a en turno** |
| Activar avisos | **Ajustes → Recordatorios** |
