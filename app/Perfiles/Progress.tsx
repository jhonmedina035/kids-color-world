import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const STORAGE_KEY = "colorGameRecords";

const Progress: React.FC = () => {
  const router = useRouter();
  const [records, setRecords] = useState<any[]>([]);

  const loadRecords = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) setRecords(JSON.parse(data));
      else setRecords([]);
    } catch (e) {
      console.error("Error cargando registros:", e);
      setRecords([]);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const saveRecords = async (newRecords: any[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newRecords));
      setRecords(newRecords);
    } catch (e) {
      console.error("Error guardando registros:", e);
    }
  };

  const handleDelete = (index: number) => {
    Alert.alert(
      "Eliminar registro",
      "¿Seguro que quieres eliminar este progreso?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const newRecords = records.filter((_, i) => i !== index);
            await saveRecords(newRecords);
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      "Limpiar todo",
      "¿Eliminar todos los progresos?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar todo",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(STORAGE_KEY);
              setRecords([]);
            } catch (e) {
              console.error("Error limpiando registros:", e);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const initials = item?.childName
      ? item.childName
          .split(" ")
          .map((p: string) => p[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : "NN";

    return (
      <View style={styles.card}>
        <View style={styles.cardLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.name}>👤 {item.childName ?? "Desconocido"}</Text>

          <View style={styles.row}>
            <View style={[styles.badge, styles.badgeSuccess]}>
              <Text style={styles.badgeText}>✅ {item.corrects ?? 0}</Text>
            </View>

            <View style={[styles.badge, styles.badgeDanger]}>
              <Text style={styles.badgeText}>❌ {item.errors ?? 0}</Text>
            </View>

            <View style={[styles.badge, styles.badgeNeutral]}>
              <Text style={styles.badgeText}>⏱️ {item.time ?? "0.0"}s</Text>
            </View>
          </View>

          <Text style={styles.dateText}>
            📅 {item.date ? new Date(item.date).toLocaleString() : "-"}
          </Text>
        </View>

        <View>
          <Pressable
            android_ripple={{ color: "#ffb3b3", radius: 24 }}
            onPress={() => handleDelete(index)}
            style={styles.iconButton}
          >
            <MaterialCommunityIcons name="trash-can-outline" size={22} color="#fff" />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backRow} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={20} color="#fff" />
          <Text style={styles.headerTitle}>Progreso</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
          <MaterialCommunityIcons name="delete-forever" size={18} color="#fff" />
          <Text style={styles.clearButtonText}>Limpiar todo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <FlatList
          data={records}
          keyExtractor={(item, i) => item?.date ?? i.toString()}
          renderItem={renderItem}
          contentContainerStyle={records.length ? undefined : styles.emptyContainer}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>📭</Text>
              <Text style={styles.emptyText}>No hay registros aún</Text>
              <Text style={styles.emptySub}>Juega con un niño para que aparezcan sus progresos aquí.</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F6F9FF" },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: "#4C6EF5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 3,
    shadowColor: "#123",
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  backRow: { flexDirection: "row", alignItems: "center" },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700", marginLeft: 8 },

  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  clearButtonText: { color: "#fff", marginLeft: 6, fontWeight: "700", fontSize: 13 },

  container: { flex: 1, padding: 14 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  cardLeft: { paddingRight: 8 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#E6F0FF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#274472", fontWeight: "800", fontSize: 18 },

  cardBody: {  paddingRight: 8 },
  name: { fontSize: 16, fontWeight: "800", color: "#213547", marginBottom: 8 },

  row: { flexDirection: "row", gap:5, marginBottom: 6 },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 999,
    minWidth: 70,
    alignItems: "center",
  },
  badgeText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  badgeSuccess: { backgroundColor: "#2EAD66" },
  badgeDanger: { backgroundColor: "#F24949" },
  badgeNeutral: { backgroundColor: "#6C7A89" },

  dateText: { color: "#7C8A97", fontSize: 12 },


  iconButton: {
    backgroundColor: "#FF6B6B",
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyContainer: { flex: 1 },
  emptyBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },
  emptyEmoji: { fontSize: 44, marginBottom: 8 },
  emptyText: { fontSize: 18, fontWeight: "700", color: "#4A5568" },
  emptySub: { marginTop: 6, color: "#7C8A97", textAlign: "center", paddingHorizontal: 30 },
});

export default Progress;