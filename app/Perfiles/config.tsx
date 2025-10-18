import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ConfigScreen() {

  const router = useRouter(); 

  const handlePress = () => {
 /*    router.navigate('/Perfiles/newprofile') */
  };

   const handlePressProfile = () => {
    router.navigate('/Perfiles/profilemanagement')
  };


 const pulseAnim = useRef(new Animated.Value(1)).current;
  
    // --- Lógica de la animación ---
    useEffect(() => {
      const startPulse = () => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.05, 
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1.0, 
              duration: 800,
              useNativeDriver: true,
            }),
          ])
        ).start();
      };
      startPulse();
    }, [pulseAnim]);
    // ------------------------------

  // 1. Crear el valor de animación
  const zoomAnim = useRef(new Animated.Value(0.95)).current; // Empezamos un poco más pequeño
  return (
    <LinearGradient colors={["#C5A6FF", "#B0E0FF"]} style={styles.container}>
          
      {/* Imagen esquina superior derecha */}
      <Image
        source={require('@/assets/images/config2.png')}
        style={styles.topRightImage}
      />

      {/* Imagen esquina inferior izquierda */}
      <Image
        source={require('@/assets/images/config2.png')}
        style={styles.bottomLeftImage}
      />
      <View style={{flex:1}}>
        <View style={{marginTop:100, flexDirection:'column', justifyContent:'center'}}>
       
              {/* SUBTÍTULO CON ANIMACIÓN */}
              <Animated.Text 
                style={[ 
                    styles.subtitle, 
                    { transform: [{ scale: pulseAnim }] } 
                ]}
                >
                Configuración
                </Animated.Text>
       
        </View>

        <View style={{marginTop:20, flexDirection:'column', gap:20}}>
            <View style={{ flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                <TouchableOpacity style={styles.button} onPress={handlePress}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="stats-chart-outline"  size={24} color="white" style={{ marginRight: 8 }} />
                    <Text style={styles.buttonText}>Progreso</Text>
                  </View>
                </TouchableOpacity>
            </View>

            <View style={{ flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                <TouchableOpacity style={styles.button} onPress={handlePressProfile}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="happy-outline" size={24} color="white" style={{ marginRight: 8 }} />
                    <Text style={styles.buttonText}>Perfiles</Text>
                  </View>
                </TouchableOpacity>
            </View>
        </View>
    
      
         
        </View>
    
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    paddingTop: 20, // Mantenemos el padding superior para el título
    paddingHorizontal: 20,
    justifyContent: "space-between",
    paddingBottom: 20, // Añadimos padding inferior para no chocar con el futuro footer
  },

    topRightImage: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },

  bottomLeftImage: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },

  titleContainer: {
    fontSize: 25,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  button: {
    backgroundColor: '#6F99F4',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    width:200
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  subtitle: {
    fontSize: 28, 
    fontWeight: "800",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
 
  },
});
