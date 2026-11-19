import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { Boton, colores, Insignia, s, Tarjeta, Vacio } from '@/components/ui';
import { useDatos } from '@/lib/store';

export default function Pacientes() {
  const { pacientes, tomasDelDia } = useDatos();
  const [busqueda, setBusqueda] = useState('');
  const tomas = tomasDelDia();

  const q = busqueda.trim().toLowerCase();
  const lista = pacientes
    .filter((p) => !q || p.nombre.toLowerCase().includes(q) || p.habitacion.toLowerCase().includes(q))
    .sort((a, b) => a.habitacion.localeCompare(b.habitacion, undefined, { numeric: true }));

  return (
    <ScrollView style={s.pantalla} contentContainerStyle={s.contenido}>
      <Boton titulo="+ Nuevo residente" onPress={() => router.push('/paciente/editar')} />
      <TextInput
        value={busqueda}
        onChangeText={setBusqueda}
        placeholder="Buscar por nombre o habitación"
        placeholderTextColor="#9AA5B1"
        style={s.input}
      />

      {lista.length === 0 && <Vacio texto={pacientes.length ? 'Sin resultados.' : 'Aún no hay residentes registrados.'} />}

      {lista.map((p) => {
        const suyas = tomas.filter((t) => t.paciente.id === p.id);
        const atrasadas = suyas.filter((t) => t.estado === 'atrasada').length;
        const pendientes = suyas.filter((t) => t.estado === 'pendiente').length;
        return (
          <Pressable key={p.id} onPress={() => router.push(`/paciente/${p.id}`)}>
            <Tarjeta>
              <View style={[s.fila, { justifyContent: 'space-between' }]}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: colores.texto }}>{p.nombre}</Text>
                  <Text style={s.textoSuave}>
                    Hab. {p.habitacion || '—'} · {p.edad ? `${p.edad} años` : 'edad no registrada'}
                  </Text>
                </View>
                <Text style={{ fontSize: 22, color: colores.suave }}>›</Text>
              </View>
              <View style={[s.filaWrap, { marginTop: 8 }]}>
                {atrasadas > 0 && (
                  <Insignia texto={`${atrasadas} atrasada(s)`} color={colores.alerta} fondo={colores.alertaSuave} />
                )}
                {pendientes > 0 && (
                  <Insignia texto={`${pendientes} pendiente(s)`} color={colores.primario} fondo={colores.primarioSuave} />
                )}
                {!!p.alergias && p.alergias.toLowerCase() !== 'ninguna conocida' && (
                  <Insignia texto={`Alergia: ${p.alergias}`} color={colores.alerta} fondo="#fff" />
                )}
              </View>
            </Tarjeta>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
