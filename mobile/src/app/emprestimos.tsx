import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { api } from "../services/api";

const STATUS_LABEL: Record<string, string> = {
  aberto: "Aberto",
  devolvido: "Devolvido",
  atrasado: "Atrasado",
};

export default function Emprestimos() {
  const [emprestimos, setEmprestimos] = useState<any[]>([]);

  useEffect(() => {
    api.emprestimos().then(setEmprestimos);
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Empréstimos
      </Text>

      <FlatList
        data={emprestimos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={{ borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 10 }}>
            <Text style={{ fontWeight: "600" }}>{item.livro_titulo}</Text>
            <Text>Membro: {item.membro_nome}</Text>
            <Text>
              Prevista: {new Date(item.data_devolucao_prevista).toLocaleDateString("pt-BR")}
            </Text>
            <Text>Status: {STATUS_LABEL[item.status] ?? item.status}</Text>
          </View>
        )}
      />
    </View>
  );
}