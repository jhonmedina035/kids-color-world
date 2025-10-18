import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter, useSegments } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function PerfilesLayout() {
  const router = useRouter();
 const segments = useSegments();
  const currentScreen = segments[segments.length - 1];
  

  // Definimos qué botones mostrar por pantalla
  const footerButtonsConfig: Record<string, ('back' | 'settings')[]> = {
    index: ['back', 'settings'],       // Ambos botones
    Perfiles: ['back', 'settings'],   // Ambos botones
    createprofile: ['back'],          // Solo "back"
    editprofile: [],                  // Ningún botón
    parentalcontrol: ['back'],        // Solo "settings"
    newprofile: ['back'],             // Ningún botón
  };

  const buttonsToShow = footerButtonsConfig[currentScreen] || [];

  const handleGoBack = () => {
    // La función de navegación siempre debe estar en el router
    router.back(); 
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
        <Stack.Screen
          name="profilemanagement"
          options={{
            // Ocultamos la barra de encabezado nativa para que el PerfilesScreen controle todo el diseño
            headerShown: false, 
          }}
          
        />
        <Stack.Screen
          name="editprofile"
          options={{
            // Ocultamos la barra de encabezado nativa para que el PerfilesScreen controle todo el diseño
            headerShown: false, 
        }}
          
        />
      </Stack>

      {/* FOOTER FIJO: Los botones inferiores anclados */}
      {buttonsToShow.length > 0 && (
        <View style={styles.bottomButtons}>
          {buttonsToShow.includes('back') && (
            <TouchableOpacity onPress={handleGoBack} style={styles.iconButton}>
              <Ionicons name="arrow-undo-circle" size={40} color="#4A148C" />
            </TouchableOpacity>
          )}
          {buttonsToShow.includes('settings') && (
            <TouchableOpacity onPress={handleSettings} style={styles.iconButton}>
              <Ionicons name="settings-sharp" size={40} color="#4A148C" />
            </TouchableOpacity>
          )}
        </View>
      )}
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