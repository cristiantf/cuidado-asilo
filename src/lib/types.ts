export type Paciente = {
  id: string;
  nombre: string;
  edad: string;
  habitacion: string;
  alergias: string;
  condiciones: string;
  contactoEmergencia: string;
  notas: string;
  creadoEn: number;
};

export type Medicamento = {
  id: string;
  pacienteId: string;
  nombre: string;
  dosis: string;
  via: string;
  /** Horas del día en formato "HH:MM" */
  horarios: string[];
  indicaciones: string;
  activo: boolean;
};

export type EstadoDosis = 'dada' | 'omitida';

export type Administracion = {
  id: string;
  medicamentoId: string;
  pacienteId: string;
  /** Día programado en formato "YYYY-MM-DD" */
  fecha: string;
  /** Hora programada "HH:MM" */
  hora: string;
  estado: EstadoDosis;
  registradoEn: number;
  cuidador: string;
  nota: string;
};

export const TIPOS_CUIDADO = [
  'Signos vitales',
  'Higiene',
  'Alimentación',
  'Movilidad / cambio de posición',
  'Curación',
  'Ánimo / conducta',
  'Incidente / caída',
  'Otro',
] as const;

export type TipoCuidado = (typeof TIPOS_CUIDADO)[number];

export type SignosVitales = {
  presion?: string;
  pulso?: string;
  temperatura?: string;
  saturacion?: string;
  glucosa?: string;
};

export type Cuidado = {
  id: string;
  pacienteId: string;
  tipo: TipoCuidado;
  detalle: string;
  signos?: SignosVitales;
  registradoEn: number;
  cuidador: string;
};

export type Recordatorios = {
  activos: boolean;
  /** Minutos de anticipación del aviso (0 = a la hora exacta) */
  anticipoMin: number;
};

export type Datos = {
  pacientes: Paciente[];
  medicamentos: Medicamento[];
  administraciones: Administracion[];
  cuidados: Cuidado[];
  cuidadorActual: string;
  recordatorios: Recordatorios;
};
