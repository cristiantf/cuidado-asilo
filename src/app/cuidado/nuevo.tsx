import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';

import { avisar, Boton, Campo, Chip, colores, s } from '@/components/ui';
import { useDatos } from '@/lib/store';
import { SignosVitales, TIPOS_CUIDADO, TipoCuidado } from '@/lib/types';

export default function NuevoCuidado() {
  const { pacienteId } = useLocalSearchParams<{ pacienteId: string }>();
  const { pacientes, registrarCuidado } = useDatos();
  const paciente = pacientes.find((p) => p.id === pacienteId);

  const [tipo, setTipo] = useState<TipoCuidado>('Signos vitales');
  const [detalle, setDetalle] = useState('');
  const [sv, setSv] = useState<SignosVitales>({});
  const setSigno = (k: keyof SignosVitales) => (v: string) => setSv((x) => ({ ...x, [k]: v }));

  if (!paciente) return <Text style={{ padding: 16 }}>Residente no encontrado.</Text>;

  const esSignos = tipo === 'Signos vitales';

  const guardar = () => {
    const signos = esSignos
      ? Object.fromEntries(Object.entries(sv).filter(([, v]) => v && v.trim())) as SignosVitales
      : undefined;
    if (!detalle.trim() && !(signos && Object.keys(signos).length)) {
      return avisar('Registro vacío', 'Escribe una observación o algún signo vital.');
    }
    registrarCuidado({ pacienteId: paciente.id, tipo, detalle: detalle.trim(), signos });
    router.back();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={s.pantalla} contentContainerStyle={s.contenido} keyboardShouldPersistTaps="handled">
        <Text style={s.textoSuave}>Residente: {paciente.nombre}</Text>

        <Text style={s.etiqueta}>Tipo de cuidado</Text>
        <View style={[s.filaWrap, { marginBottom: 6 }]}>
          {TIPOS_CUIDADO.map((t) => (
            <Chip
              key={t}
              texto={t}
              activo={tipo === t}
              color={t === 'Incidente / caída' ? colores.alerta : colores.primario}
              onPress={() => setTipo(t)}
            />
          ))}
        </View>

        {esSignos && (
          <View>
            <View style={s.fila}>
              <View style={{ flex: 1 }}>
                <Campo etiqueta="Presión (mmHg)" value={sv.presion ?? ''} onChangeText={setSigno('presion')} placeholder="120/80" />
              </View>
              <View style={{ flex: 1 }}>
                <Campo etiqueta="Pulso (lpm)" value={sv.pulso ?? ''} onChangeText={setSigno('pulso')} keyboardType="number-pad" />
              </View>
            </View>
            <View style={s.fila}>
              <View style={{ flex: 1 }}>
                <Campo etiqueta="Temperatura (°C)" value={sv.temperatura ?? ''} onChangeText={setSigno('temperatura')} keyboardType="decimal-pad" />
              </View>
              <View style={{ flex: 1 }}>
                <Campo etiqueta="Saturación O₂ (%)" value={sv.saturacion ?? ''} onChangeText={setSigno('saturacion')} keyboardType="number-pad" />
              </View>
            </View>
            <Campo etiqueta="Glucosa (mg/dL)" value={sv.glucosa ?? ''} onChangeText={setSigno('glucosa')} keyboardType="number-pad" />
          </View>
        )}

        <Campo
          etiqueta={esSignos ? 'Observaciones' : 'Detalle *'}
          value={detalle}
          onChangeText={setDetalle}
          multiline
          placeholder={
            tipo === 'Alimentación'
              ? 'Ej.: comió 75% del almuerzo, buena hidratación'
              : tipo === 'Incidente / caída'
                ? 'Qué pasó, dónde, lesiones, a quién se avisó'
                : 'Describe lo realizado u observado'
          }
        />

        <Boton titulo="Guardar registro" onPress={guardar} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
