import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function PerfilesLayout() {
  const router = useRouter();

  const handleGoBack = () => {
    // La función de navegación siempre debe estar en el router
    router.back(); 
  };

  
  const createProfile = () => {
    // La función de navegación siempre debe estar en el router
    router.navigate('/Perfiles/createprofile') 
  };


  const handleSettings = () => {
    console.log("Ir a configuración");
    // router.push('/settings');
    router.navigate('/Perfiles/parentalcontrol') 
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
         <Stack.Screen
          name="createprofile"
          options={{
            // Ocultamos la barra de encabezado nativa para que el PerfilesScreen controle todo el diseño
            headerShown: false, 
          }}
          
        />
           <Stack.Screen
          name="newprofile"
          options={{
            // Ocultamos la barra de encabezado nativa para que el PerfilesScreen controle todo el diseño
            headerShown: false, 
          }}
          
        />
        <Stack.Screen
          name="parentalcontrol"
          options={{
            // Ocultamos la barra de encabezado nativa para que el PerfilesScreen controle todo el diseño
            headerShown: false, 
          }}
          
        />
        <Stack.Screen
          name="config"
          options={{
            // Ocultamos la barra de encabezado nativa para que el PerfilesScreen controle todo el diseño
            headerShown: false, 
          }}
          
        />
      </Stack>

      {/* FOOTER FIJO: Los botones inferiores anclados */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity onPress={createProfile} style={styles.iconButton}>
          <Ionicons name="arrow-undo-circle" size={40} color="#145c8cff" />
        </TouchableOpacity>
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