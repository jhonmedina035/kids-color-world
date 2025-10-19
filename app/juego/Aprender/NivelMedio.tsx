import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width;

// --- Datos de los niveles (colores y objetos) ---
const NIVELES = [
  {
    nombreColor: "Rojo",
    fondo: "#F44336",
    objetos: [
      {
        nombre: "Fresa",
        color: "roja",
        imagen: require("@/assets/images/iconosJuegos/Fresa_roja-removebg-preview.png"),
      },
      {
        nombre: "Manzana",
        color: "roja",
        imagen: require("@/assets/images/iconosJuegos/manzana_roja-removebg-preview.png"),
      },
      {
        nombre: "Sandía",
        color: "roja",
        imagen: require("@/assets/images/iconosJuegos/sandia_roja-removebg-preview.png"),
      },
      {
        nombre: "Mariquita",
        color: "roja",
        imagen: require("@/assets/images/iconosJuegos/mariquita_roja-removebg-preview.png"),
      },
    ],
  },
  {
    nombreColor: "Verde",
    fondo: "#4CAF50",
    objetos: [
      {
        nombre: "Rana",
        color: "verde",
        imagen: require("@/assets/images/iconosJuegos/rana_verde-removebg-preview.png"),
      },
      {
        nombre: "Hoja",
        color: "verde",
        imagen: require("@/assets/images/iconosJuegos/hoja_verde-removebg-preview.png"),
      },
      {
        nombre: "Manzana",
        color: "verde",
        imagen: require("@/assets/images/iconosJuegos/manzana_verde-removebg-preview.png"),
      },
      {
        nombre: "Bicicleta",
        color: "verde",
        imagen: require("@/assets/images/iconosJuegos/bicicleta_verde-removebg-preview.png"),
      },
    ],
  },
  {
    nombreColor: "Azul",
    fondo: "#2196F3",
    objetos: [
      {
        nombre: "Pez",
        color: "azul",
        imagen: require("@/assets/images/iconosJuegos/pez_azul-removebg-preview.png"),
      },
      {
        nombre: "Mariposa",
        color: "azul",
        imagen: require("@/assets/images/iconosJuegos/mariposa_azul-removebg-preview.png"),
      },
      {
        nombre: "Ballena",
        color: "azul",
        imagen: require("@/assets/images/iconosJuegos/ballena_azul-removebg-preview.png"),
      },
      {
        nombre: "Carro",
        color: "azul",
        imagen: require("@/assets/images/iconosJuegos/carro_azul-removebg-preview.png"),
      },
    ],
  },
  {
    nombreColor: "Amarillo",
    fondo: "#FFEB3B",
    objetos: [
      {
        nombre: "Abeja",
        color: "Amarillo",
        imagen: require("@/assets/images/iconosJuegos/abeja_amarilla-removebg-preview.png"),
      },
      {
        nombre: "Pato",
        color: "Amarillo",
        imagen: require("@/assets/images/iconosJuegos/Pato_amarillo-removebg-preview.png"),
      },
      {
        nombre: "Platano",
        color: "Amarillo",
        imagen: require("@/assets/images/iconosJuegos/platano_amarillo-removebg-preview.png"),
      },
      {
        nombre: "Carro",
        color: "Amarillo",
        imagen: require("@/assets/images/iconosJuegos/carro_amarillo-removebg-preview.png"),
      },
    ],
  },
  {
    nombreColor: "Naranja",
    fondo: "#FF9800",
    objetos: [
      {
        nombre: "Zanahoria",
        color: "Naranja",
        imagen: require("@/assets/images/iconosJuegos/zanahoria-removebg-preview.png"),
      },
      {
        nombre: "Calabaza",
        color: "Naranja",
        imagen: require("@/assets/images/iconosJuegos/calabaza-naranja-removebg-preview.png"),
      },
      {
        nombre: "Pez",
        color: "Naranja",
        imagen: require("@/assets/images/iconosJuegos/pez-naranja-removebg-preview.png"),
      },
      {
        nombre: "Zorro",
        color: "Naranja",
        imagen: require("@/assets/images/iconosJuegos/zorro_naranja-removebg-preview.png"),
      },
    ],
  },
];

