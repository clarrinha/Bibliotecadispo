import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "bibliotecadispo_token";
const API_URL = "http://10.0.2.2:3000";

export async function registrar(nome: string, email: string, senha: string) {
  const res = await fetch(`${API_URL}/api/auth/registrar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro ao criar conta");
  return data;
}

export async function login(email: string, senha: string) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro ao entrar");
  await SecureStore.setItemAsync(TOKEN_KEY, data.token);
  return data.usuario;
}

export async function logout() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function getToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function isLoggedIn() {
  const token = await getToken();
  return !!token;
}