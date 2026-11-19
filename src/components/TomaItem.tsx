import { Text, View } from 'react-native';

import type { EstadoToma, Toma } from '@/lib/store';
import { useDatos } from '@/lib/store';
import { formatoFechaHora } from '@/lib/fechas';
import { Boton, colores, Insignia, s, Tarjeta } from './ui';

export const ESTILO_ESTADO: Record<EstadoToma, { texto: string; color: string; fondo: string }> = {
  pendiente: { texto: 'Pendiente', color: colores.primario, fondo: colores.primarioSuave },
  atrasada: { texto: 'Atrasada', color: colores.alerta, fondo: colores.alertaSuave },
  dada: { texto: 'Administrada', color: colores.ok, fondo: colores.okSuave },
  omitida: { texto: 'Omitida', color: colores.aviso, fondo: colores.avisoSuave },
};

export function TomaItem({ toma, mostrarPaciente = true }: { toma: Toma; mostrarPaciente?: boolean }) {
  const { registrarToma, deshacerToma } = useDatos();
  const est = ESTILO_ESTADO[toma.estado];
  const { medicamento: m, paciente: p, registro } = toma;

  return (
    <Tarjeta style={{ borderLeftWidth: 5, borderLeftColor: est.color }}>
      <View style={[s.fila, { justifyContent: 'space-between' }]}>
        <Text style={{ fontSize: 22, fontWeight: '700', color: colores.texto }}>{toma.hora}</Text>
        <Insignia texto={est.texto} color={est.color} fondo={est.fondo} />
      </View>
      {mostrarPaciente && (
        <Text style={{ fontSize: 17, fontWeight: '600', marginTop: 6, color: colores.texto }}>
          {p.nombre} · Hab. {p.habitacion}
        </Text>
      )}
      <Text style={[s.texto, { marginTop: 4 }]}>
        💊 {m.nombre} — {m.dosis} ({m.via})
      </Text>
      {!!m.indicaciones && <Text style={[s.textoSuave, { marginTop: 2 }]}>{m.indicaciones}</Text>}
      {!!p.alergias && mostrarPaciente && (
        <Text style={{ color: colores.alerta, fontSize: 14, marginTop: 2 }}>Alergias: {p.alergias}</Text>
      )}

      {registro ? (
        <View style={[s.fila, { marginTop: 12, justifyContent: 'space-between' }]}>
          <Text style={[s.textoSuave, { flex: 1 }]}>
            {formatoFechaHora(registro.registradoEn)}
            {registro.cuidador ? ` · ${registro.cuidador}` : ''}
          </Text>
          <Boton titulo="Deshacer" tipo="secundario" chico onPress={() => deshacerToma(registro.id)} />
        </View>
      ) : (
        <View style={[s.fila, { marginTop: 12 }]}>
          <Boton titulo="✓ Administrada" tipo="ok" style={{ flex: 2 }} onPress={() => registrarToma(toma, 'dada')} />
          <Boton titulo="Omitir" tipo="secundario" style={{ flex: 1 }} onPress={() => registrarToma(toma, 'omitida')} />
        </View>
      )}
    </Tarjeta>
  );
}
