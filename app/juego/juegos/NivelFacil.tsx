import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, FlatList, Alert, NativeSyntheticEvent, NativeScrollEvent, Platform, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router'; 
import * as Speech from 'expo-speech'; 


const { width } = Dimensions.get('window');
const ITEM_WIDTH = width;

// Ruta base para las imágenes, asumiendo la estructura del usuario.
const IMAGE_BASE_PATH = '../../../assets/images/iconosJuegos/';

// --- 1. CONFIGURACIÓN Y DATOS DE COLORES Y JUEGO ---

interface ColorGameData {
  id: string;
  name: string; 
  colorCode: string; 
  question: string; 
  targetColor: string; 
  images: { id: string; src: any; color: string; }[]; 
}


// Nota: Se han descomentado y completado todos los niveles, asumiendo que las imágenes existen en el path.
const IMAGES_BY_COLOR = {
  azul: [
    { id: 'pez_azul', src: require(`${IMAGE_BASE_PATH}pez_azul-removebg-preview.png`), color: 'azul' },
    { id: 'mariposa_azul', src: require(`${IMAGE_BASE_PATH}mariposa_azul-removebg-preview.png`), color: 'azul' }, 
    { id: 'fresa_roja', src: require(`${IMAGE_BASE_PATH}Fresa_roja-removebg-preview.png`), color: 'rojo' },
    { id: 'manzana_verde', src: require(`${IMAGE_BASE_PATH}manzana_verde-removebg-preview.png`), color: 'verde' },
  ],
  amarillo: [
    { id: 'pato_amarillo', src: require(`${IMAGE_BASE_PATH}Pato_amarillo-removebg-preview.png`), color: 'amarillo' },
    { id: 'platano_amarillo', src: require(`${IMAGE_BASE_PATH}platano_amarillo-removebg-preview.png`), color: 'amarillo' },
    { id: 'cereza_roja', src: require(`${IMAGE_BASE_PATH}cereza_roja-removebg-preview.png`), color: 'rojo' },
    { id: 'hoja_verde', src: require(`${IMAGE_BASE_PATH}hoja_verde-removebg-preview.png`), color: 'verde' },
  ],
  verde: [
    { id: 'bicicleta_verde', src: require(`${IMAGE_BASE_PATH}bicicleta_verde-removebg-preview.png`), color: 'verde' },
    { id: 'manzana_verde_2', src: require(`${IMAGE_BASE_PATH}manzana_verde-removebg-preview.png`), color: 'verde' },
    { id: 'abeja_amarilla', src: require(`${IMAGE_BASE_PATH}abeja_amarilla-removebg-preview.png`), color: 'amarillo' },
    { id: 'mochila_roja', src: require(`${IMAGE_BASE_PATH}mochila_roja-removebg-preview.png`), color: 'rojo' },
  ],
  rojo: [
    { id: 'fresa_roja_2', src: require(`${IMAGE_BASE_PATH}Fresa_roja-removebg-preview.png`), color: 'rojo' },
    { id: 'mochila_roja_2', src: require(`${IMAGE_BASE_PATH}mochila_roja-removebg-preview.png`), color: 'rojo' },
    { id: 'mariposa_azul_2', src: require(`${IMAGE_BASE_PATH}mariposa_azul-removebg-preview.png`), color: 'azul' },
    { id: 'bicicleta_verde_2', src: require(`${IMAGE_BASE_PATH}bicicleta_verde-removebg-preview.png`), color: 'verde' },
  ],
  naranja: [
    { id: 'naranja_fruta', src: require(`${IMAGE_BASE_PATH}naranja-removebg-preview.png`), color: 'naranja' },
    { id: 'zanahoria', src: require(`${IMAGE_BASE_PATH}zanahoria-removebg-preview.png`), color: 'naranja' },
    { id: 'uva', src: require(`${IMAGE_BASE_PATH}uva-removebg-preview.png`), color: 'morado' },
    { id: 'limon', src: require(`${IMAGE_BASE_PATH}limon-removebg-preview.png`), color: 'amarillo' },
  ],
  morado: [
    { id: 'uva_morada', src: require(`${IMAGE_BASE_PATH}uva-removebg-preview.png`), color: 'morado' },
    { id: 'berenjena', src: require(`${IMAGE_BASE_PATH}berenjena-removebg-preview.png`), color: 'morado' },
    { id: 'cereza', src: require(`${IMAGE_BASE_PATH}cereza_roja-removebg-preview.png`), color: 'rojo' },
    { id: 'fresa', src: require(`${IMAGE_BASE_PATH}Fresa_roja-removebg-preview.png`), color: 'rojo' },
  ],
  rosa: [
    { id: 'flor_rosa', src: require(`${IMAGE_BASE_PATH}flor_rosa-removebg-preview.png`), color: 'rosa' },
    { id: 'cerdito', src: require(`${IMAGE_BASE_PATH}cerdito-removebg-preview.png`), color: 'rosa' },
    { id: 'azul_pez', src: require(`${IMAGE_BASE_PATH}pez_azul-removebg-preview.png`), color: 'azul' },
    { id: 'verde_manzana', src: require(`${IMAGE_BASE_PATH}manzana_verde-removebg-preview.png`), color: 'verde' },
  ],
  negro: [
    { id: 'gato_negro', src: require(`${IMAGE_BASE_PATH}gato_negro-removebg-preview.png`), color: 'negro' },
    { id: 'neumatico_negro', src: require(`${IMAGE_BASE_PATH}neumatico_negro-removebg-preview.png`), color: 'negro' },
    { id: 'amarillo_pato', src: require(`${IMAGE_BASE_PATH}Pato_amarillo-removebg-preview.png`), color: 'amarillo' },
    { id: 'rojo_fresa', src: require(`${IMAGE_BASE_PATH}Fresa_roja-removebg-preview.png`), color: 'rojo' },
  ],
};


