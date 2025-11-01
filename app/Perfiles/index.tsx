import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";




// --- DATOS QUEMADOS ---
/* const profiles = [
  // Asegúrate de que las rutas de las imágenes sean correctas en tu proyecto
  { name: "Pablo", image: require("../../assets/images/img_niño2.png"), id: "pablo" },
  { name: "Mariana", image: require("../../assets/images/img_niña1.png"), id: "mariana" },
  { name: "Mateo", image: require("../../assets/images/img-niño3.png"), id: "mateo" },
]; */

export default function PerfilesScreen() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const router = useRouter();
  const pulseAnim = useRef(new Animated.Value(1)).current;

    // --- Cargar perfiles guardados en AsyncStorage ---
  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const storedProfiles = await AsyncStorage.getItem("profile");
        const parsed = storedProfiles ? JSON.parse(storedProfiles) : [];
        setProfiles(parsed);
      } catch (err) {
        console.error("Error al cargar perfiles:", err);
      }
    };

    loadProfiles();
  }, []);

  // --- Lógica de la animación de pulso del título ---
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
 
  /**
   * Navega al menú principal y pasa el nombre del perfil seleccionado.
   * @param profileName Nombre del usuario seleccionado (ej: "Pablo").
   */
  const handleProfileSelect = (profileName: string) => {
    console.log(`Navegando al menú principal con el perfil: ${profileName}`);
    
    // CLAVE: Usamos router.push con un objeto para pasar parámetros.
    // 'userName' es el nombre del parámetro que debe recibir el MenuPrincipal.tsx
    router.push({
      pathname: '/juego/MenuPrincipal', // <-- ¡Asegúrate que esta ruta es correcta!
      params: { userName: profileName },
    });
  };

  return (
    <LinearGradient colors={["#C5A6FF", "#B0E0FF"]} style={styles.container}>
      
      {/* 1. TÍTULO EN LA PARTE SUPERIOR Y ANIMADO */}
      <Animated.Text
        style={[
          styles.title,
          { transform: [{ scale: pulseAnim }] },
        ]}
      >
        ¿Quién va a jugar hoy?
      </Animated.Text>

      {/* 2. CONTENEDOR DE PERFILES (SECCIÓN CENTRAL) */}
      <View style={styles.profilesContainer}>
        {profiles.map((p:any, index:number) => (
          <TouchableOpacity 
            key={p.id || index} 
            style={styles.profileCard}
            // CLAVE: Llamamos a la función con el nombre del perfil (p.name)
            onPress={() => handleProfileSelect(p.name)} 
            activeOpacity={0.7}
          >
            <Image source={{uri: p.image }} style={styles.avatar} resizeMode="contain" />
            <Text style={styles.profileName}>{p.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60, // Aumentado para mejor separación superior
    paddingHorizontal: 20,
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  title: {
    fontSize: 28, 
    fontWeight: "800",
    color: "#4A148C",
    textAlign: "center",
    marginBottom: 40, // Más espacio debajo del título
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  profilesContainer: {
    flexDirection: 'row', // Organiza los perfiles en una fila
    flexWrap: 'wrap', // Permite que los perfiles se envuelvan si no caben
    justifyContent: "space-around", // Distribuye el espacio entre los perfiles
    alignItems: 'center',
    flex: 1,
    paddingBottom: 40, 
  },
  profileCard: {
    alignItems: "center",
    paddingVertical: 10,
    width: '30%', // Ajusta el ancho para que quepan 3 o más en fila (depende del dispositivo)
  },
  avatar: {
    width: 100, // Ligeramente más pequeños para caber mejor
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, // Sombra más pronunciada
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  profileName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    textAlign: 'center',
  },
});
