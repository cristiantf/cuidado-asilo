import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { avisar, Boton, Campo, confirmar, s } from '@/components/ui';
import { useDatos } from '@/lib/store';

export default function EditarPaciente() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { pacientes, guardarPaciente, eliminarPaciente } = useDatos();
  const actual = pacientes.find((p) => p.id === id);

  const [f, setF] = useState({
    nombre: actual?.nombre ?? '',
    edad: actual?.edad ?? '',
    habitacion: actual?.habitacion ?? '',
    alergias: actual?.alergias ?? '',
    condiciones: actual?.condiciones ?? '',
    contactoEmergencia: actual?.contactoEmergencia ?? '',
    notas: actual?.notas ?? '',
  });
  const set = (k: keyof typeof f) => (v: string) => setF((x) => ({ ...x, [k]: v }));

  const guardar = () => {
    if (!f.nombre.trim()) return avisar('Falta el nombre', 'Escribe el nombre del residente.');
    const nuevoId = guardarPaciente({ ...f, nombre: f.nombre.trim(), id: actual?.id });
    if (actual) router.back();
    else router.replace(`/paciente/${nuevoId}`);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={s.pantalla} contentContainerStyle={s.contenido} keyboardShouldPersistTaps="handled">
        <Campo etiqueta="Nombre completo *" value={f.nombre} onChangeText={set('nombre')} />
        <Campo etiqueta="Edad" value={f.edad} onChangeText={set('edad')} keyboardType="number-pad" />
        <Campo etiqueta="Habitación" value={f.habitacion} onChangeText={set('habitacion')} />
        <Campo etiqueta="Alergias" value={f.alergias} onChangeText={set('alergias')} placeholder="Ej.: Penicilina" />
        <Campo etiqueta="Condiciones / diagnósticos" value={f.condiciones} onChangeText={set('condiciones')} multiline />
        <Campo
          etiqueta="Contacto de emergencia"
          value={f.contactoEmergencia}
          onChangeText={set('contactoEmergencia')}
          placeholder="Nombre, parentesco y teléfono"
        />
        <Campo etiqueta="Notas (dieta, movilidad, preferencias…)" value={f.notas} onChangeText={set('notas')} multiline />

        <Boton titulo="Guardar" onPress={guardar} />
        {actual && (
          <Boton
            titulo="Eliminar residente"
            tipo="peligro"
            onPress={() =>
              confirmar('Eliminar residente', `Se eliminará a ${actual.nombre} y todo su historial.`, () => {
                eliminarPaciente(actual.id);
                router.dismissTo('/pacientes');
              })
            }
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
