import { useState, useEffect } from 'react';
import { getMovies } from '../../services/movieApi';
import { MovieCard } from '../../components/MovieCard';
import { Header } from "../../components/Header";
import type { Movie } from '../../types';
import './SearchPage.css';

interface SearchPageProps {
  onGoToHome: () => void;
  onGoToPlaylists: () => void;
  onGoToHistory: () => void;
  onSelectMovie: (movie: Movie) => void;
}

const AVAILABLE_GENRES = [
  "Ação", "Aventura", "Comédia", "Drama", "Ficção Científica", 
  "Terror", "Romance", "Animação", "Documentário", "Suspense"
];

export function SearchPage({ onGoToHome, onGoToPlaylists, onGoToHistory, onSelectMovie }: SearchPageProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [searchInput, setSearchInput] = useState(''); 
  const [appliedSearchTerm, setAppliedSearchTerm] = useState(''); 
  const [hasSearched, setHasSearched] = useState(false); 

  const [selectedGenre, setSelectedGenre] = useState('');
  const [isGenreMenuOpen, setIsGenreMenuOpen] = useState(false);

  useEffect(() => {
    if (!hasSearched) return;

    async function fetchMovies() {
      setLoading(true);
      try {
        const data = await getMovies(appliedSearchTerm, selectedGenre !== "" ? selectedGenre : undefined);
        setMovies(data);
      } catch (error) {
        console.error("Erro ao buscar filmes:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchMovies();
  }, [appliedSearchTerm, selectedGenre, hasSearched]);

  const handleSearchClick = () => {
    if (searchInput.trim() === '') return; 
    setAppliedSearchTerm(searchInput);
    setHasSearched(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearchClick();
    }
  };

  return (
    <div className="search-page-container">
      <Header 
        activePage="search" 
        onGoToHome={onGoToHome}
        onGoToPlaylists={onGoToPlaylists}
        onLogout={() => { console.log("Usuário deslogado"); }}
        onGoToHistory={onGoToHistory}
      />

      <main className="search-content">
        <div className="search-hero-block">
          <h1 className="search-title">O que você está procurando?</h1>

          <div className="search-input-wrapper">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Digite o que deseja"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              onKeyDown={handleKeyDown} 
              className="search-input-large"
            />
          </div>

          <button onClick={handleSearchClick} className="search-button">
            BUSCAR
          </button>
        </div>

        {hasSearched && (
          <div className="search-bottom-section">
            {loading && <p className="search-message">Buscando no servidor...</p>}

            {!loading && movies.length === 0 && (
              <div className="no-results-block">
                <h2 className="no-results-title">Opss... Nenhum resultado encontrado</h2>
                <p className="no-results-subtitle">
                  Não conseguimos encontrar nenhum filme que corresponda a "{appliedSearchTerm}".
                </p>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <button onClick={onGoToHome} className="back-to-catalog-button">
                    Voltar ao Catálogo
                  </button>
                  {selectedGenre && (
                    <button onClick={() => setSelectedGenre("")} className="clear-filter-error-button">
                      Limpar filtro de {selectedGenre}
                    </button>
                  )}
                </div>
              </div>
            )}

            {!loading && movies.length > 0 && (
              <div className="results-block">
                
                <div className="results-header-flex">
                  <div className="results-header-info">
                    <h2>RESULTADOS DA PESQUISA PARA '{appliedSearchTerm}'</h2>
                    <p>{movies.length} filme{movies.length !== 1 ? 's' : ''} encontrado{movies.length !== 1 ? 's' : ''}</p>
                  </div>

                  <div className="genre-filter-container">
                    <button 
                      className="search-outline-button"
                      onClick={() => setIsGenreMenuOpen(!isGenreMenuOpen)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                      </svg>
                      {selectedGenre ? selectedGenre : "Selecionar gênero"}
                    </button>

                    {isGenreMenuOpen && (
                      <div className="genre-dropdown-menu">
                        <button 
                          className="genre-dropdown-item"
                          onClick={() => { setSelectedGenre(""); setIsGenreMenuOpen(false); }}
                        >
                          Todos os Gêneros
                        </button>
                        
                        {AVAILABLE_GENRES.map((genre) => (
                          <button 
                            key={genre}
                            className={`genre-dropdown-item ${selectedGenre === genre ? "active" : ""}`}
                            onClick={() => { setSelectedGenre(genre); setIsGenreMenuOpen(false); }}
                          >
                            {genre}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="search-results-grid">
                  {movies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onSelectMovie={onSelectMovie}
                      onAddToPlaylist={() => {}} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}