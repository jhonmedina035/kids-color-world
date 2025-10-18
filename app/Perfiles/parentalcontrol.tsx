import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ParentalControlScreen() {
  const router = useRouter();
  const [value, setResponse] = useState('');
  const [questions, setQuestions] = useState<any>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Generar 10 preguntas simples
  useEffect(() => {
    const generateQuestions = () => {
      const qArray = [];
      while (qArray.length < 10) {
        const a = Math.floor(Math.random() * 20) + 1;
        const b = Math.floor(Math.random() * 20) + 1;
        const isSum = Math.random() < 0.5;

        const question = isSum ? `${a} + ${b}` : `${a} - ${b}`;
        const answer = isSum ? a + b : a - b;

        qArray.push({ question, answer });
      }
      setQuestions(qArray);
    };

    generateQuestions();
  }, []);

  const handlePress = () => {
    const currentQuestion = questions[currentQuestionIndex];

    if (!currentQuestion) return;

    if (parseInt(value) === currentQuestion.answer) {
      Alert.alert('¡Correcto!', 'Respuesta correcta 🎉');
      setResponse('');
      //entrar a configuración
      router.navigate('/Perfiles/config')
      

    } else {
      Alert.alert('Incorrecto', 'Intenta de nuevo ❌');
      setResponse('');
      //si se equivoca pasa a la siquiente pregunta
      const nextIndex = (currentQuestionIndex + 1) % questions.length;
      setCurrentQuestionIndex(nextIndex);
    }
  };

  if (questions.length === 0) {
    return (
      <LinearGradient colors={["#C5A6FF", "#B0E0FF"]} style={styles.container}>
        <Text style={styles.titleContainer}>Cargando preguntas...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#C5A6FF", "#B0E0FF"]} style={styles.container}>
      <View style={{flex:1, marginTop:20}}>
        <Text style={styles.titleContainer}>Responde la siguiente pregunta</Text>

        <Text style={[styles.label, {marginTop:40, textAlign:'center', fontSize:22}]}>
          {questions[currentQuestionIndex].question}
        </Text>

        <View style={{alignItems:'center', marginTop:30}}>
          <TextInput
            style={styles.input}
            placeholder="Ingrese la respuesta"
            value={value}
            onChangeText={setResponse}
            keyboardType="numeric"
          />
        </View>

        <View style={{ flexDirection:'row', marginTop:50, justifyContent:'center'}}>
          <TouchableOpacity style={styles.button} onPress={handlePress}>                              
            <Text style={styles.buttonText}>Comprobar</Text>                              
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
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
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
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
});
