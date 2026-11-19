import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { claveDia, horaActual, minutosDe, nuevoId } from './fechas';
import { datosDemo } from './demo';
import { reprogramar } from './recordatorios';
import type {
  Administracion,
  Cuidado,
  Datos,
  EstadoDosis,
  Medicamento,
  Paciente,
  Recordatorios,
} from './types';

const CLAVE = 'cuidado-asilo:v1';

const VACIO: Datos = {
  pacientes: [],
  medicamentos: [],
  administraciones: [],
  cuidados: [],
  cuidadorActual: '',
  recordatorios: { activos: false, anticipoMin: 0 },
};

export type EstadoToma = 'pendiente' | 'atrasada' | EstadoDosis;

export type Toma = {
  clave: string;
  hora: string;
  paciente: Paciente;
  medicamento: Medicamento;
  registro?: Administracion;
  estado: EstadoToma;
};

/** Minutos de tolerancia antes de marcar una toma como atrasada. */
const TOLERANCIA_MIN = 30;

type Store = Datos & {
  cargando: boolean;
  guardarPaciente: (p: Omit<Paciente, 'id' | 'creadoEn'> & { id?: string }) => string;
  eliminarPaciente: (id: string) => void;
  guardarMedicamento: (m: Omit<Medicamento, 'id'> & { id?: string }) => void;
  eliminarMedicamento: (id: string) => void;
  registrarToma: (t: Toma, estado: EstadoDosis, nota?: string) => void;
  deshacerToma: (registroId: string) => void;
  registrarCuidado: (c: Omit<Cuidado, 'id' | 'registradoEn' | 'cuidador'>) => void;
  eliminarCuidado: (id: string) => void;
  setCuidador: (nombre: string) => void;
  tomasDelDia: (fecha?: Date, pacienteId?: string) => Toma[];
  reiniciarDemo: () => void;
  setRecordatorios: (r: Recordatorios) => void;
  /** Cantidad de avisos diarios programados en el teléfono */
  avisosProgramados: number;
};

const Ctx = createContext<Store | null>(null);

