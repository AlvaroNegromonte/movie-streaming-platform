import type { Movie } from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "Erro inesperado");
  }

  return data;
}

export async function getMovies(search?: string, genre?: string): Promise<Movie[]> {
  // Começamos com a URL base padrão
  let url = `${API_URL}/movies`;

  // Se o usuário digitou algo ou clicou em um gênero, montamos a URL com os filtros
  if (search || genre) {
    const params = new URLSearchParams();
    
    if (search) params.append('search', search);
    if (genre) params.append('genre', genre);
    
    // A URL vira algo como: http://localhost:3000/movies?search=metropolis&genre=Ação
    url = `${url}?${params.toString()}`;
  }

  const response = await fetch(url);

  return parseResponse<Movie[]>(response);
}