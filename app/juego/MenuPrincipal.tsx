import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

export default function MenuPrincipal() {
  const router = useRouter();

  // Función TTS para el saludo
  useEffect(() => {
    const speakGreeting = async () => {
      // Asegura que no haya otra reproducción de audio activa
      await Speech.stop(); 

      // Reproduce el saludo
      Speech.speak("Qué quieres hacer hoy?", {
        language: 'es',
        pitch: 1.0, 
        rate: 1.0, 
      });
    };

    speakGreeting();

    // Limpieza: detiene el audio si el componente se desmonta
    return () => {
      Speech.stop();
    };
  }, []);

  return (
    <ImageBackground
      // Nota: Asegúrate de que la ruta de la imagen sea correcta en tu proyecto
      source={require('../../assets/images/background_image.jpeg')} 
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        
        <Text style={styles.title}>¡Hola!</Text>

        <TouchableOpacity
          style={[styles.button, styles.learnButton]}
          onPress={() => router.push('/juego/Aprender/NivelFacil')}
        >
          <Ionicons name="color-palette-outline" size={30} color="#fff" />
          <Text style={styles.buttonText}>Aprender colores</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.playButton]}
          onPress={() => router.push('/juego/juegos/NivelFacil')}
        >
          <MaterialCommunityIcons name="cube-outline" size={30} color="#fff" />
          <Text style={styles.buttonText}>Juegos con colores</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
    paddingVertical: 50,
    paddingHorizontal: 30,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 50,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 18, 
    paddingHorizontal: 30, 
    marginVertical: 15, 
    width: 300, 
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  learnButton: {
    backgroundColor: '#38B47C', 
  },
  playButton: {
    backgroundColor: '#FF6F5E', 
  },
  buttonText: {
    fontSize: 20, 
    color: '#fff',
    fontWeight: '700',
    marginLeft: 15,
    textTransform: 'uppercase',
  },
});