import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { api } from "../services/api";

export default function Membros() {
  const [membros, setMembros] = useState<any[]>([]);

  useEffect(() => {
    api.membros().then(setMembros);
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Membros
      </Text>

      <FlatList
        data={membros}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={{ borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 10 }}>
            <Text style={{ fontWeight: "600" }}>{item.nome}</Text>
            <Text>{item.email}</Text>
            {item.telefone ? <Text>Tel: {item.telefone}</Text> : null}
          </View>
        )}
      />
    </View>
  );
}