import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { api } from "../services/api";

export default function Livros() {
  const [livros, setLivros] = useState<any[]>([]);

  useEffect(() => {
    api.livros().then(setLivros);
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20
      }}>
        Livros
      </Text>

      <FlatList
        data={livros}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={{
            borderWidth: 1,
            borderRadius: 10,
            padding: 12,
            marginBottom: 10
          }}>
            <Text>{item.titulo}</Text>
            <Text>Autor: {item.autor_nome}</Text>
            <Text>Categoria: {item.categoria_nome}</Text>
          </View>
        )}
      />
    </View>
  );
}