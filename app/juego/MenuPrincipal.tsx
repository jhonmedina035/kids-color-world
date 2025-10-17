import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator, FlatList, Alert, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router'; 

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
];

// --- 2. UTILIDADES PARA TTS ---

// Función para decodificar Base64 a ArrayBuffer (necesaria para el TTS)
const base64ToArrayBuffer = (base64: string) => {
    if (typeof atob === 'undefined') {
        console.error("atob no disponible. No se puede decodificar el audio.");
        return new ArrayBuffer(0);
    }
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
};

// Función para convertir datos PCM a un Blob de archivo WAV
const pcmToWav = (pcmData: Int16Array, sampleRate: number) => {
    const buffer = new ArrayBuffer(44 + pcmData.length * 2);
    const view = new DataView(buffer);
    let offset = 0;

    const writeString = (str: string) => {
        for (let i = 0; i < str.length; i++) {
            view.setUint8(offset + i, str.charCodeAt(i));
        }
        offset += str.length;
    };

    // Escribir encabezado RIFF (RIFF Chunk)
    writeString('RIFF'); view.setUint32(offset, 36 + pcmData.length * 2, true); offset += 4;
    writeString('WAVE'); offset += 4;
    writeString('fmt '); view.setUint32(offset, 16, true); offset += 4; 
    view.setUint16(offset, 1, true); offset += 2; 
    view.setUint16(offset, 1, true); offset += 2;  
    view.setUint32(offset, sampleRate, true); offset += 4; 
    view.setUint32(offset, sampleRate * 2, true); offset += 4; 
    view.setUint16(offset, 2, true); offset += 2;  
    view.setUint16(offset, 16, true); offset += 2; 
    writeString('data'); view.setUint32(offset, pcmData.length * 2, true); offset += 4;

    // Escribir datos PCM
    for (let i = 0; i < pcmData.length; i++) {
        view.setInt16(offset, pcmData[i], true); offset += 2;
    }

    return new Blob([buffer], { type: 'audio/wav' });
};

// Función para reproducir el audio
const playAudio = (audioUrl: string) => {
    if (typeof Audio === 'undefined') {
        console.warn("La reproducción de audio no está disponible en este entorno.");
        return;
    }
    try {
        const audio = new Audio(audioUrl);
        audio.play().catch(e => console.error("Error al intentar reproducir audio:", e));
    } catch (e) {
        console.error("Error al crear el objeto de Audio:", e);
    }
};

// Función para llamar a la API de TTS con reintentos
const callTtsApi = async (text: string, setPlaying: (value: boolean) => void) => {
    const MAX_RETRIES = 5;
    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ parts: [{ text: text }] }],
        generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: "Kore" } 
                }
            }
        },
        model: "gemini-2.5-flash-preview-tts"
    };

    setPlaying(true);
    let success = false;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                if (response.status === 429 && attempt < MAX_RETRIES - 1) {
                    const delay = Math.pow(2, attempt) * 1000;
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue; 
                }
                throw new Error(`Fallo de la llamada a la API con estado: ${response.status}`);
            }

            const result = await response.json();
            const part = result?.candidates?.[0]?.content?.parts?.[0];
            const audioData = part?.inlineData?.data;
            const mimeType = part?.inlineData?.mimeType;

            if (audioData && mimeType && mimeType.startsWith("audio/")) {
                const rateMatch = mimeType.match(/rate=(\d+)/);
                const sampleRate = rateMatch ? parseInt(rateMatch[1], 10) : 24000;
                
                const pcmBuffer = base64ToArrayBuffer(audioData);
                const pcm16 = new Int16Array(pcmBuffer); 

                const wavBlob = pcmToWav(pcm16, sampleRate);
                const audioUrl = URL.createObjectURL(wavBlob);
                
                playAudio(audioUrl);
                success = true;
                break; // Éxito
            } else {
                console.error("Estructura de respuesta inesperada:", result);
            }
        } catch (error) {
            console.error(`Intento ${attempt + 1} fallido:`, error);
        }
    }
    setPlaying(false);
    
    if (!success) {
        Alert.alert("Error de Voz", "No pudimos cargar el audio. Por favor, inténtalo de nuevo más tarde.");
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
    const textColor = data.colorCode === '#FFEB3B' ? '#000' : '#fff'; // Negro para el amarillo
    
    // Tono para el texto del nombre del color
    const colorStyle = {
        color: textColor,
        textShadowColor: data.colorCode === '#FFEB3B' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.9)',
    };
    
    // El texto que se lee
    const ttsText = `El color es ${data.name}.`;

    return (
        <View style={[styles.cardContainer, { backgroundColor: data.colorCode }]}>
            <Text style={[styles.colorName, colorStyle]}>{data.name}</Text>
            
            <TouchableOpacity 
                style={styles.listenButton} 
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
    
    // Función TTS que se pasa a cada tarjeta
    const handleSpeak = useCallback((text: string) => {
        if (!isSpeaking) {
            callTtsApi(text, setIsSpeaking);
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


    // Función UNIFICADA para la acción de ir ATRÁS (Color anterior o Salir)
    const handlePrevAction = () => {
        if (isSpeaking) return; // Evitar acciones mientras se reproduce el audio
        
        if (currentIndex > 0) {
            // Si NO es el primer color, ve al color anterior
            const newIndex = currentIndex - 1;
            flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
            setCurrentIndex(newIndex);
        } else {
            // Si es el primer color (índice 0), vuelve al menú principal
            router.back(); 
        }
    };

    // Navegación hacia adelante (siguiente color)
    const handleNext = () => {
        if (isSpeaking) return;
        
        if (currentIndex < COLORS.length - 1) {
            const newIndex = currentIndex + 1;
            flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
            setCurrentIndex(newIndex);
        }
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
                
                {/* Botón ATRÁS UNIFICADO:
                  Si currentIndex > 0 -> Color Anterior
                  Si currentIndex === 0 -> Volver al Menú
                */}
                <TouchableOpacity 
                    style={styles.navButton} 
                    onPress={handlePrevAction}
                    disabled={isSpeaking}
                >
                    <MaterialCommunityIcons name="chevron-left" size={32} color="#fff" />
                </TouchableOpacity>

                {/* Paginación de puntos */}
                {renderPaginator()} 
                
                {/* Botón Siguiente (solo avanza, se deshabilita en el último color) */}
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
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
    
    // Estilos de la barra de navegación inferior
    navigationControls: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    // El botón de Volver ha sido integrado con el botón de navegación izquierda (navButton)
    navButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)', 
        padding: 8, 
        borderRadius: 25,
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