import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { TomaItem } from '@/components/TomaItem';
import { Chip, colores, s, Tarjeta, Vacio } from '@/components/ui';
import { fechaLarga } from '@/lib/fechas';
import { EstadoToma, useDatos } from '@/lib/store';

type Filtro = 'todas' | 'porHacer' | 'hechas';

export default function Hoy() {
  const { tomasDelDia, cuidadorActual } = useDatos();
  const [filtro, setFiltro] = useState<Filtro>('porHacer');
  const tomas = tomasDelDia();

  const cuenta = (e: EstadoToma) => tomas.filter((t) => t.estado === e).length;
  const visibles = tomas.filter((t) =>
    filtro === 'todas'
      ? true
      : filtro === 'porHacer'
        ? t.estado === 'pendiente' || t.estado === 'atrasada'
        : t.estado === 'dada' || t.estado === 'omitida',
  );

  return (
    <ScrollView style={s.pantalla} contentContainerStyle={s.contenido}>
      <View>
        <Text style={{ fontSize: 15, color: colores.suave, textTransform: 'capitalize' }}>{fechaLarga()}</Text>
        {!!cuidadorActual && <Text style={s.textoSuave}>Cuidador/a: {cuidadorActual}</Text>}
      </View>

      <View style={[s.fila, { gap: 8 }]}>
        <Resumen n={cuenta('atrasada')} texto="Atrasadas" color={colores.alerta} fondo={colores.alertaSuave} />
        <Resumen n={cuenta('pendiente')} texto="Pendientes" color={colores.primario} fondo={colores.primarioSuave} />
        <Resumen n={cuenta('dada')} texto="Dadas" color={colores.ok} fondo={colores.okSuave} />
        <Resumen n={cuenta('omitida')} texto="Omitidas" color={colores.aviso} fondo={colores.avisoSuave} />
      </View>

      <View style={s.filaWrap}>
        <Chip texto="Por hacer" activo={filtro === 'porHacer'} onPress={() => setFiltro('porHacer')} />
        <Chip texto="Registradas" activo={filtro === 'hechas'} onPress={() => setFiltro('hechas')} />
        <Chip texto="Todas" activo={filtro === 'todas'} onPress={() => setFiltro('todas')} />
      </View>

      {visibles.length === 0 ? (
        <Vacio
          texto={
            tomas.length === 0
              ? 'No hay medicamentos programados. Agrega residentes y sus medicamentos en la pestaña Residentes.'
              : filtro === 'porHacer'
                ? '¡Todo al día! No hay tomas pendientes.'
                : 'No hay tomas en esta vista.'
          }
        />
      ) : (
        visibles.map((t) => <TomaItem key={t.clave} toma={t} />)
      )}
    </ScrollView>
  );
}

function Resumen({ n, texto, color, fondo }: { n: number; texto: string; color: string; fondo: string }) {
  return (
    <Tarjeta style={{ flex: 1, padding: 10, alignItems: 'center', backgroundColor: fondo, borderColor: fondo }}>
      <Text style={{ fontSize: 24, fontWeight: '800', color }}>{n}</Text>
      <Text style={{ fontSize: 12, color, fontWeight: '600' }}>{texto}</Text>
    </Tarjeta>
  );
}
