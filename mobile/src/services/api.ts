import { getToken } from "./auth";

const API_URL = "http://10.0.2.2:3000";

async function authHeaders() {
  const token = await getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function get(path: string, auth = false) {
  const headers: any = auth ? await authHeaders() : {};
  const res = await fetch(`${API_URL}${path}`, { headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro ao carregar");
  return data;
}

async function post(path: string, body: any, auth = false) {
  const headers: any = { "Content-Type": "application/json", ...(auth ? await authHeaders() : {}) };
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro ao salvar");
  return data;
}

async function patch(path: string, auth = false) {
  const headers: any = auth ? await authHeaders() : {};
  const res = await fetch(`${API_URL}${path}`, { method: "PATCH", headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro ao atualizar");
  return data;
}

export const api = {
  livros: () => get("/api/livros"),
  autores: () => get("/api/autores"),
  categorias: () => get("/api/categorias"),
  membros: () => get("/api/membros"),
  dashboard: () => get("/api/dashboard"),

  emprestimos: () => get("/api/emprestimos", true),
  emprestimosAtivos: () => get("/api/emprestimos/ativos", true),

  criarAutor: (data: { nome: string; nacionalidade?: string; data_nascimento?: string }) =>
    post("/api/autores", data),
  criarCategoria: (data: { nome: string; descricao?: string }) =>
    post("/api/categorias", data),
  criarLivro: (data: { titulo: string; ano_publicacao?: number; autor_id: number; categoria_id: number; quantidade?: number }) =>
    post("/api/livros", data),
  criarMembro: (data: { nome: string; email: string; telefone?: string }) =>
    post("/api/membros", data),

  criarEmprestimo: (data: { membro_id: number; livro_id: number; dias?: number }) =>
    post("/api/emprestimos", data, true),
  devolverEmprestimo: (id: number) => patch(`/api/emprestimos/${id}/devolver`, true),
};