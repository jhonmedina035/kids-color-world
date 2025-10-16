import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Animated } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  
  // 1. Crear el valor de animación
  const zoomAnim = useRef(new Animated.Value(0.95)).current; // Empezamos un poco más pequeño

  useEffect(() => {
    // 2. Definir la animación (Zoom In y Zoom Out lento)
    Animated.timing(
      zoomAnim,
      {
        toValue: 1.05, // Valor final (un poco más grande)
        duration: 800, // Duración de la animación
        useNativeDriver: true, // Usa el driver nativo para mejor rendimiento
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


  const handleStart = () => {
  router.push('/Perfiles');
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
// ESTILOS MEJORADOS (Subtítulo más grande y llamativo)
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
  // ESTILOS DEL SUBTÍTULO MEJORADOS
  subtitle: {
    fontSize: 32, // AUMENTADO: Letra mucho más grande
    textAlign: 'center',
    fontWeight: '900', // MÁS GRUESO: Hace que se vea más sólido
    color: '#FFFFFF', // Blanco
    textShadowColor: '#FF6347', // SOMBRA LLAMATIVA: Un color primario (rojo tomate)
    textShadowOffset: { width: 4, height: 4 }, // DESPLAZAMIENTO: Hace la sombra más notoria
    textShadowRadius: 8, // DESENFOQUE: Sombra más suave
    marginBottom: 60, 
    paddingHorizontal: 10, // Pequeño padding para el texto
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