const API_URL = "http://10.0.2.2:3000";

async function post(path: string, body: any) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro ao salvar");
  return data;
}

async function patch(path: string) {
  const res = await fetch(`${API_URL}${path}`, { method: "PATCH" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro ao atualizar");
  return data;
}

export const api = {
  livros: () => fetch(`${API_URL}/api/livros`).then((r) => r.json()),
  autores: () => fetch(`${API_URL}/api/autores`).then((r) => r.json()),
  categorias: () => fetch(`${API_URL}/api/categorias`).then((r) => r.json()),
  membros: () => fetch(`${API_URL}/api/membros`).then((r) => r.json()),
  emprestimos: () => fetch(`${API_URL}/api/emprestimos`).then((r) => r.json()),
  dashboard: () => fetch(`${API_URL}/api/dashboard`).then((r) => r.json()),

  criarAutor: (data: { nome: string; nacionalidade?: string; data_nascimento?: string }) =>
    post("/api/autores", data),
  criarCategoria: (data: { nome: string; descricao?: string }) =>
    post("/api/categorias", data),
  criarLivro: (data: { titulo: string; ano_publicacao?: number; autor_id: number; categoria_id: number; quantidade?: number }) =>
    post("/api/livros", data),
  criarMembro: (data: { nome: string; email: string; telefone?: string }) =>
    post("/api/membros", data),
  criarEmprestimo: (data: { membro_id: number; livro_id: number; dias?: number }) =>
    post("/api/emprestimos", data),
  devolverEmprestimo: (id: number) => patch(`/api/emprestimos/${id}/devolver`),
};