export function DatosProvider({ children }: { children: ReactNode }) {
  const [datos, setDatos] = useState<Datos>(VACIO);
  const [cargando, setCargando] = useState(true);
  const [reloj, setReloj] = useState(() => Date.now());
  const [avisosProgramados, setAvisosProgramados] = useState(0);

  // Cargar datos guardados (o datos de ejemplo la primera vez)
  useEffect(() => {
    AsyncStorage.getItem(CLAVE)
      .then((txt) => setDatos(txt ? { ...VACIO, ...JSON.parse(txt) } : datosDemo()))
      .catch(() => setDatos(datosDemo()))
      .finally(() => setCargando(false));
  }, []);

  // Persistir cada cambio
  useEffect(() => {
    if (!cargando) AsyncStorage.setItem(CLAVE, JSON.stringify(datos)).catch(() => {});
  }, [datos, cargando]);

  // Reprogramar los recordatorios cuando cambian medicamentos, residentes o ajustes
  const { medicamentos, pacientes, recordatorios } = datos;
  useEffect(() => {
    if (cargando) return;
    let cancelado = false;
    reprogramar(medicamentos, pacientes, recordatorios)
      .then((n) => !cancelado && setAvisosProgramados(n))
      .catch((e) => console.warn('No se pudieron programar los recordatorios', e));
    return () => {
      cancelado = true;
    };
  }, [medicamentos, pacientes, recordatorios, cargando]);

  // Refrescar estados "atrasada" cada minuto
  useEffect(() => {
    const t = setInterval(() => setReloj(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);

  const guardarPaciente: Store['guardarPaciente'] = useCallback((p) => {
    const id = p.id ?? nuevoId();
    setDatos((d) => {
      const existe = d.pacientes.find((x) => x.id === id);
      const pacientes = existe
        ? d.pacientes.map((x) => (x.id === id ? { ...x, ...p, id } : x))
        : [...d.pacientes, { ...p, id, creadoEn: Date.now() }];
      return { ...d, pacientes };
    });
    return id;
  }, []);

  const eliminarPaciente = useCallback((id: string) => {
    setDatos((d) => ({
      ...d,
      pacientes: d.pacientes.filter((x) => x.id !== id),
      medicamentos: d.medicamentos.filter((x) => x.pacienteId !== id),
      administraciones: d.administraciones.filter((x) => x.pacienteId !== id),
      cuidados: d.cuidados.filter((x) => x.pacienteId !== id),
    }));
  }, []);

  const guardarMedicamento: Store['guardarMedicamento'] = useCallback((m) => {
    const id = m.id ?? nuevoId();
    setDatos((d) => {
      const existe = d.medicamentos.some((x) => x.id === id);
      const medicamentos = existe
        ? d.medicamentos.map((x) => (x.id === id ? { ...m, id } : x))
        : [...d.medicamentos, { ...m, id }];
      return { ...d, medicamentos };
    });
  }, []);

  const eliminarMedicamento = useCallback((id: string) => {
    setDatos((d) => ({ ...d, medicamentos: d.medicamentos.filter((x) => x.id !== id) }));
  }, []);

  const registrarToma: Store['registrarToma'] = useCallback((t, estado, nota = '') => {
    setDatos((d) => {
      const fecha = t.clave.split('|')[0];
      const otros = d.administraciones.filter(
        (a) => !(a.medicamentoId === t.medicamento.id && a.fecha === fecha && a.hora === t.hora),
      );
      const reg: Administracion = {
        id: nuevoId(),
        medicamentoId: t.medicamento.id,
        pacienteId: t.paciente.id,
        fecha,
        hora: t.hora,
        estado,
        registradoEn: Date.now(),
        cuidador: d.cuidadorActual,
        nota,
      };
      return { ...d, administraciones: [...otros, reg] };
    });
  }, []);

  const deshacerToma = useCallback((registroId: string) => {
    setDatos((d) => ({
      ...d,
      administraciones: d.administraciones.filter((a) => a.id !== registroId),
    }));
  }, []);

  const registrarCuidado: Store['registrarCuidado'] = useCallback((c) => {
    setDatos((d) => ({
      ...d,
      cuidados: [
        ...d.cuidados,
        { ...c, id: nuevoId(), registradoEn: Date.now(), cuidador: d.cuidadorActual },
      ],
    }));
  }, []);

  const eliminarCuidado = useCallback((id: string) => {
    setDatos((d) => ({ ...d, cuidados: d.cuidados.filter((c) => c.id !== id) }));
  }, []);

  const setCuidador = useCallback((nombre: string) => {
    setDatos((d) => ({ ...d, cuidadorActual: nombre }));
  }, []);

  const reiniciarDemo = useCallback(
    () => setDatos((d) => ({ ...datosDemo(), recordatorios: d.recordatorios })),
    [],
  );

  const setRecordatorios = useCallback((r: Recordatorios) => {
    setDatos((d) => ({ ...d, recordatorios: r }));
  }, []);

  const tomasDelDia: Store['tomasDelDia'] = useCallback(
    (fecha = new Date(), pacienteId) => {
      const dia = claveDia(fecha);
      const esHoy = dia === claveDia(new Date(reloj));
      const ahora = minutosDe(horaActual(new Date(reloj)));
      const lista: Toma[] = [];
      for (const m of datos.medicamentos) {
        if (!m.activo) continue;
        if (pacienteId && m.pacienteId !== pacienteId) continue;
        const paciente = datos.pacientes.find((p) => p.id === m.pacienteId);
        if (!paciente) continue;
        for (const hora of m.horarios) {
          const registro = datos.administraciones.find(
            (a) => a.medicamentoId === m.id && a.fecha === dia && a.hora === hora,
          );
          let estado: EstadoToma = registro?.estado ?? 'pendiente';
          if (!registro) {
            const pasada = dia < claveDia(new Date(reloj)) ||
              (esHoy && ahora > minutosDe(hora) + TOLERANCIA_MIN);
            if (pasada) estado = 'atrasada';
          }
          lista.push({ clave: `${dia}|${m.id}|${hora}`, hora, paciente, medicamento: m, registro, estado });
        }
      }
      return lista.sort(
        (a, b) => a.hora.localeCompare(b.hora) || a.paciente.nombre.localeCompare(b.paciente.nombre),
      );
    },
    [datos, reloj],
  );

  const valor = useMemo<Store>(
    () => ({
      ...datos,
      cargando,
      guardarPaciente,
      eliminarPaciente,
      guardarMedicamento,
      eliminarMedicamento,
      registrarToma,
      deshacerToma,
      registrarCuidado,
      eliminarCuidado,
      setCuidador,
      tomasDelDia,
      reiniciarDemo,
      setRecordatorios,
      avisosProgramados,
    }),
    [datos, cargando, guardarPaciente, eliminarPaciente, guardarMedicamento, eliminarMedicamento,
      registrarToma, deshacerToma, registrarCuidado, eliminarCuidado, setCuidador, tomasDelDia, reiniciarDemo, setRecordatorios,
      avisosProgramados],
  );

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useDatos(): Store {
  const v = useContext(Ctx);
  if (!v) throw new Error('useDatos debe usarse dentro de <DatosProvider>');
  return v;
}
