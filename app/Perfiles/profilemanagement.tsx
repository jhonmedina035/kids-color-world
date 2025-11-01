import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ModalConfirm from "../modals/modalconfirm";


export default function PerfilesManagementScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<any>(null);
  const [profiles, setProfiles] = useState<any[]>([]);


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

  const handleProfileSelect = (profile: any) => {
    router.push({
    pathname: '/Perfiles/editprofile',
    params: { data: JSON.stringify(profile) }, // se envía como string
    });
  };

  const handleDeleteProfile=(id:any)=>{ 
      setSelectedProfileId(id); // Guarda cuál perfil se quiere eliminar
      setModalVisible(true);       // Muestra el modal
  }

  const confirmDelete = async() => {  
    //eliminar del localstorage
    const storedProfiles = await AsyncStorage.getItem("profile");
    var parsed = storedProfiles ? JSON.parse(storedProfiles) : [];

    //quitar de la lista el perfil a eliminar
    parsed = parsed.filter((item:any)=>item.id!=selectedProfileId)
    await AsyncStorage.setItem("profile", JSON.stringify(parsed));
   
    //logica para eliminar el perfil
    setModalVisible(false); // Cierra el modal
    setSelectedProfileId(null); // Limpia la selección
    //actualiza listado de perfiles
    setProfiles(parsed)

  };

  const cancelDelete = () => {    
    setModalVisible(false);
    setSelectedProfileId(null);
  };

  const handlePress = () => {
    router.navigate("/Perfiles/newprofile");
  };

  return (
    <LinearGradient colors={["#C5A6FF", "#B0E0FF"]} style={styles.container}>
      {/* Título */}
      <Text style={styles.title}>Gestión de perfiles</Text>

      {/* Lista de perfiles */}
      <View style={styles.profilesContainer}>
        {profiles.map((p) => (
          <View key={p.id} style={styles.profileRow}>
            {/* Perfil (imagen + nombre) */}
            <TouchableOpacity
              style={styles.profileInfo}
           
              activeOpacity={0.7}
            >
              <Image source={{uri: p.image }}  style={styles.avatar} resizeMode="contain" />
              <Text style={styles.profileName}>{p.name}</Text>
            </TouchableOpacity>

            {/* Íconos de acción */}
            <View style={styles.iconContainer}>
              <TouchableOpacity>
                <Ionicons name="create-outline" size={24} color="#4A148C"  onPress={() => handleProfileSelect(p)} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="trash-outline" size={24} color="red" onPress={() => handleDeleteProfile(p.id)} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Botón para crear nuevo perfil */}
      <View style={{ flexDirection: "row", justifyContent: "center", marginBottom:40 }}>
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="happy-outline" size={24} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Crear nuevo perfil</Text>
          </View>
        </TouchableOpacity>
      </View>
      <ModalConfirm
        visible={modalVisible}
        title="Eliminar perfil"
        message="¿Esta seguro de eliminar el perfil?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}  
        />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#4A148C",
    textAlign: "center",
    marginBottom: 20,
    top: 20,
    textShadowColor: "rgba(255, 255, 255, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  profilesContainer: {
    flex: 1,
    justifyContent: "flex-start",
    marginTop: 40,
    gap: 15,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "white",
  },
  profileName: {
    marginLeft: 15,
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  iconContainer: {
    flexDirection: "row",
    gap:20
    
  },
 
  button: {
    backgroundColor: "#6F99F4",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
