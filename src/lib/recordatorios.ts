import * as Notifications from 'expo-notifications';
import { AndroidImportance, IosAuthorizationStatus } from 'expo-notifications';
import { Platform } from 'react-native';

import type { Medicamento, Paciente, Recordatorios } from './types';

const CANAL = 'tomas';
const PREFIJO = 'toma-';

/** Las notificaciones locales solo funcionan en Android e iOS. */
export const notificacionesDisponibles = Platform.OS === 'android' || Platform.OS === 'ios';

let configurado = false;

async function configurar() {
  if (configurado || !notificacionesDisponibles) return;
  configurado = true;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
  if (Platform.OS === 'android') {
    // En Android 13+ el permiso solo se puede pedir cuando ya existe un canal.
    await Notifications.setNotificationChannelAsync(CANAL, {
      name: 'Recordatorios de medicación',
      importance: AndroidImportance.MAX,
      vibrationPattern: [0, 400, 200, 400],
      lightColor: '#1F6F8B',
    });
  }
}

export async function tienePermiso(): Promise<boolean> {
  if (!notificacionesDisponibles) return false;
  await configurar();
  const p = await Notifications.getPermissionsAsync();
  return p.granted || p.ios?.status === IosAuthorizationStatus.PROVISIONAL;
}

export async function pedirPermiso(): Promise<boolean> {
  if (!notificacionesDisponibles) return false;
  if (await tienePermiso()) return true;
  const p = await Notifications.requestPermissionsAsync();
  return p.granted || p.ios?.status === IosAuthorizationStatus.PROVISIONAL;
}

function restarMinutos(hora: string, min: number): { hour: number; minute: number } {
  const [h, m] = hora.split(':').map(Number);
  const total = (((h * 60 + m - min) % 1440) + 1440) % 1440;
  return { hour: Math.floor(total / 60), minute: total % 60 };
}

/**
 * Borra los recordatorios anteriores y programa uno diario por cada horario
 * distinto (agrupando todas las tomas de esa hora en una sola notificación).
 * Devuelve cuántos recordatorios quedaron programados.
 */
export async function reprogramar(
  medicamentos: Medicamento[],
  pacientes: Paciente[],
  config: Recordatorios,
): Promise<number> {
  if (!notificacionesDisponibles) return 0;
  await configurar();

  const previos = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    previos
      .filter((n) => n.identifier.startsWith(PREFIJO))
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier)),
  );

  if (!config.activos || !(await tienePermiso())) return 0;

  // Agrupar por hora: "08:00" -> ["María López: Losartán 50 mg", ...]
  const porHora = new Map<string, string[]>();
  for (const m of medicamentos) {
    if (!m.activo) continue;
    const p = pacientes.find((x) => x.id === m.pacienteId);
    if (!p) continue;
    for (const hora of m.horarios) {
      const linea = `${p.nombre}${p.habitacion ? ` (hab. ${p.habitacion})` : ''}: ${m.nombre} ${m.dosis}`.trim();
      porHora.set(hora, [...(porHora.get(hora) ?? []), linea]);
    }
  }

  for (const [hora, lineas] of porHora) {
    const { hour, minute } = restarMinutos(hora, config.anticipoMin);
    const titulo =
      config.anticipoMin > 0
        ? `💊 En ${config.anticipoMin} min: medicación de las ${hora}`
        : `💊 Hora de la medicación (${hora})`;
    const cuerpo =
      lineas.length <= 4
        ? lineas.join('\n')
        : `${lineas.slice(0, 3).join('\n')}\n…y ${lineas.length - 3} más`;
    await Notifications.scheduleNotificationAsync({
      identifier: `${PREFIJO}${hora}`,
      content: {
        title: titulo,
        body: cuerpo,
        data: { ruta: '/', hora },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        channelId: CANAL,
      },
    });
  }
  return porHora.size;
}

/** Prueba inmediata para comprobar que el teléfono muestra las notificaciones. */
export async function notificacionDePrueba() {
  await configurar();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '💊 Recordatorio de prueba',
      body: 'Así se verán los avisos de medicación.',
      data: { ruta: '/' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 3,
      channelId: CANAL,
    },
  });
}
