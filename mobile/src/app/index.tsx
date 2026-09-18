import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { api } from "../services/api";

type StatCard = {
  key: string;
  label: string;
  icon: string;
  color: string;
  bg: string;
  route: string;
};

const STAT_CARDS: StatCard[] = [
  { key: "totalLivros", label: "Livros", icon: "📚", color: "#6C5CE7", bg: "#F0EEFF", route: "/livros" },
  { key: "totalMembros", label: "Membros", icon: "👥", color: "#00B894", bg: "#E8FAF0", route: "/membros" },
  { key: "totalAutores", label: "Autores", icon: "✍️", color: "#0984E3", bg: "#EAF3FF", route: "/autores" },
  { key: "totalCategorias", label: "Categorias", icon: "🏷️", color: "#E17055", bg: "#FFEDE8", route: "/categorias" },
  { key: "emprestimosAbertos", label: "Empréstimos abertos", icon: "🔄", color: "#E84393", bg: "#FDEAF3", route: "/emprestimos" },
];

function saudacao() {
  const hora = new Date().getHours();
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

export default function Index() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.dashboard();
      setDashboard(data || {});
    } catch (e) {
      setDashboard({});
    }
  }, []);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const irPara = (route: string) => {
    router.push(route as never);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#6C5CE7"]} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>{saudacao()} </Text>
        <Text style={styles.title}>Sua Biblioteca digital</Text>
      </View>

      <View style={styles.grid}>
        {STAT_CARDS.map((stat) => (
          <TouchableOpacity
            key={stat.key}
            style={[styles.statCard, { backgroundColor: stat.bg }]}
            activeOpacity={0.75}
            onPress={() => irPara(stat.route)}
          >
            <Text style={styles.statIcon}>{stat.icon}</Text>
            <Text style={[styles.statValue, { color: stat.color }]}>
              {dashboard[stat.key] ?? 0}
            </Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Acesso rápido</Text>
      <View style={styles.quickRow}>
        <TouchableOpacity style={styles.quickButton} onPress={() => irPara("/livros")}>
          <Text style={styles.quickButtonText}>+ Livro</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickButton} onPress={() => irPara("/membros")}>
          <Text style={styles.quickButtonText}>+ Membro</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickButton} onPress={() => irPara("/emprestimos")}>
          <Text style={styles.quickButtonText}>+ Empréstimo</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7FB", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F7F7FB" },
  header: { marginBottom: 20, marginTop: 8 },
  greeting: { fontSize: 15, color: "#777", fontWeight: "600" },
  title: { fontSize: 28, fontWeight: "800", color: "#1A1A2E", marginTop: 2 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  statCard: {
    width: "47%",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  statIcon: { fontSize: 22, marginBottom: 8 },
  statValue: { fontSize: 28, fontWeight: "800" },
  statLabel: { fontSize: 13, color: "#555", fontWeight: "600", marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#1A1A2E", marginTop: 28, marginBottom: 12 },
  quickRow: { flexDirection: "row", gap: 10 },
  quickButton: {
    flex: 1,
    backgroundColor: "#6C5CE7",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#6C5CE7",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  quickButtonText: { color: "#fff", fontWeight: "700", fontSize: 13 },
});