const GAME_LEVELS: ColorGameData[] = [
  { 
    id: 'azul', 
    name: 'Azul', 
    colorCode: '#2196F3', 
    question: 'Dónde está el color azul', 
    targetColor: 'azul', 
    images: IMAGES_BY_COLOR.azul
  },
  { 
    id: 'amarillo', 
    name: 'Amarillo', 
    colorCode: '#FFEB3B', 
    question: 'Dónde está el color amarillo', 
    targetColor: 'amarillo', 
    images: IMAGES_BY_COLOR.amarillo
  },
  { 
    id: 'verde', 
    name: 'Verde', 
    colorCode: '#4CAF50', 
    question: 'Dónde está el color verde', 
    targetColor: 'verde', 
    images: IMAGES_BY_COLOR.verde
  },
  { 
    id: 'rojo', 
    name: 'Rojo', 
    colorCode: '#F44336', 
    question: 'Dónde está el color rojo', 
    targetColor: 'rojo', 
    images: IMAGES_BY_COLOR.rojo
  },
  { 
    id: 'naranja', 
    name: 'Naranja', 
    colorCode: '#FF9800', 
    question: 'Dónde está el color naranja', 
    targetColor: 'naranja', 
    images: IMAGES_BY_COLOR.naranja
  },
  { 
    id: 'morado', 
    name: 'Morado', 
    colorCode: '#9C27B0', 
    question: 'Dónde está el color morado', 
    targetColor: 'morado', 
    images: IMAGES_BY_COLOR.morado
  },
  { 
    id: 'rosa', 
    name: 'Rosa', 
    colorCode: '#E91E63', 
    question: 'Dónde está el color rosa', 
    targetColor: 'rosa', 
    images: IMAGES_BY_COLOR.rosa
  },
  { 
    id: 'negro', 
    name: 'Negro', 
    colorCode: '#000000', 
    question: 'Dónde está el color negro', 
    targetColor: 'negro', 
    images: IMAGES_BY_COLOR.negro
  },
];

// --- 2. COMPONENTE DE LA TARJETA DEL JUEGO DE COLOR ---

interface ColorGameCardProps {
  data: ColorGameData;
  onCorrectAnswer: () => void; // Callback para avanzar al siguiente nivel
  isSpeaking: boolean;
  setIsSpeaking: (value: boolean) => void;
  cardIndex: number; // Nuevo: índice de esta tarjeta
  currentIndex: number; // Nuevo: índice de la tarjeta visible (actual)
}

