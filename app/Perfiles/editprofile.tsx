import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EditProfileScreen() {   
  const router = useRouter(); 
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState(''); // <-- Nuevo estado

  const { data }:any = useLocalSearchParams(); // obtiene los parámetros
  const profile = data ? JSON.parse(data) : null; // convierte el string a objeto

 useEffect(() => {
    if (profile) {
      console.log('Perfil recibido:', profile);
      setName(profile.name)   
      setSelectedDifficulty(profile.dificult)
    }
  }, [profile]);

  const handlePress = () => {
    alert(`Hola, ${name || 'desconocido'}! Dificultad: ${selectedDifficulty || 'No seleccionada'}`);
  };

  const editProfile = () => {
    router.navigate('/Perfiles/profilemanagement')
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería para seleccionar una imagen.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const scaleAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Función para cambiar la dificultad seleccionada
  const selectDifficulty = (difficulty:string) => {
    setSelectedDifficulty(difficulty);
  };

  return (
    <LinearGradient colors={["#C5A6FF", "#B0E0FF"]} style={styles.container}>
      <View style={styles.overlay}>
        <Text style={styles.titleContainer}>Editar perfil</Text>

        <View style={{ justifyContent: 'flex-start', top: 20, alignItems: 'center' }}>
          <TouchableOpacity onPress={pickImage}>
            <View style={styles.circle}>
              <Image
               source={image? { uri: image } // si el usuario seleccionó una nueva foto con ImagePicker
                    : profile?.image || require('@/assets/images/profile.png') // usa la imagen local o la predeterminada
                }
                  style={styles.profile}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, paddingLeft: 20 }}>
          <Text style={styles.label}>Nombre:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa el nombre"
            value={name}
            onChangeText={setName}
          />

          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            marginTop: 30,
            marginBottom: 20,
            textAlign: 'center',
            color: 'white',
          }}>
            Dificultad
          </Text>

          <View style={styles.buttonDifficulty}>
            {['Fácil', 'Medio', 'Difícil'].map((difficulty) => (
              <TouchableOpacity
                key={difficulty}
                style={[
                  styles.button,
                  selectedDifficulty === difficulty && { backgroundColor: '#465f95ff' } // Color al seleccionar
                ]}
                onPress={() => selectDifficulty(difficulty)}
              >
                <Text style={styles.buttonText}>{difficulty}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ flex: 1, marginTop: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity style={styles.button} onPress={() => editProfile()}>
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,  
    paddingHorizontal: 20,
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  overlay: {
    flex: 1,
    width: '100%',
  },
  titleContainer: {
    fontSize: 25,
    color: 'white',
    textAlign: 'center',
    marginTop: 100,
    fontWeight: 'bold',
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profile: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    color: 'white',
  },
  input: {
    width: '90%',
    height: 40,
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  buttonDifficulty: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  button: {
    backgroundColor: '#6F99F4',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
