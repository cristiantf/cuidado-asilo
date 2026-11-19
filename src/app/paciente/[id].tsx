import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { CuidadoItem } from '@/components/CuidadoItem';
import { TomaItem } from '@/components/TomaItem';
import { Boton, colores, Insignia, s, Tarjeta, Titulo, Vacio } from '@/components/ui';
import { useDatos } from '@/lib/store';

export default function DetallePaciente() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { pacientes, medicamentos, cuidados, tomasDelDia } = useDatos();
  const p = pacientes.find((x) => x.id === id);

  if (!p) return <Vacio texto="Residente no encontrado." />;

  const meds = medicamentos.filter((m) => m.pacienteId === p.id);
  const tomas = tomasDelDia(new Date(), p.id);
  const ultimos = cuidados
    .filter((c) => c.pacienteId === p.id)
    .sort((a, b) => b.registradoEn - a.registradoEn)
    .slice(0, 10);

  return (
    <ScrollView style={s.pantalla} contentContainerStyle={s.contenido}>
      <Stack.Screen options={{ title: p.nombre }} />

      <Tarjeta>
        <View style={[s.fila, { justifyContent: 'space-between' }]}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 22, fontWeight: '800', color: colores.texto }}>{p.nombre}</Text>
            <Text style={s.textoSuave}>
              Hab. {p.habitacion || '—'} · {p.edad ? `${p.edad} años` : 'edad no registrada'}
            </Text>
          </View>
          <Boton titulo="Editar" tipo="secundario" chico onPress={() => router.push(`/paciente/editar?id=${p.id}`)} />
        </View>
        <Dato etiqueta="Alergias" valor={p.alergias} alerta />
        <Dato etiqueta="Condiciones / diagnósticos" valor={p.condiciones} />
        <Dato etiqueta="Contacto de emergencia" valor={p.contactoEmergencia} />
        <Dato etiqueta="Notas" valor={p.notas} />
      </Tarjeta>

      <View style={s.fila}>
        <Boton
          titulo="+ Cuidado"
          style={{ flex: 1 }}
          onPress={() => router.push(`/cuidado/nuevo?pacienteId=${p.id}`)}
        />
        <Boton
          titulo="+ Medicamento"
          tipo="secundario"
          style={{ flex: 1 }}
          onPress={() => router.push(`/medicamento/editar?pacienteId=${p.id}`)}
        />
      </View>

      <Titulo>Tomas de hoy</Titulo>
      {tomas.length === 0 ? <Vacio texto="Sin tomas programadas hoy." /> : tomas.map((t) => (
        <TomaItem key={t.clave} toma={t} mostrarPaciente={false} />
      ))}

      <Titulo>Medicamentos</Titulo>
      {meds.length === 0 && <Vacio texto="Sin medicamentos registrados." />}
      {meds.map((m) => (
        <Pressable key={m.id} onPress={() => router.push(`/medicamento/editar?pacienteId=${p.id}&id=${m.id}`)}>
          <Tarjeta style={!m.activo ? { opacity: 0.6 } : undefined}>
            <View style={[s.fila, { justifyContent: 'space-between' }]}>
              <Text style={[s.texto, { fontWeight: '700', flex: 1 }]}>
                💊 {m.nombre} — {m.dosis}
              </Text>
              {!m.activo && <Insignia texto="Suspendido" color={colores.gris} fondo={colores.grisSuave} />}
            </View>
            <Text style={s.textoSuave}>
              {m.via} · {m.horarios.join(', ')}
            </Text>
            {!!m.indicaciones && <Text style={s.textoSuave}>{m.indicaciones}</Text>}
          </Tarjeta>
        </Pressable>
      ))}

      <Titulo>Últimos cuidados</Titulo>
      {ultimos.length === 0 ? <Vacio texto="Sin cuidados registrados." /> : ultimos.map((c) => (
        <CuidadoItem key={c.id} c={c} />
      ))}
    </ScrollView>
  );
}

function Dato({ etiqueta, valor, alerta }: { etiqueta: string; valor: string; alerta?: boolean }) {
  if (!valor) return null;
  return (
    <View style={{ marginTop: 10 }}>
      <Text style={{ fontSize: 13, color: colores.suave, fontWeight: '600' }}>{etiqueta}</Text>
      <Text style={[s.texto, alerta && { color: colores.alerta, fontWeight: '600' }]}>{valor}</Text>
    </View>
  );
}
