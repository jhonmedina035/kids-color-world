import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator, FlatList, Alert, NativeSyntheticEvent, NativeScrollEvent, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router'; 
// *** IMPORTACIÓN NATIVA DE TTS (EXPO) ***
import * as Speech from 'expo-speech'; 

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width;
const ICON_SIZE = 28;

// --- 1. CONFIGURACIÓN Y DATOS DE COLORES ---

interface ColorData {
 id: string;
 name: string; // Nombre del color en español (para la pantalla y TTS)
 colorCode: string; // Código de color (para el fondo)
}

const COLORS: ColorData[] = [
 { id: '1', name: 'Rojo', colorCode: '#F44336' }, // Rojo
 { id: '2', name: 'Verde', colorCode: '#4CAF50' }, // Verde
 { id: '3', name: 'Azul', colorCode: '#2196F3' }, // Azul
 { id: '4', name: 'Amarillo', colorCode: '#FFEB3B' }, // Amarillo
 { id: '5', name: 'Naranja', colorCode: '#FF9800' }, // Naranja
 { id: '6', name: 'Morado', colorCode: '#9C27B0' }, // Morado
 { id: '7', name: 'Rosa', colorCode: '#E91E63' }, // Rosa
 { id: '8', name: 'Negro', colorCode: '#000000' }, // Negro
];

// ------------------------------------------------------------------
// --- 2. UTILIDADES PARA TTS (ACTUALIZADO A EXPO-SPEECH) ---
// ------------------------------------------------------------------

/**
 * Función para reproducir el texto usando la API nativa de Text-to-Speech.
 * Reemplaza callTtsApi, pcmToWav, base64ToArrayBuffer y playAudio.
 */
const speakText = async (text: string, setPlaying: (value: boolean) => void) => {
  if (await Speech.isSpeakingAsync()) {
    await Speech.stop();
  }

  setPlaying(true);
  
  try {
    Speech.speak(text, {
      // Usa español (es) para asegurar una voz apropiada.
      language: 'es', 
      onDone: () => setPlaying(false),
      onError: (e) => {
        console.error("Error de Speech:", e);
        setPlaying(false);
        Alert.alert("Error de Voz", "No se pudo reproducir el audio.");
      }
    });
  } catch (error) {
    console.error("Error al iniciar Speech:", error);
    setPlaying(false);
    Alert.alert("Error de Voz", "Ocurrió un error al intentar hablar.");
  }
};

// --- 3. COMPONENTE DE LA TARJETA DE COLOR ---

interface ColorCardProps {
  data: ColorData;
  onSpeak: (name: string) => void;
  isSpeaking: boolean;
}

