import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, KeyboardAvoidingView, Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { registrar } from "../services/auth";

export default function Registro() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const criar = async () => {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      return Alert.alert("Atenção", "Preencha todos os campos");
    }
    if (senha.length < 6) {
      return Alert.alert("Atenção", "A senha deve ter pelo menos 6 caracteres");
    }
    if (senha !== confirmarSenha) {
      return Alert.alert("Atenção", "As senhas não coincidem");
    }
    setLoading(true);
    try {
      await registrar(nome.trim(), email.trim(), senha);
      Alert.alert("Conta criada!", "Agora você já pode entrar.", [
        { text: "OK", onPress: () => router.replace("/login" as never) },
      ]);
    } catch (e: any) {
      Alert.alert("Erro ao criar conta", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.icon}>📝</Text>
        <Text style={styles.title}>Criar conta</Text>
        <Text style={styles.subtitle}>Acesso à área de empréstimos</Text>

        <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha (mín. 6 caracteres)"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar senha"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={criar} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Criando..." : "Criar conta"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={() => router.replace("/login" as never)}>
          <Text style={styles.linkText}>Já tem conta? Entrar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7FB", justifyContent: "center", padding: 24 },
  card: {
    backgroundColor: "#fff", borderRadius: 20, padding: 28,
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  icon: { fontSize: 40, textAlign: "center", marginBottom: 8 },
  title: { fontSize: 24, fontWeight: "800", color: "#1A1A2E", textAlign: "center" },
  subtitle: { fontSize: 13, color: "#777", textAlign: "center", marginTop: 4, marginBottom: 24 },
  input: {
    borderWidth: 1, borderColor: "#E0E0E8", borderRadius: 10, padding: 14,
    marginBottom: 12, fontSize: 15, backgroundColor: "#FAFAFC",
  },
  button: {
    backgroundColor: "#6C5CE7", borderRadius: 10, paddingVertical: 14,
    alignItems: "center", marginTop: 8,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  linkButton: { marginTop: 16, alignItems: "center" },
  linkText: { color: "#6C5CE7", fontWeight: "600", fontSize: 13 },
});