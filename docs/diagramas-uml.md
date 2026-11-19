# Diagramas UML — Cuidado Asilo

Los diagramas están escritos en **Mermaid**, que GitHub, GitLab, VS Code (con la extensión *Markdown Preview Mermaid Support*) y Obsidian dibujan automáticamente. También se pueden pegar en <https://mermaid.live> para exportarlos como imagen.

Índice:
1. [Casos de uso](#1-diagrama-de-casos-de-uso)
2. [Clases (modelo de dominio)](#2-diagrama-de-clases-modelo-de-dominio)
3. [Clases (módulos de la aplicación)](#3-diagrama-de-clases-módulos-de-la-aplicación)
4. [Componentes](#4-diagrama-de-componentes)
5. [Secuencia: arranque de la app](#5-secuencia-arranque-de-la-app)
6. [Secuencia: registrar una toma](#6-secuencia-registrar-una-toma)
7. [Secuencia: configurar y recibir recordatorios](#7-secuencia-configurar-y-recibir-recordatorios)
8. [Estados de una toma](#8-diagrama-de-estados-de-una-toma)
9. [Actividad: ronda de medicación](#9-diagrama-de-actividad-ronda-de-medicación)
10. [Actividad: alta de medicamento](#10-diagrama-de-actividad-alta-de-medicamento)
11. [Navegación](#11-diagrama-de-navegación)
12. [Despliegue](#12-diagrama-de-despliegue)

---

## 1. Diagrama de casos de uso

Mermaid no tiene un tipo nativo de casos de uso; se representa con actores (rectángulos) y casos de uso (óvalos) dentro del límite del sistema.

```mermaid
flowchart LR
    Cuidador["👤 Cuidador/a"]
    Enfermero["👤 Enfermero/a"]
    Coordinador["👤 Coordinador/a"]
    SO["⚙️ SO del teléfono"]
    Reloj["⏰ Reloj"]

    subgraph Sistema["Cuidado Asilo"]
        CU01(["CU-01 Consultar tomas del día"])
        CU02(["CU-02 Registrar administración"])
        CU03(["CU-03 Registrar omisión"])
        CU04(["CU-04 Deshacer registro"])
        CU05(["CU-05 Gestionar residente"])
        CU06(["CU-06 Buscar y consultar residente"])
        CU07(["CU-07 Gestionar medicamento"])
        CU08(["CU-08 Registrar cuidado / signos"])
        CU09(["CU-09 Consultar bitácora"])
        CU10(["CU-10 Configurar cuidador en turno"])
        CU11(["CU-11 Configurar recordatorios"])
        CU12(["CU-12 Recibir y abrir recordatorio"])
        CU13(["CU-13 Gestionar datos"])
        REP(["Reprogramar avisos"])
    end

    Enfermero -. hereda .-> Cuidador
    Coordinador -. hereda .-> Enfermero

    Cuidador --- CU01
    Cuidador --- CU02
    Cuidador --- CU03
    Cuidador --- CU04
    Cuidador --- CU06
    Cuidador --- CU08
    Cuidador --- CU10
    Cuidador --- CU11
    Cuidador --- CU12
    Enfermero --- CU07
    Coordinador --- CU05
    Coordinador --- CU09
    Coordinador --- CU13

    CU02 -. extend .-> CU01
    CU03 -. extend .-> CU01
    CU04 -. extend .-> CU01
    CU07 -. include .-> REP
    CU11 -. include .-> REP
    CU12 -. extend .-> CU01
    SO --- CU12
    Reloj --- CU01
```

---

## 2. Diagrama de clases (modelo de dominio)

```mermaid
classDiagram
    direction LR

    class Datos {
        +Paciente[] pacientes
        +Medicamento[] medicamentos
        +Administracion[] administraciones
        +Cuidado[] cuidados
        +string cuidadorActual
        +Recordatorios recordatorios
    }

    class Paciente {
        +string id
        +string nombre
        +string edad
        +string habitacion
        +string alergias
        +string condiciones
        +string contactoEmergencia
        +string notas
        +number creadoEn
    }

    class Medicamento {
        +string id
        +string pacienteId
        +string nombre
        +string dosis
        +string via
        +string[] horarios
        +string indicaciones
        +boolean activo
    }

    class Administracion {
        +string id
        +string medicamentoId
        +string pacienteId
        +string fecha
        +string hora
        +EstadoDosis estado
        +number registradoEn
        +string cuidador
        +string nota
    }

    class Cuidado {
        +string id
        +string pacienteId
        +TipoCuidado tipo
        +string detalle
        +SignosVitales signos
        +number registradoEn
        +string cuidador
    }

    class SignosVitales {
        +string presion
        +string pulso
        +string temperatura
        +string saturacion
        +string glucosa
    }

    class Recordatorios {
        +boolean activos
        +number anticipoMin
    }

    class Toma {
        <<derivada>>
        +string clave
        +string hora
        +EstadoToma estado
    }

    class EstadoDosis {
        <<enumeration>>
        dada
        omitida
    }

    class EstadoToma {
        <<enumeration>>
        pendiente
        atrasada
        dada
        omitida
    }

    class TipoCuidado {
        <<enumeration>>
        SignosVitales
        Higiene
        Alimentacion
        Movilidad
        Curacion
        AnimoConducta
        IncidenteCaida
        Otro
    }

    Datos "1" *-- "0..*" Paciente
    Datos "1" *-- "0..*" Medicamento
    Datos "1" *-- "0..*" Administracion
    Datos "1" *-- "0..*" Cuidado
    Datos "1" *-- "1" Recordatorios
    Paciente "1" -- "0..*" Medicamento : recibe
    Paciente "1" -- "0..*" Cuidado : recibe
    Medicamento "1" -- "0..*" Administracion : se registra en
    Cuidado "1" o-- "0..1" SignosVitales
    Toma ..> Paciente
    Toma ..> Medicamento
    Toma ..> "0..1" Administracion : registro
    Administracion --> EstadoDosis
    Toma --> EstadoToma
    Cuidado --> TipoCuidado
```

---

## 3. Diagrama de clases (módulos de la aplicación)

```mermaid
classDiagram
    direction TB

    class DatosProvider {
        <<React Context>>
        -Datos datos
        -boolean cargando
        -number reloj
        -number avisosProgramados
        +guardarPaciente(p) string
        +eliminarPaciente(id)
        +guardarMedicamento(m)
        +eliminarMedicamento(id)
        +registrarToma(toma, estado, nota)
        +deshacerToma(registroId)
        +registrarCuidado(c)
        +eliminarCuidado(id)
        +setCuidador(nombre)
        +setRecordatorios(r)
        +tomasDelDia(fecha, pacienteId) Toma[]
        +reiniciarDemo()
    }

    class useDatos {
        <<hook>>
        +useDatos() Store
    }

    class recordatorios {
        <<módulo>>
        +notificacionesDisponibles boolean
        +tienePermiso() Promise~boolean~
        +pedirPermiso() Promise~boolean~
        +reprogramar(meds, pacientes, config) Promise~number~
        +notificacionDePrueba() Promise~void~
    }

    class fechas {
        <<módulo>>
        +claveDia(d) string
        +horaActual(d) string
        +minutosDe(hora) number
        +normalizarHora(texto) string
        +formatoFechaHora(ts) string
        +fechaLarga(d) string
        +nuevoId() string
    }

    class demo {
        <<módulo>>
        +datosDemo() Datos
    }

    class AsyncStorage {
        <<externo>>
        +getItem(clave)
        +setItem(clave, valor)
    }

    class ExpoNotifications {
        <<externo>>
        +scheduleNotificationAsync()
        +cancelScheduledNotificationAsync()
        +getAllScheduledNotificationsAsync()
        +requestPermissionsAsync()
    }

    class Pantallas {
        <<src/app>>
        Hoy
        Residentes
        Bitacora
        Ajustes
        FichaPaciente
        EditarPaciente
        EditarMedicamento
        NuevoCuidado
    }

    class Componentes {
        <<src/components>>
        TomaItem
        CuidadoItem
        Boton
        Campo
        Chip
        Tarjeta
    }

    Pantallas ..> useDatos
    Componentes ..> useDatos
    Pantallas ..> Componentes
    useDatos ..> DatosProvider
    DatosProvider ..> AsyncStorage
    DatosProvider ..> recordatorios
    DatosProvider ..> fechas
    DatosProvider ..> demo
    recordatorios ..> ExpoNotifications
```

---

## 4. Diagrama de componentes

```mermaid
flowchart TB
    subgraph Presentacion["Presentación"]
        direction LR
        Router["Expo Router<br/>_layout.tsx"]
        Tabs["Pestañas<br/>Hoy · Residentes · Bitácora · Ajustes"]
        Modales["Formularios<br/>residente · medicamento · cuidado"]
        Comp["Componentes UI<br/>TomaItem · CuidadoItem · ui.tsx"]
    end

    subgraph Logica["Estado y lógica"]
        Store["DatosProvider<br/>store.tsx"]
        Fechas["fechas.ts"]
        Demo["demo.ts"]
    end

    subgraph Servicios["Servicios del dispositivo"]
        Rec["recordatorios.ts"]
        AS[("AsyncStorage<br/>cuidado-asilo:v1")]
        Notif["expo-notifications"]
    end

    Router --> Tabs
    Router --> Modales
    Tabs --> Comp
    Modales --> Comp
    Tabs -- useDatos --> Store
    Modales -- useDatos --> Store
    Comp -- useDatos --> Store
    Store --> Fechas
    Store --> Demo
    Store -- guarda/carga JSON --> AS
    Store -- reprogramar --> Rec
    Rec --> Notif
    Notif -- toque en aviso --> Router
```

---

## 5. Secuencia: arranque de la app

```mermaid
sequenceDiagram
    autonumber
    participant SO as Sistema operativo
    participant L as _layout.tsx
    participant P as DatosProvider
    participant AS as AsyncStorage
    participant R as recordatorios.ts
    participant H as Pantalla Hoy

    SO->>L: abrir app
    L->>P: montar DatosProvider
    P->>AS: getItem("cuidado-asilo:v1")
    alt hay datos guardados
        AS-->>P: JSON
        P->>P: setDatos({...VACIO, ...guardado})
    else primera vez o error
        AS-->>P: null
        P->>P: setDatos(datosDemo())
    end
    P->>P: cargando = false
    P->>AS: setItem(datos)
    P->>R: reprogramar(medicamentos, pacientes, recordatorios)
    R-->>P: n avisos
    L->>H: mostrar pestañas
    H->>P: tomasDelDia()
    P-->>H: Toma[] con estados
    loop cada 60 s
        P->>P: reloj = ahora
        P-->>H: re-render (pendiente → atrasada)
    end
```

---

## 6. Secuencia: registrar una toma

```mermaid
sequenceDiagram
    autonumber
    actor C as Cuidador/a
    participant T as TomaItem
    participant P as DatosProvider
    participant AS as AsyncStorage

    C->>T: pulsa "✓ Administrada"
    T->>P: registrarToma(toma, "dada")
    P->>P: quitar registro previo con (medicamento, fecha, hora)
    P->>P: agregar Administracion {estado: dada, cuidador, registradoEn}
    P->>AS: setItem(datos)
    P-->>T: nuevo estado
    T-->>C: tarjeta verde + hora + cuidador

    opt corrección
        C->>T: pulsa "Deshacer"
        T->>P: deshacerToma(registro.id)
        P->>AS: setItem(datos)
        P-->>T: estado pendiente / atrasada
    end
```

---

## 7. Secuencia: configurar y recibir recordatorios

```mermaid
sequenceDiagram
    autonumber
    actor C as Cuidador/a
    participant A as Pantalla Ajustes
    participant R as recordatorios.ts
    participant N as expo-notifications
    participant P as DatosProvider
    participant SO as Sistema operativo
    participant L as _layout.tsx

    C->>A: activa "Activar recordatorios"
    A->>R: pedirPermiso()
    R->>N: setNotificationChannelAsync("tomas") [Android]
    R->>N: requestPermissionsAsync()
    N->>SO: diálogo de permiso
    SO-->>C: ¿Permitir notificaciones?
    C-->>SO: Permitir
    N-->>R: granted
    R-->>A: true
    A->>P: setRecordatorios({activos: true, anticipoMin})
    P->>R: reprogramar(medicamentos, pacientes, config)
    R->>N: cancelar avisos "toma-*"
    loop por cada hora distinta
        R->>N: scheduleNotificationAsync(id "toma-HH:MM", DAILY)
    end
    R-->>P: n
    P-->>A: avisosProgramados = n

    Note over SO: Llega la hora programada
    SO-->>C: notificación "💊 Hora de la medicación"
    C->>SO: toca la notificación
    SO->>L: NotificationResponse {data: {ruta: "/"}}
    L->>L: router.navigate("/")
    L-->>C: pantalla Hoy
```

---

## 8. Diagrama de estados de una toma

```mermaid
stateDiagram-v2
    [*] --> Pendiente : medicamento activo con horario hoy

    Pendiente --> Atrasada : pasan 30 min sin registro
    Pendiente --> Dada : "✓ Administrada"
    Pendiente --> Omitida : "Omitir"
    Atrasada --> Dada : "✓ Administrada"
    Atrasada --> Omitida : "Omitir"

    Dada --> Pendiente : "Deshacer" (antes de +30 min)
    Dada --> Atrasada : "Deshacer" (después de +30 min)
    Omitida --> Pendiente : "Deshacer" (antes de +30 min)
    Omitida --> Atrasada : "Deshacer" (después de +30 min)

    Pendiente --> [*] : medicamento suspendido o eliminado
    Atrasada --> [*] : medicamento suspendido o eliminado
    Dada --> [*] : fin del día
    Omitida --> [*] : fin del día
```

---

## 9. Diagrama de actividad: ronda de medicación

```mermaid
flowchart TD
    A([Inicio del turno]) --> B[Indicar nombre en Ajustes]
    B --> C[Abrir pestaña Hoy]
    C --> D{¿Hay tomas por hacer?}
    D -- No --> Z([Fin de la ronda])
    D -- Sí --> E[Tomar la primera: atrasadas y por hora]
    E --> F[Verificar residente, alergias, dosis e indicaciones]
    F --> G{¿Se puede administrar?}
    G -- Sí --> H[Administrar medicamento]
    H --> I[Pulsar ✓ Administrada]
    G -- No: rechazo, ayuno, ausencia --> J[Pulsar Omitir]
    J --> K[Registrar cuidado con el motivo]
    I --> L{¿Hubo error?}
    L -- Sí --> M[Pulsar Deshacer] --> E
    L -- No --> D
    K --> D
```

---

## 10. Diagrama de actividad: alta de medicamento

```mermaid
flowchart TD
    A([Ficha del residente]) --> B[Pulsar + Medicamento]
    B --> C[Escribir nombre y dosis]
    C --> D[Elegir vía]
    D --> E[Elegir horas rápidas]
    E --> F{¿Falta otra hora?}
    F -- Sí --> G[Escribir hora y pulsar Agregar]
    G --> H{¿Hora válida?}
    H -- No --> I[Aviso: Hora no válida] --> G
    H -- Sí --> F
    F -- No --> J[Escribir indicaciones]
    J --> K[Pulsar Guardar]
    K --> L{¿Nombre y al menos un horario?}
    L -- No --> M[Aviso de dato faltante] --> C
    L -- Sí --> N[Guardar medicamento]
    N --> O[Persistir en AsyncStorage]
    N --> P[Reprogramar recordatorios]
    O --> Q([Volver a la ficha])
    P --> Q
```

---

## 11. Diagrama de navegación

```mermaid
flowchart LR
    subgraph Tabs["Barra de pestañas"]
        Hoy["Hoy /"]
        Res["Residentes /pacientes"]
        Bit["Bitácora /registros"]
        Aj["Ajustes /ajustes"]
    end

    Ficha["Ficha /paciente/[id]"]
    EP["Editar residente (modal)"]
    EM["Medicamento (modal)"]
    NC["Registrar cuidado (modal)"]
    Notif(("Notificación"))

    Res -- tocar residente --> Ficha
    Res -- "+ Nuevo residente" --> EP
    EP -- guardar nuevo --> Ficha
    Ficha -- Editar --> EP
    Ficha -- "+ Medicamento / tocar medicamento" --> EM
    Ficha -- "+ Cuidado" --> NC
    EP -- eliminar --> Res
    Notif -- tocar --> Hoy
```

---

## 12. Diagrama de despliegue

```mermaid
flowchart TB
    subgraph Dev["Equipo de desarrollo"]
        Code["Código fuente<br/>TypeScript + Expo"]
        CLI["Expo CLI / EAS"]
    end

    subgraph Nube["Servicios Expo (opcional)"]
        EASB["EAS Build<br/>APK / AAB / IPA"]
    end

    subgraph Movil["Teléfono del asilo (Android / iOS)"]
        App["App Cuidado Asilo<br/>o Expo Go"]
        Storage[("AsyncStorage")]
        NotifOS["Planificador de<br/>notificaciones del SO"]
    end

    Code --> CLI
    CLI -- desarrollo: QR / LAN --> App
    CLI -- eas build --> EASB
    EASB -- instalar --> App
    App --> Storage
    App --> NotifOS
```