const ColorGameCard: React.FC<ColorGameCardProps> = React.memo(({ data, onCorrectAnswer, isSpeaking, setIsSpeaking, cardIndex, currentIndex }) => {
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false); 
  // FIX: Se cambió el tipo de useRef a 'any' para evitar el conflicto con el tipo de retorno de setTimeout (number vs NodeJS.Timeout)
  const speakingTimeoutRef = useRef<any | null>(null); // Ref para el timeout de fallback

  // Determinar color del texto de la pregunta para contraste
  const getQuestionTextColor = (colorName: string) => {
    switch (colorName) {
      case 'amarillo': return '#000'; // Negro para amarillo
      case 'negro': return '#fff'; // Blanco para negro
      default: return '#000'; // Predeterminado negro
    }
  };

  // Hablar el texto usando expo-speech (CON LÓGICA DE FALLBACK AÑADIDA para prevenir el bloqueo)
  const speak = useCallback(async (text: string, options?: Speech.SpeechOptions) => {
    if (await Speech.isSpeakingAsync()) {
      await Speech.stop();
    }

    // Limpiar timeout de fallback anterior si existe
    if (speakingTimeoutRef.current) {
        clearTimeout(speakingTimeoutRef.current);
        speakingTimeoutRef.current = null;
    }
    
    // Función para garantizar que isSpeaking se desactive
    const finishSpeaking = () => {
        setIsSpeaking(false);
        if (speakingTimeoutRef.current) {
            clearTimeout(speakingTimeoutRef.current);
            speakingTimeoutRef.current = null;
        }
    };

    setIsSpeaking(true);

    // Configurar timeout de fallback (5 segundos) por si las callbacks fallan
    speakingTimeoutRef.current = setTimeout(() => {
        console.warn('TTS Fallback: Forzando isSpeaking a false después de 5s. La interfaz será desbloqueada.');
        finishSpeaking();
    }, 5000);

    Speech.speak(text, {
      language: 'es',
      onDone: () => {
        finishSpeaking();
      },
      onError: (e) => {
        console.error("Error de Speech:", e);
        finishSpeaking();
      },
      ...options
    });
  }, [setIsSpeaking]);

  // Limpiar el timeout al desmontar
  useEffect(() => {
    return () => {
      if (speakingTimeoutRef.current) {
        clearTimeout(speakingTimeoutRef.current);
      }
    };
  }, []);

  // Leer la pregunta SOLO si esta es la tarjeta actual y no ha hablado antes
  useEffect(() => {
    // Si la tarjeta actual es esta y no ha hablado
    if (cardIndex === currentIndex && !hasSpoken) {
      // Esperar un poco para el scroll
      const timer = setTimeout(() => {
        // Solo hablar si nadie más está hablando (isSpeaking es global de la app)
        if (!isSpeaking) {
            speak(data.question, { rate: 0.9 }); 
            setHasSpoken(true); // Marcamos como hablado
        } else {
            // Si ya estaba hablando cuando llegamos, marcamos como hablado para no repetirlo
            setHasSpoken(true);
        }
      }, 500); 
      return () => {
          clearTimeout(timer); // Limpiar el timer si se mueve antes
      };
    }
    
    // Si la tarjeta deja de ser la actual
    if (cardIndex !== currentIndex) {
        setHasSpoken(false);
        // Detenemos el audio si el usuario hace scroll rápidamente
        Speech.stop(); 
    }

  }, [cardIndex, currentIndex, data.question, speak]); // Quitamos isSpeaking y hasSpoken de deps

  const handleImagePress = useCallback(async (imageColor: string, imageId: string) => {
    // Si está hablando o ya ha respondido, salimos
    if (isSpeaking || answeredCorrectly) return; 

    setSelectedImageId(imageId); // Marcar la imagen seleccionada

    if (imageColor === data.targetColor) {
      setAnsweredCorrectly(true); // Marcar como correcto
      await speak("¡Correcto! Muy bien.", { pitch: 1.2 }); // Voz más animada
      setTimeout(() => {
        setAnsweredCorrectly(false); // Reiniciar estado para la siguiente tarjeta
        setSelectedImageId(null);
        onCorrectAnswer(); // Avanzar a la siguiente tarjeta
      }, 1500); // Dar tiempo para el feedback visual y de audio
    } else {
      // Mensaje de error, recalcando el color buscado
      await speak(`Este no es. Inténtalo de nuevo. Buscamos el color ${data.targetColor}.`, { pitch: 0.9 }); 
      setTimeout(() => {
        setSelectedImageId(null); // Quitar selección después del feedback
      }, 1000);
    }
  }, [data.targetColor, onCorrectAnswer, isSpeaking, answeredCorrectly, speak]);

  const questionParts = data.question.split(data.targetColor);
  
  // FIX DE TIPADO: quitamos 'fontWeight' de aquí ya que styles.questionText ya lo tiene.
  const targetColorStyle = { color: data.colorCode }; 

  return (
    <View style={styles.cardContainer}>
      {/* Pregunta */}
      <View style={styles.questionContainer}>
        {/* Aquí mostramos la pregunta, resaltando el color objetivo */}
        {questionParts.map((part, index) => (
          <React.Fragment key={index}>
            <Text style={[styles.questionText, { color: getQuestionTextColor(data.targetColor) }]}>
              {part}
            </Text>
            {/* Si no es el último fragmento, insertamos el color resaltado */}
            {index < questionParts.length - 1 && (
              <Text style={[styles.questionText, targetColorStyle]}> 
                {data.targetColor}
              </Text>
            )}
          </React.Fragment>
        ))}
        {/* Indicador de carga cuando la voz está activa */}
        {isSpeaking && cardIndex === currentIndex && (
          <ActivityIndicator size="small" color="#000" style={{ marginLeft: 10 }} />
        )}
      </View>

      {/* Imágenes clicables */}
      <View style={styles.imagesGrid}>
        {data.images.map((image) => (
          <TouchableOpacity
            key={image.id}
            style={[
              styles.imageButton,
              selectedImageId === image.id && styles.selectedImageButton,
              answeredCorrectly && image.color === data.targetColor && styles.correctImageButton,
              answeredCorrectly && image.color !== data.targetColor && selectedImageId === image.id && styles.incorrectImageButton,
            ]}
            onPress={() => handleImagePress(image.color, image.id)}
            // La propiedad 'disabled' depende de isSpeaking
            disabled={isSpeaking || answeredCorrectly} 
          >
            <Image source={image.src} style={styles.gameImage} resizeMode="contain" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
});

// --- 3. COMPONENTE PRINCIPAL (FlatList) ---

const NivelFacil = () => {
  const router = useRouter(); 
  const flatListRef = useRef<FlatList<ColorGameData>>(null); 
  
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0); 
  
  // Limpiar TTS al salir del componente
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);
  
  // Lógica para actualizar el índice de paginación
  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const xOffset = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(xOffset / ITEM_WIDTH);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  }, [currentIndex]);

  const handleCorrectAnswer = useCallback(() => {
    if (currentIndex < GAME_LEVELS.length - 1) {
      const newIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
      setCurrentIndex(newIndex);
    } else {
      Alert.alert("¡Felicidades!", "Has completado todos los niveles de colores.", [
        { text: "Volver al menú", onPress: () => router.back() }
      ]);
      Speech.speak("¡Felicidades! Has completado todos los niveles de colores.", { language: 'es' });
    }
  }, [currentIndex, router]);

  // Función para volver al menú principal
  const handleGoBack = () => {
    Speech.stop(); 
    router.back(); 
  };

  return (
    <View style={styles.mainContainer}>
      {/* Botón Volver al menú */}
      <TouchableOpacity style={styles.backButtonTop} onPress={handleGoBack}>
        <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef} 
        data={GAME_LEVELS}
        renderItem={({ item, index }) => ( // <- Añadimos 'index' aquí
          <ColorGameCard 
            data={item} 
            cardIndex={index} // <- Pasamos el índice de la tarjeta
            currentIndex={currentIndex} // <- Pasamos el índice actual de la FlatList
            onCorrectAnswer={handleCorrectAnswer} 
            isSpeaking={isSpeaking}
            setIsSpeaking={setIsSpeaking}
          />
        )}
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
    </View>
  );
};

// --- 4. ESTILOS ---

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#ADD8E6', // Un fondo claro para los juegos
  },
  backButtonTop: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40, 
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
    paddingTop: 120, // Más padding superior para el botón de volver
    paddingBottom: 20,
  },
  questionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  questionText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 40,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '90%',
    marginTop: 20,
  },
  imageButton: {
    width: '45%', // Ajuste para 2 columnas con espacio
    height: 150,
    marginVertical: 10,
    marginHorizontal: '2.5%', // Espacio entre columnas
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedImageButton: {
    borderColor: '#FFD700', 
    borderWidth: 4,
  },
  correctImageButton: {
    borderColor: '#4CAF50', 
    borderWidth: 4,
  },
  incorrectImageButton: {
    borderColor: '#F44336', 
    borderWidth: 4,
  },
  gameImage: {
    width: '80%',
    height: '80%',
  },
});

export default NivelFacil;