// --- Función para hablar ---
const speak = async (text: string, setSpeaking: (val: boolean) => void) => {
  try {
    if (await Speech.isSpeakingAsync()) await Speech.stop();
    setSpeaking(true);
    Speech.speak(text, {
      language: "es",
      rate: 1.0,
      pitch: 1.0,
      onDone: () => setSpeaking(false),
      onError: (e) => {
        console.log("Error TTS:", e);
        Alert.alert("Error", "No se pudo reproducir el audio.");
        setSpeaking(false);
      },
    });
  } catch (err) {
    console.log("Error al hablar:", err);
  }
};

// --- Tarjeta del color ---
const ColorCard = React.memo(({ data, onSpeak, isSpeaking }: any) => {
  const isLight = ["#FFEB3B", "#FF9800", "#E91E63", "#F44336"].includes(
    data.fondo
  );
  const textColor =
    data.fondo === "#000000" ? "#fff" : isLight ? "#000" : "#fff";
  const shadowColor =
    textColor === "#fff" ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.7)";

  return (
    <View style={[styles.card, { backgroundColor: data.fondo }]}>
      <Text
        style={[
          styles.title,
          {
            color: textColor,
            textShadowColor: shadowColor,
          },
        ]}
      >
        {data.nombreColor}
      </Text>

      <View style={styles.imagesContainer}>
        {data.objetos.map((obj: any, i: number) => (
          <TouchableOpacity
            key={i}
            onPress={() => onSpeak(`${obj.nombre} es ${obj.color}`)}
            disabled={isSpeaking}
          >
            <Image
              source={obj.imagen}
              style={styles.image}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
});

ColorCard.displayName = "ColorCard";

// --- Componente principal ---
export default function NivelMedio() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const handleSpeak = useCallback(
    (text: string) => {
      if (!isSpeaking) speak(text, setIsSpeaking);
    },
    [isSpeaking]
  );

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / ITEM_WIDTH);
    if (index !== currentIndex) setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < NIVELES.length - 1) {
      const next = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      setCurrentIndex(next);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prev = currentIndex - 1;
      flatListRef.current?.scrollToIndex({ index: prev, animated: true });
      setCurrentIndex(prev);
    }
  };

  const handleGoBack = () => {
    Speech.stop();
    router.back();
  };

  const renderPaginator = () => (
    <View style={styles.paginator}>
      {NIVELES.map((_, idx) => (
        <View
          key={idx}
          style={[styles.dot, idx === currentIndex && styles.dotActive]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Botón Volver */}
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>

      {/* Lista de niveles */}
      <FlatList
        ref={flatListRef}
        data={NIVELES}
        keyExtractor={(_, i) => i.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <ColorCard
            data={item}
            onSpeak={handleSpeak}
            isSpeaking={isSpeaking}
          />
        )}
      />

      {/* Navegación y paginación */}
      <View style={styles.navContainer}>
        <TouchableOpacity
          onPress={handlePrev}
          disabled={currentIndex === 0 || isSpeaking}
          style={[
            styles.navButton,
            currentIndex === 0 && styles.navButtonDisabled,
          ]}
        >
          <MaterialCommunityIcons name="chevron-left" size={32} color="#fff" />
        </TouchableOpacity>

        {renderPaginator()}

        <TouchableOpacity
          onPress={handleNext}
          disabled={currentIndex === NIVELES.length - 1 || isSpeaking}
          style={[
            styles.navButton,
            currentIndex === NIVELES.length - 1 && styles.navButtonDisabled,
          ]}
        >
          <MaterialCommunityIcons name="chevron-right" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    left: 20,
    backgroundColor: "rgba(68, 68, 68, 0.7)",
    padding: 8,
    paddingRight: 15,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
  },
  backText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 5,
    fontWeight: "600",
  },
  card: {
    width: ITEM_WIDTH,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 80,
    fontWeight: "bold",
    marginBottom: 40,
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 8,
    textAlign: "center",
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 25,
  },
  image: {
    width: 100,
    height: 100,
  },
  navContainer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  navButton: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 8,
    borderRadius: 25,
  },
  navButtonDisabled: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  paginator: {
    flexDirection: "row",
    justifyContent: "center",
    flex: 1,
  },
  dot: {
    height: 10,
    width: 10,
    backgroundColor: "rgba(255,255,255,0.5)",
    marginHorizontal: 4,
    borderRadius: 5,
  },
  dotActive: {
    width: 15,
    backgroundColor: "white",
  },
});
