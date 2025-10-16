import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
// Ya no necesitamos Ionicons ni las funciones handleGoBack/handleSettings aquí.

// --- DATOS QUEMADOS ---
const profiles = [
  { name: "Pablo", image: require("../../assets/images/img_niño2.png"), id: "pablo" },
  { name: "Mariana", image: require("../../assets/images/img_niña1.png"), id: "mariana" },
  { name: "Mateo", image: require("../../assets/images/img-niño3.png"), id: "mateo" },
];

export default function PerfilesScreen() {
  const router = useRouter();
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

  const handleProfileSelect = (profileId: string) => {
    console.log(`Perfil seleccionado: ${profileId}`);
    // router.push(`/(app)/game-area?user=${profileId}`);
  };

  return (
    // Importante: Eliminar el paddingVertical que compensaba el footer anterior
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
        {profiles.map((p, index) => (
          <TouchableOpacity 
            key={p.id || index} 
            style={styles.profileCard}
            onPress={() => handleProfileSelect(p.id || p.name)}
            activeOpacity={0.7}
          >
            <Image source={p.image} style={styles.avatar} resizeMode="contain" />
            <Text style={styles.profileName}>{p.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 3. ¡ELIMINAMOS bottomButtons AQUÍ! */}
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
  title: {
    fontSize: 28, 
    fontWeight: "800",
    color: "#4A148C",
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  profilesContainer: {
    flex: 1,
    justifyContent: "center", 
    gap: 30,
    paddingBottom: 40, // Aseguramos espacio entre los perfiles y el footer
  },
  profileCard: {
    alignItems: "center",
    paddingVertical: 5,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  profileName: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  // ELIMINAMOS bottomButtons, iconButton, y el paddingVertical/marginBottom del container original.
});