import { Stack } from 'expo-router';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';

export default function PerfilesLayout() {
  const router = useRouter();

  const handleGoBack = () => {
    // La función de navegación siempre debe estar en el router
    router.back(); 
  };

  const handleSettings = () => {
    console.log("Ir a configuración");
    // router.push('/settings');
  };

  return (
    <View style={styles.fullScreen}>
      {/* Stack.Screen renderiza el contenido de la pantalla (PerfilesScreen.tsx) */}
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            // Ocultamos la barra de encabezado nativa para que el PerfilesScreen controle todo el diseño
            headerShown: false, 
          }}
        />
      </Stack>

      {/* FOOTER FIJO: Los botones inferiores anclados */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity onPress={handleGoBack} style={styles.iconButton}>
          <Ionicons name="arrow-undo-circle" size={40} color="#4A148C" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSettings} style={styles.iconButton}>
          <Ionicons name="settings-sharp" size={40} color="#4A148C" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 30, // Separación de los bordes laterales
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Fondo blanco semitransparente para el footer
    borderTopWidth: 1,
    borderTopColor: '#DDD',
  },
  iconButton: {
    padding: 5,
  },
});