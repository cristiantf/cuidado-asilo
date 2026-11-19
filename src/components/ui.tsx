import { ReactNode } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

export const colores = {
  fondo: '#F3F6F8',
  tarjeta: '#FFFFFF',
  texto: '#1B2733',
  suave: '#5E6B78',
  borde: '#DCE3E9',
  primario: '#1F6F8B',
  primarioSuave: '#E2F0F5',
  ok: '#2E7D4F',
  okSuave: '#E3F3EA',
  alerta: '#B3261E',
  alertaSuave: '#FBE6E4',
  aviso: '#9A6700',
  avisoSuave: '#FFF4D6',
  gris: '#6B7280',
  grisSuave: '#ECEFF2',
};

export function Tarjeta({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[s.tarjeta, style]}>{children}</View>;
}

type BotonProps = {
  titulo: string;
  onPress: () => void;
  tipo?: 'primario' | 'secundario' | 'ok' | 'peligro';
  chico?: boolean;
  deshabilitado?: boolean;
  style?: ViewStyle;
};

export function Boton({ titulo, onPress, tipo = 'primario', chico, deshabilitado, style }: BotonProps) {
  const fondo = {
    primario: colores.primario,
    secundario: colores.grisSuave,
    ok: colores.ok,
    peligro: colores.alerta,
  }[tipo];
  const color = tipo === 'secundario' ? colores.texto : '#fff';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={deshabilitado}
      style={({ pressed }) => [
        s.boton,
        chico && s.botonChico,
        { backgroundColor: fondo, opacity: deshabilitado ? 0.5 : pressed ? 0.8 : 1 },
        style,
      ]}
    >
      <Text style={[s.botonTexto, chico && { fontSize: 15 }, { color }]}>{titulo}</Text>
    </Pressable>
  );
}

export function Campo({ etiqueta, ...props }: TextInputProps & { etiqueta: string }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={s.etiqueta}>{etiqueta}</Text>
      <TextInput
        placeholderTextColor="#9AA5B1"
        {...props}
        style={[s.input, props.multiline && { minHeight: 80, textAlignVertical: 'top' }, props.style]}
      />
    </View>
  );
}

export function Chip({
  texto,
  activo,
  onPress,
  color = colores.primario,
}: {
  texto: string;
  activo?: boolean;
  onPress?: () => void;
  color?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[s.chip, activo ? { backgroundColor: color, borderColor: color } : null]}
    >
      <Text style={[s.chipTexto, activo && { color: '#fff' }]}>{texto}</Text>
    </Pressable>
  );
}

export function Insignia({ texto, color, fondo }: { texto: string; color: string; fondo: string }) {
  return (
    <View style={[s.insignia, { backgroundColor: fondo }]}>
      <Text style={[s.insigniaTexto, { color }]}>{texto}</Text>
    </View>
  );
}

export function Vacio({ texto }: { texto: string }) {
  return <Text style={s.vacio}>{texto}</Text>;
}

export function Titulo({ children }: { children: ReactNode }) {
  return <Text style={s.titulo}>{children}</Text>;
}

/** Confirmación que funciona en móvil y en web. */
export function confirmar(titulo: string, mensaje: string, onSi: () => void) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${titulo}\n\n${mensaje}`)) onSi();
    return;
  }
  Alert.alert(titulo, mensaje, [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Sí', style: 'destructive', onPress: onSi },
  ]);
}

export function avisar(titulo: string, mensaje: string) {
  if (Platform.OS === 'web') {
    window.alert(`${titulo}\n\n${mensaje}`);
  } else {
    Alert.alert(titulo, mensaje);
  }
}

export const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  contenido: { padding: 16, paddingBottom: 40, gap: 12 },
  tarjeta: {
    backgroundColor: colores.tarjeta,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  boton: {
    minHeight: 50,
    borderRadius: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonChico: { minHeight: 40, paddingHorizontal: 14, borderRadius: 10 },
  botonTexto: { fontSize: 17, fontWeight: '600' },
  etiqueta: { fontSize: 15, color: colores.suave, marginBottom: 6, fontWeight: '500' },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 17,
    color: colores.texto,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: '#fff',
  },
  chipTexto: { fontSize: 15, color: colores.texto },
  insignia: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' },
  insigniaTexto: { fontSize: 13, fontWeight: '700' },
  vacio: { textAlign: 'center', color: colores.suave, fontSize: 16, paddingVertical: 24 },
  titulo: { fontSize: 19, fontWeight: '700', color: colores.texto, marginTop: 8 },
  texto: { fontSize: 16, color: colores.texto },
  textoSuave: { fontSize: 15, color: colores.suave },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  filaWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
