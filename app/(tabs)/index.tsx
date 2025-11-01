import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// 1. IMPORTAR EXPO-SPEECH
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';

export default function  HomeScreen() {

  const router = useRouter();
  
  // 1. Crear el valor de animación
  const zoomAnim = useRef(new Animated.Value(0.95)).current; // Empezamos un poco más pequeño

  // 2. Función para reproducir la voz
  const speakReady = () => {
    // Texto que quieres que se diga
    const thingToSay = 'Listo para descubrir los colores?';
    
    // Configuración opcional (ej: velocidad, tono, idioma)
    Speech.speak(thingToSay, {
      language: 'es-ES', // Asegúrate de que el idioma esté disponible
      rate: 0.9,         // Un poco más lento que la velocidad normal
      pitch: 1.2,        // Un tono ligeramente más alto (opcional, para sonar más amigable)
    });
  };

  useEffect(() => {
    // 3. Llamar a la función de voz al cargar la pantalla
    speakReady(); 

    // Lógica de animación existente
    Animated.timing(
      zoomAnim,
      {
        toValue: 1.05, 
        duration: 800, 
        useNativeDriver: true, 
      }
    ).start(() => {
        
        Animated.loop(
            Animated.sequence([
                Animated.timing(zoomAnim, { toValue: 1.05, duration: 800, useNativeDriver: true }),
                Animated.timing(zoomAnim, { toValue: 0.95, duration: 800, useNativeDriver: true }),
            ])
        ).start();
    
    });
  }, [zoomAnim]);


  const handleStart = async () => {
    const storedProfiles = await AsyncStorage.getItem("profile")
    const profiles = storedProfiles ? JSON.parse(storedProfiles) : [] 
    // Opcional: Detener la voz si sigue hablando al hacer tap
    Speech.stop();
    // Valida si hay perfiles o sino para que vaya a la vista de crear perfiles
    if(profiles.length==0){
     router.push('/Perfiles/createprofile');
    }else{
     router.push('/Perfiles');
    }

  };

  return (
    <ImageBackground
      source={require('../../assets/images/img_index_fondo.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>🌈 ¡Hola! 🎨</Text>

        {/* SUBTÍTULO CON ANIMACIÓN */}
        <Animated.Text 
          style={[
            styles.subtitle, 
            { transform: [{ scale: zoomAnim }] } // Aplicamos el valor animado al estilo 'scale'
          ]}
        >
          ¿Listo para descubrir los{"\n"}colores?
        </Animated.Text>

        <TouchableOpacity style={styles.button} onPress={handleStart}>
          <Text style={styles.buttonText}>¡A jugar!</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

// ------------------------------------------------------------------
// ESTILOS SIN CAMBIOS
// ------------------------------------------------------------------

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 40,
    textAlign: 'center',
    fontWeight: '800',
    color: '#FFD700', 
    textShadowColor: 'rgba(0, 0, 0, 0.6)', 
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 5,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 32, 
    textAlign: 'center',
    fontWeight: '900', 
    color: '#FFFFFF', 
    textShadowColor: '#FF6347', 
    textShadowOffset: { width: 4, height: 4 }, 
    textShadowRadius: 8, 
    marginBottom: 60, 
    paddingHorizontal: 10, 
  },
  button: {
    backgroundColor: '#209ad3ff',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 50,
    elevation: 8,
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderWidth: 3,
    borderColor: 'white',
  },
  buttonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
});