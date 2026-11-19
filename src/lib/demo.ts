import type { Datos } from './types';

/** Datos de ejemplo para la primera ejecución (se pueden borrar desde Ajustes). */
export function datosDemo(): Datos {
  const ahora = Date.now();
  return {
    cuidadorActual: 'Turno mañana',
    recordatorios: { activos: false, anticipoMin: 0 },
    pacientes: [
      {
        id: 'p1',
        nombre: 'María López',
        edad: '84',
        habitacion: '101',
        alergias: 'Penicilina',
        condiciones: 'Hipertensión, diabetes tipo 2',
        contactoEmergencia: 'Hija: Ana López — 099 123 4567',
        notas: 'Usa andador. Dieta baja en azúcar.',
        creadoEn: ahora,
      },
      {
        id: 'p2',
        nombre: 'José Ramírez',
        edad: '79',
        habitacion: '102',
        alergias: 'Ninguna conocida',
        condiciones: 'Alzheimer leve, artrosis',
        contactoEmergencia: 'Hijo: Luis Ramírez — 098 765 4321',
        notas: 'Requiere supervisión al caminar.',
        creadoEn: ahora,
      },
    ],
    medicamentos: [
      {
        id: 'm1', pacienteId: 'p1', nombre: 'Losartán', dosis: '50 mg', via: 'Oral',
        horarios: ['08:00', '20:00'], indicaciones: 'Controlar presión antes de dar.', activo: true,
      },
      {
        id: 'm2', pacienteId: 'p1', nombre: 'Metformina', dosis: '850 mg', via: 'Oral',
        horarios: ['08:00', '13:00'], indicaciones: 'Con las comidas.', activo: true,
      },
      {
        id: 'm3', pacienteId: 'p2', nombre: 'Donepezilo', dosis: '5 mg', via: 'Oral',
        horarios: ['21:00'], indicaciones: 'Antes de dormir.', activo: true,
      },
      {
        id: 'm4', pacienteId: 'p2', nombre: 'Paracetamol', dosis: '500 mg', via: 'Oral',
        horarios: ['09:00', '15:00'], indicaciones: 'Para dolor articular.', activo: true,
      },
    ],
    administraciones: [],
    cuidados: [
      {
        id: 'c1', pacienteId: 'p1', tipo: 'Signos vitales', detalle: 'Estable',
        signos: { presion: '130/85', pulso: '76', temperatura: '36.5', saturacion: '96', glucosa: '118' },
        registradoEn: ahora - 3600_000, cuidador: 'Turno noche',
      },
    ],
  };
}
