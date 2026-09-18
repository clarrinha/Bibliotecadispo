import { useEffect, useState, useCallback } from "react";
import {
  View, Text, FlatList, TouchableOpacity, Modal, TextInput,
  StyleSheet, RefreshControl, ActivityIndicator, Alert, ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { api } from "../services/api";
import { isLoggedIn, logout } from "../services/auth";

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  aberto: { bg: "#EAF3FF", color: "#0984E3", label: "Aberto" },
  devolvido: { bg: "#E8FAF0", color: "#00B894", label: "Devolvido" },
  atrasado: { bg: "#FFEDE8", color: "#E17055", label: "Atrasado" },
};

export default function Emprestimos() {
  const router = useRouter();

  const [checandoAuth, setChecandoAuth] = useState(true);
  const [emprestimos, setEmprestimos] = useState<any[]>([]);
  const [membros, setMembros] = useState<any[]>([]);
  const [livros, setLivros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [devolvendoId, setDevolvendoId] = useState<number | null>(null);

  const [membroId, setMembroId] = useState<number | null>(null);
  const [livroId, setLivroId] = useState<number | null>(null);
  const [dias, setDias] = useState("14");

  const load = useCallback(async () => {
    const [e, m, l] = await Promise.all([api.emprestimos(), api.membros(), api.livros()]);
    setEmprestimos(e); setMembros(m); setLivros(l);
  }, []);

  useEffect(() => {
    isLoggedIn().then((logado) => {
      if (!logado) {
        router.replace("/login" as never);
      } else {
        setChecandoAuth(false);
        load().finally(() => setLoading(false));
      }
    });
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const resetForm = () => { setMembroId(null); setLivroId(null); setDias("14"); };

  const salvar = async () => {
    if (!membroId) return Alert.alert("Atenção", "Escolha um membro");
    if (!livroId) return Alert.alert("Atenção", "Escolha um livro");
    setSaving(true);
    try {
      await api.criarEmprestimo({ membro_id: membroId, livro_id: livroId, dias: Number(dias) || 14 });
      resetForm();
      setModalVisible(false);
      await load();
    } catch (e: any) {
      Alert.alert("Erro", e.message);
    } finally {
      setSaving(false);
    }
  };

  const devolver = async (id: number) => {
    setDevolvendoId(id);
    try {
      await api.devolverEmprestimo(id);
      await load();
    } catch (e: any) {
      Alert.alert("Erro", e.message);
    } finally {
      setDevolvendoId(null);
    }
  };

  const sair = async () => {
    await logout();
    router.replace("/login" as never);
  };

  if (checandoAuth || loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Empréstimos</Text>
        <TouchableOpacity onPress={sair}>
          <Text style={styles.sairText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={emprestimos}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#6C5CE7"]} />}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum empréstimo registrado ainda.</Text>}
        renderItem={({ item }) => {
          const status = STATUS_STYLE[item.status] ?? STATUS_STYLE.aberto;
          return (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.livro_titulo}</Text>
                <Text style={styles.cardSub}>Membro: {item.membro_nome}</Text>
                <Text style={styles.cardSub}>
                  Prevista: {new Date(item.data_devolucao_prevista).toLocaleDateString("pt-BR")}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                  <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                </View>
              </View>

              {item.status === "aberto" && (
                <TouchableOpacity
                  style={styles.returnButton}
                  onPress={() => devolver(item.id)}
                  disabled={devolvendoId === item.id}
                >
                  <Text style={styles.returnButtonText}>
                    {devolvendoId === item.id ? "..." : "Devolver"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Novo Empréstimo</Text>

              <Text style={styles.label}>Membro *</Text>
              <View style={styles.chipRow}>
                {membros.map((m) => (
                  <TouchableOpacity
                    key={m.id}
                    style={[styles.chip, membroId === m.id && styles.chipSelected]}
                    onPress={() => setMembroId(m.id)}
                  >
                    <Text style={[styles.chipText, membroId === m.id && styles.chipTextSelected]}>{m.nome}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Livro *</Text>
              <View style={styles.chipRow}>
                {livros.map((l) => (
                  <TouchableOpacity
                    key={l.id}
                    style={[styles.chip, livroId === l.id && styles.chipSelected]}
                    onPress={() => setLivroId(l.id)}
                  >
                    <Text style={[styles.chipText, livroId === l.id && styles.chipTextSelected]}>{l.titulo}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Dias para devolução</Text>
              <TextInput style={styles.input} value={dias} onChangeText={setDias} keyboardType="numeric" />

              <View style={styles.modalActions}>
                <TouchableOpacity style={[styles.button, styles.buttonGhost]} onPress={() => { resetForm(); setModalVisible(false); }}>
                  <Text style={styles.buttonGhostText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={salvar} disabled={saving}>
                  <Text style={styles.buttonText}>{saving ? "Salvando..." : "Salvar"}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F7F7FB" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F7F7FB" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title: { fontSize: 26, fontWeight: "800", color: "#1A1A2E" },
  sairText: { color: "#E17055", fontWeight: "700" },
  empty: { textAlign: "center", color: "#999", marginTop: 40 },
  card: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
    borderRadius: 14, padding: 14, marginBottom: 12,
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#1A1A2E" },
  cardSub: { fontSize: 13, color: "#777", marginTop: 2 },
  statusBadge: { alignSelf: "flex-start", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, marginTop: 8 },
  statusText: { fontSize: 11, fontWeight: "700" },
  returnButton: { backgroundColor: "#00B894", borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, marginLeft: 10 },
  returnButtonText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  fab: {
    position: "absolute", right: 20, bottom: 24, width: 58, height: 58, borderRadius: 29,
    backgroundColor: "#6C5CE7", justifyContent: "center", alignItems: "center",
    shadowColor: "#6C5CE7", shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  fabText: { color: "#fff", fontSize: 30, lineHeight: 32, fontWeight: "300" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalCard: { backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: "85%" },
  modalTitle: { fontSize: 20, fontWeight: "800", marginBottom: 16, color: "#1A1A2E" },
  input: {
    borderWidth: 1, borderColor: "#E0E0E8", borderRadius: 10, padding: 12,
    marginBottom: 12, fontSize: 15, backgroundColor: "#FAFAFC",
  },
  label: { fontSize: 13, fontWeight: "700", color: "#555", marginBottom: 8, marginTop: 4 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  chip: { borderWidth: 1, borderColor: "#E0E0E8", borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14, backgroundColor: "#FAFAFC" },
  chipSelected: { backgroundColor: "#6C5CE7", borderColor: "#6C5CE7" },
  chipText: { fontSize: 13, color: "#555", fontWeight: "600" },
  chipTextSelected: { color: "#fff" },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 8, paddingBottom: 8 },
  button: { backgroundColor: "#6C5CE7", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
  buttonText: { color: "#fff", fontWeight: "700" },
  buttonGhost: { backgroundColor: "transparent" },
  buttonGhostText: { color: "#777", fontWeight: "600" },
});