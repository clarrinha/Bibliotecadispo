import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";

export default function Dashboard() {
  return (
    <View style={{
      flex: 1,
      padding: 20,
      justifyContent: "center"
    }}>
      <Text style={{
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 30
      }}>
        Biblioteca 📚
      </Text>

      <Pressable onPress={() => router.push("/livros")}>
        <Text>📚 Livros</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/autores")}>
        <Text>✍️ Autores</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/categorias")}>
        <Text>🏷️ Categorias</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/membros")}>
        <Text>👤 Membros</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/emprestimos")}>
        <Text>📋 Empréstimos</Text>
      </Pressable>
    </View>
  );
}