import { useEffect, useState, useCallback } from "react";
import {
  View, Text, FlatList, TouchableOpacity, Modal, TextInput,
  StyleSheet, RefreshControl, ActivityIndicator, Alert, ScrollView,
} from "react-native";
import { api } from "../services/api";

export default function Livros() {
  const [livros, setLivros] = useState<any[]>([]);
  const [autores, setAutores] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [ano, setAno] = useState("");
  const [quantidade, setQuantidade] = useState("1");
  const [autorId, setAutorId] = useState<number | null>(null);
  const [categoriaId, setCategoriaId] = useState<number | null>(null);

  const load = useCallback(async () => {
    const [l, a, c] = await Promise.all([api.livros(), api.autores(), api.categorias()]);
    setLivros(l); setAutores(a); setCategorias(c);
  }, []);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const resetForm = () => {
    setTitulo(""); setAno(""); setQuantidade("1"); setAutorId(null); setCategoriaId(null);
  };

  const salvar = async () => {
    if (!titulo.trim()) return Alert.alert("Atenção", "Título é obrigatório");
    if (!autorId) return Alert.alert("Atenção", "Escolha um autor");
    if (!categoriaId) return Alert.alert("Atenção", "Escolha uma categoria");
    setSaving(true);
    try {
      await api.criarLivro({
        titulo: titulo.trim(),
        ano_publicacao: ano ? Number(ano) : undefined,
        autor_id: autorId,
        categoria_id: categoriaId,
        quantidade: Number(quantidade) || 1,
      });
      resetForm();
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
      <Text style={styles.title}>Livros</Text>

      <FlatList
        data={livros}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#6C5CE7"]} />}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum livro cadastrado ainda.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.bookIcon}>
              <Text style={{ fontSize: 20 }}>📖</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.titulo}</Text>
              <Text style={styles.cardSub}>{item.autor_nome} · {item.categoria_nome}</Text>
              <View style={styles.badgeRow}>
                {item.ano_publicacao ? <Text style={styles.badge}>{item.ano_publicacao}</Text> : null}
                <Text style={[styles.badge, item.quantidade === 0 && styles.badgeDanger]}>
                  {item.quantidade} disponível(is)
                </Text>
              </View>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Novo Livro</Text>

              <TextInput style={styles.input} placeholder="Título *" value={titulo} onChangeText={setTitulo} />
              <TextInput style={styles.input} placeholder="Ano de publicação" value={ano} onChangeText={setAno} keyboardType="numeric" />
              <TextInput style={styles.input} placeholder="Quantidade" value={quantidade} onChangeText={setQuantidade} keyboardType="numeric" />

              <Text style={styles.label}>Autor *</Text>
              <View style={styles.chipRow}>
                {autores.map((a) => (
                  <TouchableOpacity
                    key={a.id}
                    style={[styles.chip, autorId === a.id && styles.chipSelected]}
                    onPress={() => setAutorId(a.id)}
                  >
                    <Text style={[styles.chipText, autorId === a.id && styles.chipTextSelected]}>{a.nome}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Categoria *</Text>
              <View style={styles.chipRow}>
                {categorias.map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    style={[styles.chip, categoriaId === c.id && styles.chipSelected]}
                    onPress={() => setCategoriaId(c.id)}
                  >
                    <Text style={[styles.chipText, categoriaId === c.id && styles.chipTextSelected]}>{c.nome}</Text>
                  </TouchableOpacity>
                ))}
              </View>

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
  title: { fontSize: 26, fontWeight: "800", marginBottom: 16, color: "#1A1A2E" },
  empty: { textAlign: "center", color: "#999", marginTop: 40 },
  card: {
    flexDirection: "row", alignItems: "flex-start", backgroundColor: "#fff",
    borderRadius: 14, padding: 14, marginBottom: 12,
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  bookIcon: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: "#F0EEFF",
    justifyContent: "center", alignItems: "center", marginRight: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#1A1A2E" },
  cardSub: { fontSize: 13, color: "#777", marginTop: 2 },
  badgeRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  badge: {
    fontSize: 11, fontWeight: "700", color: "#6C5CE7", backgroundColor: "#F0EEFF",
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, overflow: "hidden",
  },
  badgeDanger: { color: "#E17055", backgroundColor: "#FFEDE8" },
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