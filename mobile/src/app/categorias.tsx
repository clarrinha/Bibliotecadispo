import { useEffect, useState, useCallback } from "react";
import {
  View, Text, FlatList, TouchableOpacity, Modal, TextInput,
  StyleSheet, RefreshControl, ActivityIndicator, Alert,
} from "react-native";
import { api } from "../services/api";

const CARD_COLORS = ["#6C5CE7", "#00B894", "#0984E3", "#E17055", "#E84393", "#FDCB6E"];

export default function Categorias() {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  const load = useCallback(async () => {
    const data = await api.categorias();
    setCategorias(data);
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
    if (!nome.trim()) return Alert.alert("Atenção", "Nome é obrigatório");
    setSaving(true);
    try {
      await api.criarCategoria({ nome: nome.trim(), descricao: descricao.trim() || undefined });
      setNome("");
      setDescricao("");
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
      <Text style={styles.title}>Categorias</Text>

      <FlatList
        data={categorias}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#6C5CE7"]} />}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma categoria cadastrada ainda.</Text>}
        renderItem={({ item, index }) => (
          <View style={[styles.card, { backgroundColor: CARD_COLORS[index % CARD_COLORS.length] }]}>
            <Text style={styles.cardTitle}>{item.nome}</Text>
            {item.descricao ? <Text style={styles.cardSub}>{item.descricao}</Text> : null}
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Nova Categoria</Text>
            <TextInput style={styles.input} placeholder="Nome *" value={nome} onChangeText={setNome} />
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: "top" }]}
              placeholder="Descrição"
              value={descricao}
              onChangeText={setDescricao}
              multiline
            />
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
  card: { flex: 1, borderRadius: 16, padding: 16, minHeight: 100, justifyContent: "flex-end" },
  cardTitle: { fontSize: 16, fontWeight: "800", color: "#fff" },
  cardSub: { fontSize: 12, color: "rgba(255,255,255,0.85)", marginTop: 4 },
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