const API_URL = "http://10.0.2.2:3000";

export const api = {
  livros: () => fetch(`${API_URL}/api/livros`).then(r => r.json()),
  autores: () => fetch(`${API_URL}/api/autores`).then(r => r.json()),
  categorias: () => fetch(`${API_URL}/api/categorias`).then(r => r.json()),
  membros: () => fetch(`${API_URL}/api/membros`).then(r => r.json()),
  emprestimos: () => fetch(`${API_URL}/api/emprestimos`).then(r => r.json()),
  dashboard: () => fetch(`${API_URL}/api/dashboard`).then(r => r.json()),
};