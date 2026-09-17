import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { api } from "../services/api";

export default function Categorias() {
  const [categorias, setCategorias] = useState<any[]>([]);

  useEffect(() => {
    api.categorias().then(setCategorias);
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Categorias
      </Text>

      <FlatList
        data={categorias}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={{ borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 10 }}>
            <Text style={{ fontWeight: "600" }}>{item.nome}</Text>
            {item.descricao ? <Text>{item.descricao}</Text> : null}
          </View>
        )}
      />
    </View>
  );
}