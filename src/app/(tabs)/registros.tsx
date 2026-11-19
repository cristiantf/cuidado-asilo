import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { CuidadoItem } from '@/components/CuidadoItem';
import { ESTILO_ESTADO } from '@/components/TomaItem';
import { Chip, colores, Insignia, s, Tarjeta, Vacio } from '@/components/ui';
import { formatoFechaHora } from '@/lib/fechas';
import { useDatos } from '@/lib/store';

type Vista = 'cuidados' | 'medicacion';

export default function Registros() {
  const { cuidados, administraciones, pacientes, medicamentos } = useDatos();
  const [vista, setVista] = useState<Vista>('cuidados');
  const [pacienteId, setPacienteId] = useState<string | null>(null);

  const nombre = (id: string) => pacientes.find((p) => p.id === id)?.nombre ?? 'Residente eliminado';

  const listaCuidados = cuidados
    .filter((c) => !pacienteId || c.pacienteId === pacienteId)
    .sort((a, b) => b.registradoEn - a.registradoEn)
    .slice(0, 100);

  const listaMed = administraciones
    .filter((a) => !pacienteId || a.pacienteId === pacienteId)
    .sort((a, b) => b.registradoEn - a.registradoEn)
    .slice(0, 100);

  return (
    <ScrollView style={s.pantalla} contentContainerStyle={s.contenido}>
      <View style={s.filaWrap}>
        <Chip texto="Cuidados" activo={vista === 'cuidados'} onPress={() => setVista('cuidados')} />
        <Chip texto="Medicación" activo={vista === 'medicacion'} onPress={() => setVista('medicacion')} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        <Chip texto="Todos" activo={!pacienteId} color={colores.texto} onPress={() => setPacienteId(null)} />
        {pacientes.map((p) => (
          <Chip
            key={p.id}
            texto={p.nombre}
            color={colores.texto}
            activo={pacienteId === p.id}
            onPress={() => setPacienteId(p.id)}
          />
        ))}
      </ScrollView>

      {vista === 'cuidados' ? (
        listaCuidados.length === 0 ? (
          <Vacio texto="Sin registros de cuidados." />
        ) : (
          listaCuidados.map((c) => <CuidadoItem key={c.id} c={c} nombrePaciente={nombre(c.pacienteId)} />)
        )
      ) : listaMed.length === 0 ? (
        <Vacio texto="Sin tomas registradas." />
      ) : (
        listaMed.map((a) => {
          const m = medicamentos.find((x) => x.id === a.medicamentoId);
          const est = ESTILO_ESTADO[a.estado];
          return (
            <Tarjeta key={a.id}>
              <View style={[s.fila, { justifyContent: 'space-between' }]}>
                <Text style={[s.texto, { fontWeight: '700', flex: 1 }]}>{nombre(a.pacienteId)}</Text>
                <Insignia texto={est.texto} color={est.color} fondo={est.fondo} />
              </View>
              <Text style={[s.texto, { marginTop: 4 }]}>
                💊 {m ? `${m.nombre} ${m.dosis}` : 'Medicamento eliminado'} · programada {a.hora}
              </Text>
              {!!a.nota && <Text style={s.textoSuave}>{a.nota}</Text>}
              <Text style={[s.textoSuave, { fontSize: 13, marginTop: 4 }]}>
                Registrado {formatoFechaHora(a.registradoEn)}
                {a.cuidador ? ` · ${a.cuidador}` : ''}
              </Text>
            </Tarjeta>
          );
        })
      )}
    </ScrollView>
  );
}
