import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

import { colores } from '@/components/ui';
import { useDatos } from '@/lib/store';

export default function TabLayout() {
  const { tomasDelDia } = useDatos();
  const atrasadas = tomasDelDia().filter((t) => t.estado === 'atrasada').length;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colores.primario,
        tabBarLabelStyle: { fontSize: 13 },
        headerStyle: { backgroundColor: colores.primario },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
        sceneStyle: { backgroundColor: colores.fondo },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Medicación de hoy',
          tabBarLabel: 'Hoy',
          tabBarBadge: atrasadas > 0 ? atrasadas : undefined,
          tabBarIcon: ({ color, size }) => <Ionicons name="medkit" size={size} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="pacientes"
        options={{
          title: 'Residentes',
          tabBarIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="registros"
        options={{
          title: 'Bitácora',
          tabBarIcon: ({ color, size }) => <Ionicons name="clipboard" size={size} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="ajustes"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color as string} />,
        }}
      />
    </Tabs>
  );
}
