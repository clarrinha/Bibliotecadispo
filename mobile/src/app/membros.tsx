import { useEffect, useState, useCallback } from "react";
import {
  View, Text, FlatList, TouchableOpacity, Modal, TextInput,
  StyleSheet, RefreshControl, ActivityIndicator, Alert, Linking,
} from "react-native";
import { api } from "../services/api";

export default function Membros() {
  const [membros, setMembros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  const load = useCallback(async () => {
    const data = await api.membros();
    setMembros(data);
  }, []);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const salvar = async () => {
    if (!nome.trim() || !email.trim()) return Alert.alert("Atenção", "Nome e email são obrigatórios");
    setSaving(true);
    try {
      await api.criarMembro({ nome: nome.trim(), email: email.trim(), telefone: telefone.trim() || undefined });
      setNome(""); setEmail(""); setTelefone("");
      setModalVisible(false);
      await load();
    } catch (e: any) {
      Alert.alert("Erro", e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Membros</Text>

      <FlatList
        data={membros}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#6C5CE7"]} />}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum membro cadastrado ainda.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.nome.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.nome}</Text>
              <Text style={styles.cardSub}>{item.email}</Text>
            </View>
            {item.telefone ? (
              <TouchableOpacity style={styles.iconButton} onPress={() => Linking.openURL(`tel:${item.telefone}`)}>
                <Text style={styles.iconButtonText}>📞</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Novo Membro</Text>
            <TextInput style={styles.input} placeholder="Nome *" value={nome} onChangeText={setNome} />
            <TextInput
              style={styles.input} placeholder="Email *" value={email} onChangeText={setEmail}
              keyboardType="email-address" autoCapitalize="none"
            />
            <TextInput style={styles.input} placeholder="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.button, styles.buttonGhost]} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonGhostText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={salvar} disabled={saving}>
                <Text style={styles.buttonText}>{saving ? "Salvando..." : "Salvar"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F7F7FB" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F7F7FB" },
  title: { fontSize: 26, fontWeight: "800", marginBottom: 16, color: "#1A1A2E" },
  empty: { textAlign: "center", color: "#999", marginTop: 40 },
  card: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
    borderRadius: 14, padding: 14, marginBottom: 12,
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: "#00B894",
    justifyContent: "center", alignItems: "center", marginRight: 12,
  },
  avatarText: { color: "#fff", fontWeight: "700", fontSize: 18 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#1A1A2E" },
  cardSub: { fontSize: 13, color: "#777", marginTop: 2 },
  iconButton: { padding: 8 },
  iconButtonText: { fontSize: 20 },
  fab: {
    position: "absolute", right: 20, bottom: 24, width: 58, height: 58, borderRadius: 29,
    backgroundColor: "#6C5CE7", justifyContent: "center", alignItems: "center",
    shadowColor: "#6C5CE7", shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  fabText: { color: "#fff", fontSize: 30, lineHeight: 32, fontWeight: "300" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalCard: { backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: "800", marginBottom: 16, color: "#1A1A2E" },
  input: {
    borderWidth: 1, borderColor: "#E0E0E8", borderRadius: 10, padding: 12,
    marginBottom: 12, fontSize: 15, backgroundColor: "#FAFAFC",
  },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 8 },
  button: { backgroundColor: "#6C5CE7", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
  buttonText: { color: "#fff", fontWeight: "700" },
  buttonGhost: { backgroundColor: "transparent" },
  buttonGhostText: { color: "#777", fontWeight: "600" },
});