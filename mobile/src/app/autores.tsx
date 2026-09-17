import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { api } from "../services/api";

export default function Autores() {
  const [autores, setAutores] = useState<any[]>([]);

  useEffect(() => {
    api.autores().then(setAutores);
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Autores
      </Text>

      <FlatList
        data={autores}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={{ borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 10 }}>
            <Text style={{ fontWeight: "600" }}>{item.nome}</Text>
            {item.nacionalidade ? <Text>Nacionalidade: {item.nacionalidade}</Text> : null}
            {item.data_nascimento ? (
              <Text>Nascimento: {new Date(item.data_nascimento).toLocaleDateString("pt-BR")}</Text>
            ) : null}
          </View>
        )}
      />
    </View>
  );
}