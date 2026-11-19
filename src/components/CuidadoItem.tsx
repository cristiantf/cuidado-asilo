import { Pressable, Text, View } from 'react-native';

import { formatoFechaHora } from '@/lib/fechas';
import { useDatos } from '@/lib/store';
import type { Cuidado } from '@/lib/types';
import { colores, confirmar, s, Tarjeta } from './ui';

const ICONOS: Record<string, string> = {
  'Signos vitales': '❤️',
  Higiene: '🧼',
  'Alimentación': '🍽️',
  'Movilidad / cambio de posición': '🚶',
  'Curación': '🩹',
  'Ánimo / conducta': '🙂',
  'Incidente / caída': '⚠️',
  Otro: '📝',
};

export function CuidadoItem({ c, nombrePaciente }: { c: Cuidado; nombrePaciente?: string }) {
  const { eliminarCuidado } = useDatos();
  const sv = c.signos;
  const partes = sv
    ? [
        sv.presion && `PA ${sv.presion}`,
        sv.pulso && `FC ${sv.pulso} lpm`,
        sv.temperatura && `T° ${sv.temperatura} °C`,
        sv.saturacion && `SpO₂ ${sv.saturacion}%`,
        sv.glucosa && `Glucosa ${sv.glucosa} mg/dL`,
      ].filter(Boolean)
    : [];
  const esIncidente = c.tipo === 'Incidente / caída';

  return (
    <Tarjeta style={esIncidente ? { borderColor: colores.alerta, backgroundColor: colores.alertaSuave } : undefined}>
      <View style={[s.fila, { justifyContent: 'space-between' }]}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: colores.texto, flex: 1 }}>
          {ICONOS[c.tipo] ?? '📝'} {c.tipo}
        </Text>
        <Pressable
          hitSlop={10}
          onPress={() => confirmar('Eliminar registro', '¿Eliminar este registro de cuidado?', () => eliminarCuidado(c.id))}
        >
          <Text style={{ color: colores.suave, fontSize: 18 }}>✕</Text>
        </Pressable>
      </View>
      {!!nombrePaciente && <Text style={[s.texto, { fontWeight: '600', marginTop: 4 }]}>{nombrePaciente}</Text>}
      {partes.length > 0 && <Text style={[s.texto, { marginTop: 4 }]}>{partes.join(' · ')}</Text>}
      {!!c.detalle && <Text style={[s.texto, { marginTop: 4 }]}>{c.detalle}</Text>}
      <Text style={[s.textoSuave, { marginTop: 6, fontSize: 13 }]}>
        {formatoFechaHora(c.registradoEn)}
        {c.cuidador ? ` · ${c.cuidador}` : ''}
      </Text>
    </Tarjeta>
  );
}
