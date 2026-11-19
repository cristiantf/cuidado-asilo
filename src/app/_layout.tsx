import * as Notifications from 'expo-notifications';
import { router, Stack } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';

import { colores } from '@/components/ui';
import { notificacionesDisponibles } from '@/lib/recordatorios';
import { DatosProvider, useDatos } from '@/lib/store';

function Contenido() {
  const { cargando } = useDatos();

  // Al tocar un recordatorio, abrir la pantalla "Hoy"
  useEffect(() => {
    if (!notificacionesDisponibles) return;
    const sub = Notifications.addNotificationResponseReceivedListener((r) => {
      const ruta = r.notification.request.content.data?.ruta;
      if (ruta === '/') router.navigate('/');
    });
    return () => sub.remove();
  }, []);
  if (cargando) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colores.fondo }}>
        <ActivityIndicator size="large" color={colores.primario} />
      </View>
    );
  }
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colores.primario },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: colores.fondo },
        headerBackTitle: 'Atrás',
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="paciente/[id]" options={{ title: 'Paciente' }} />
      <Stack.Screen name="paciente/editar" options={{ title: 'Datos del paciente', presentation: 'modal' }} />
      <Stack.Screen name="medicamento/editar" options={{ title: 'Medicamento', presentation: 'modal' }} />
      <Stack.Screen name="cuidado/nuevo" options={{ title: 'Registrar cuidado', presentation: 'modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <DatosProvider>
      <StatusBar style="light" />
      <Contenido />
    </DatosProvider>
  );
}