const ColorCard: React.FC<ColorCardProps> = React.memo(({ data, onSpeak, isSpeaking }) => {
  // Determine el color de contraste para el texto
  const isLight = ['#FFEB3B', '#FF9800', '#E91E63', '#F44336'].includes(data.colorCode); 
  const textColor = data.colorCode === '#000000' ? '#fff' : (isLight ? '#000' : '#fff');
  const shadowColor = textColor === '#fff' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.7)'; 
  
  const colorStyle = {
    color: textColor,
    textShadowColor: shadowColor,
  };
  
 
  const ttsText = `El color es ${data.name}.`;

  return (
    <View style={[styles.cardContainer, { backgroundColor: data.colorCode }]}>
      <Text style={[styles.colorName, colorStyle]}>{data.name}</Text>
      
      <TouchableOpacity 
        style={[styles.listenButton, { backgroundColor: data.colorCode === '#000000' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.4)'}]} 
        onPress={() => onSpeak(ttsText)}
        disabled={isSpeaking}
      >
        {isSpeaking ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <View style={styles.listenButtonContent}>
            <Text style={styles.listenButtonText}>Escuchar</Text>
            <MaterialCommunityIcons name="volume-high" size={ICON_SIZE} color="white" />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
});

// --- 4. COMPONENTE PRINCIPAL (FlatList) ---

const AprenderColores = () => {
  const router = useRouter(); 
  const flatListRef = useRef<FlatList<ColorData>>(null); 
  
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0); 
  
  // Limpiar TTS al salir del componente
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);
  
  // Función TTS que se pasa a cada tarjeta
  // *** LLAMA A LA NUEVA FUNCIÓN NATIVA ***
  const handleSpeak = useCallback((text: string) => {
    if (!isSpeaking) {
      speakText(text, setIsSpeaking);
    }
  }, [isSpeaking]);
  
  // Componente de renderizado de cada tarjeta
  const renderItem = useCallback(({ item }: { item: ColorData }) => (
    <ColorCard 
      data={item} 
      onSpeak={handleSpeak} 
      isSpeaking={isSpeaking}
    />
  ), [handleSpeak, isSpeaking]);

  // Lógica para actualizar el índice de paginación
  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const xOffset = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(xOffset / ITEM_WIDTH);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  }, [currentIndex]);


  // Navegación hacia atrás (color anterior)
  const handlePrev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
      setCurrentIndex(newIndex);
    }
  };

  // Navegación hacia adelante (siguiente color)
  const handleNext = () => {
    if (currentIndex < COLORS.length - 1) {
      const newIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
      setCurrentIndex(newIndex);
    }
  };

  // Función para volver al menú principal
  const handleGoBack = () => {
    // Asegurar que el audio se detenga antes de cambiar de pantalla
    Speech.stop(); 
    router.back(); 
  };

  // Renderizar los puntos de paginación
  const renderPaginator = () => (
    <View style={styles.paginatorContainer}>
      {COLORS.map((_, index) => (
        <View 
          key={index} 
          style={[
            styles.dot, 
            index === currentIndex ? styles.dotActive : null 
          ]} 
        />
      ))}
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      {/* Botón Volver al menú */}
      <TouchableOpacity style={styles.backButtonTop} onPress={handleGoBack}>
        <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef} 
        data={COLORS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll} 
        scrollEventThrottle={16}
        getItemLayout={(data, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
      />
      
      {/* Controles de navegación y paginación */}
      <View style={styles.navigationControls}>
        
        {/* Botón Anterior (dentro de la lista de colores) */}
        <TouchableOpacity 
          style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]} 
          onPress={handlePrev}
          disabled={currentIndex === 0 || isSpeaking}
        >
          <MaterialCommunityIcons name="chevron-left" size={32} color="#fff" />
        </TouchableOpacity>

        {/* Paginación de puntos */}
        {renderPaginator()} 
        
        {/* Botón Siguiente (dentro de la lista de colores) */}
        <TouchableOpacity 
          style={[styles.navButton, currentIndex === COLORS.length - 1 && styles.navButtonDisabled]} 
          onPress={handleNext}
          disabled={currentIndex === COLORS.length - 1 || isSpeaking}
        >
          <MaterialCommunityIcons name="chevron-right" size={32} color="#fff" />
        </TouchableOpacity>
        
      </View>
      
    </View>
  );
};

// --- 5. ESTILOS ---

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  backButtonTop: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40, // Ajuste para iOS (notch)
    left: 20,
    backgroundColor: 'rgba(68, 68, 68, 0.7)', 
    padding: 8,
    paddingRight: 15,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
    fontWeight: '600',
  },
  cardContainer: {
    width: ITEM_WIDTH,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  colorName: {
    fontSize: 80, 
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 8,
  },
  listenButton: {
    padding: 15,
    borderRadius: 30,
    minWidth: 150,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
  },
  listenButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listenButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
  },
  
  navigationControls: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around', 
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  navButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    padding: 8, 
    borderRadius: 25,
    marginHorizontal: 30, 
  },
  navButtonDisabled: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  paginatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1, 
  },
  dot: {
    height: 10,
    width: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
    borderRadius: 5,
  },
  dotActive: {
    width: 15, 
    backgroundColor: 'white', 
  }
});

export default AprenderColores;