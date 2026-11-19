import { useState } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';

import { avisar, Boton, Campo, Chip, colores, confirmar, s, Tarjeta, Titulo } from '@/components/ui';
import { notificacionDePrueba, notificacionesDisponibles, pedirPermiso } from '@/lib/recordatorios';
import { useDatos } from '@/lib/store';

export default function Ajustes() {
  const {
    cuidadorActual, setCuidador, reiniciarDemo, pacientes, eliminarPaciente,
    recordatorios, setRecordatorios, avisosProgramados,
  } = useDatos();
  const [nombre, setNombre] = useState(cuidadorActual);

  const alternarRecordatorios = async (activar: boolean) => {
    if (activar && !(await pedirPermiso())) {
      avisar(
        'Permiso denegado',
        'Para recibir recordatorios, permite las notificaciones de esta app en los ajustes del teléfono.',
      );
      return;
    }
    setRecordatorios({ ...recordatorios, activos: activar });
  };

  return (
    <ScrollView style={s.pantalla} contentContainerStyle={s.contenido}>
      <Tarjeta>
        <Titulo>Cuidador/a en turno</Titulo>
        <Text style={[s.textoSuave, { marginBottom: 12 }]}>
          Este nombre se guarda en cada toma y cuidado que registres.
        </Text>
        <Campo etiqueta="Nombre" value={nombre} onChangeText={setNombre} placeholder="Ej.: Carmen — turno mañana" />
        <Boton
          titulo="Guardar"
          onPress={() => {
            setCuidador(nombre.trim());
            avisar('Listo', 'Cuidador/a actualizado.');
          }}
        />
      </Tarjeta>

      <Tarjeta>
        <Titulo>Recordatorios de medicación</Titulo>
        {!notificacionesDisponibles ? (
          <Text style={[s.textoSuave, { marginTop: 6 }]}>
            Los recordatorios solo funcionan en la app instalada en Android o iPhone, no en el navegador.
          </Text>
        ) : (
          <>
            <Text style={[s.textoSuave, { marginBottom: 12 }]}>
              El teléfono avisa todos los días a la hora de cada toma, aunque la app esté cerrada.
              Las tomas de la misma hora se agrupan en un solo aviso.
            </Text>
            <Pressable
              style={[s.fila, { justifyContent: 'space-between', marginBottom: 12 }]}
              onPress={() => alternarRecordatorios(!recordatorios.activos)}
            >
              <Text style={[s.texto, { fontWeight: '600' }]}>Activar recordatorios</Text>
              <Switch
                value={recordatorios.activos}
                onValueChange={alternarRecordatorios}
                trackColor={{ true: colores.primario }}
              />
            </Pressable>
            {recordatorios.activos && (
              <View>
                <Text style={s.etiqueta}>Avisar</Text>
                <View style={[s.filaWrap, { marginBottom: 12 }]}>
                  {[0, 5, 10, 15, 30].map((min) => (
                    <Chip
                      key={min}
                      texto={min === 0 ? 'A la hora' : `${min} min antes`}
                      activo={recordatorios.anticipoMin === min}
                      onPress={() => setRecordatorios({ ...recordatorios, anticipoMin: min })}
                    />
                  ))}
                </View>
                <Text style={[s.textoSuave, { marginBottom: 12 }]}>
                  {avisosProgramados === 0
                    ? 'No hay tomas activas para avisar.'
                    : `${avisosProgramados} aviso(s) diario(s) programado(s).`}
                </Text>
                <Boton
                  titulo="Enviar aviso de prueba"
                  tipo="secundario"
                  onPress={async () => {
                    await notificacionDePrueba();
                    avisar('Aviso enviado', 'Llegará en unos segundos.');
                  }}
                />
              </View>
            )}
          </>
        )}
      </Tarjeta>

      <Tarjeta>
        <Titulo>Datos</Titulo>
        <Text style={[s.textoSuave, { marginBottom: 12 }]}>
          Los datos se guardan solo en este dispositivo.
        </Text>
        <Boton
          titulo="Cargar datos de ejemplo"
          tipo="secundario"
          style={{ marginBottom: 10 }}
          onPress={() =>
            confirmar('Cargar ejemplo', 'Se reemplazarán todos los datos actuales por datos de ejemplo.', reiniciarDemo)
          }
        />
        <Boton
          titulo="Borrar todos los residentes"
          tipo="peligro"
          onPress={() =>
            confirmar('Borrar todo', 'Se eliminarán todos los residentes, medicamentos y registros. No se puede deshacer.', () =>
              pacientes.forEach((p) => eliminarPaciente(p.id)),
            )
          }
        />
      </Tarjeta>
    </ScrollView>
  );
}
