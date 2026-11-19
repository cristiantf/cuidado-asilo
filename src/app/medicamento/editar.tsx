import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Switch, Text, View } from 'react-native';

import { avisar, Boton, Campo, Chip, colores, confirmar, s } from '@/components/ui';
import { normalizarHora } from '@/lib/fechas';
import { useDatos } from '@/lib/store';

const VIAS = ['Oral', 'Sublingual', 'Inyectable', 'Tópica', 'Inhalada', 'Gotas', 'Otra'];
const HORAS_RAPIDAS = ['06:00', '08:00', '12:00', '13:00', '16:00', '18:00', '20:00', '22:00'];

export default function EditarMedicamento() {
  const { pacienteId, id } = useLocalSearchParams<{ pacienteId: string; id?: string }>();
  const { medicamentos, pacientes, guardarMedicamento, eliminarMedicamento } = useDatos();
  const actual = medicamentos.find((m) => m.id === id);
  const paciente = pacientes.find((p) => p.id === (actual?.pacienteId ?? pacienteId));

  const [nombre, setNombre] = useState(actual?.nombre ?? '');
  const [dosis, setDosis] = useState(actual?.dosis ?? '');
  const [via, setVia] = useState(actual?.via ?? 'Oral');
  const [horarios, setHorarios] = useState<string[]>(actual?.horarios ?? []);
  const [horaNueva, setHoraNueva] = useState('');
  const [indicaciones, setIndicaciones] = useState(actual?.indicaciones ?? '');
  const [activo, setActivo] = useState(actual?.activo ?? true);

  const alternarHora = (h: string) =>
    setHorarios((xs) => (xs.includes(h) ? xs.filter((x) => x !== h) : [...xs, h].sort()));

  const agregarHora = () => {
    const h = normalizarHora(horaNueva);
    if (!h) return avisar('Hora no válida', 'Usa el formato 24 h, por ejemplo 07:30 o 21:00.');
    if (!horarios.includes(h)) setHorarios((xs) => [...xs, h].sort());
    setHoraNueva('');
  };

  const guardar = () => {
    if (!paciente) return;
    if (!nombre.trim()) return avisar('Falta el nombre', 'Escribe el nombre del medicamento.');
    if (horarios.length === 0) return avisar('Faltan horarios', 'Agrega al menos una hora de administración.');
    guardarMedicamento({
      id: actual?.id,
      pacienteId: paciente.id,
      nombre: nombre.trim(),
      dosis: dosis.trim(),
      via,
      horarios,
      indicaciones: indicaciones.trim(),
      activo,
    });
    router.back();
  };

  if (!paciente) return <Text style={{ padding: 16 }}>Residente no encontrado.</Text>;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={s.pantalla} contentContainerStyle={s.contenido} keyboardShouldPersistTaps="handled">
        <Text style={s.textoSuave}>Residente: {paciente.nombre}</Text>
        <Campo etiqueta="Medicamento *" value={nombre} onChangeText={setNombre} placeholder="Ej.: Losartán" />
        <Campo etiqueta="Dosis" value={dosis} onChangeText={setDosis} placeholder="Ej.: 50 mg, 1 tableta" />

        <Text style={s.etiqueta}>Vía de administración</Text>
        <View style={[s.filaWrap, { marginBottom: 14 }]}>
          {VIAS.map((v) => (
            <Chip key={v} texto={v} activo={via === v} onPress={() => setVia(v)} />
          ))}
        </View>

        <Text style={s.etiqueta}>Horarios (toca para agregar/quitar) *</Text>
        <View style={s.filaWrap}>
          {[...new Set([...HORAS_RAPIDAS, ...horarios])].sort().map((h) => (
            <Chip key={h} texto={h} activo={horarios.includes(h)} onPress={() => alternarHora(h)} />
          ))}
        </View>
        <View style={[s.fila, { marginBottom: 6 }]}>
          <View style={{ flex: 1 }}>
            <Campo
              etiqueta="Otra hora (24 h)"
              value={horaNueva}
              onChangeText={setHoraNueva}
              placeholder="07:30"
              onSubmitEditing={agregarHora}
            />
          </View>
          <Boton titulo="Agregar" tipo="secundario" chico onPress={agregarHora} style={{ marginTop: 14 }} />
        </View>

        <Campo
          etiqueta="Indicaciones"
          value={indicaciones}
          onChangeText={setIndicaciones}
          placeholder="Ej.: con alimentos, controlar presión antes"
          multiline
        />

        <Pressable style={[s.fila, { justifyContent: 'space-between', marginBottom: 10 }]} onPress={() => setActivo(!activo)}>
          <Text style={s.texto}>Tratamiento activo</Text>
          <Switch value={activo} onValueChange={setActivo} trackColor={{ true: colores.primario }} />
        </Pressable>

        <Boton titulo="Guardar" onPress={guardar} />
        {actual && (
          <Boton
            titulo="Eliminar medicamento"
            tipo="peligro"
            onPress={() =>
              confirmar('Eliminar', `¿Eliminar ${actual.nombre}? Para pausarlo, desactiva "Tratamiento activo".`, () => {
                eliminarMedicamento(actual.id);
                router.back();
              })
            }
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
