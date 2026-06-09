import cinemaLogo from "../assets/cinema_logo.png"; // Ajuste o caminho se necessário
import './Header.css';

interface HeaderProps {
  activePage: "home" | "playlists" | "perfil" | "history" | "recommendations" | string;
  onGoToHome?: () => void;
  onGoToPlaylists?: () => void;
  onGoToHistory?: () => void;
  onGoToProfile?: () => void;
  onGoToRecommendations?: () => void;
  onGoToAddMovie?: () => void;
  onGoToSearch?: () => void;
}

export function Header({ activePage, onGoToHome, onGoToPlaylists, onGoToHistory, onGoToProfile, onGoToRecommendations, onGoToAddMovie,  onGoToSearch}: HeaderProps) {
  return (
    <header className="home-header">
      <img 
        src={cinemaLogo} 
        width="180" 
        alt="Cinema" 
        style={{ cursor: onGoToHome ? "pointer" : "default" }}
        onClick={onGoToHome}
      />

      <div className="home-header-right">
        <nav className="home-nav">
          <button 
            className={`header-outline-button ${activePage === "search" ? "active" : ""}`} 
            onClick={onGoToSearch}
            type="button"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            Pesquisa
          </button>
          <button 
            className={`home-nav-button ${activePage === "home" ? "active" : ""}`} 
            type="button"
            onClick={onGoToHome}
          >
            Página Principal
          </button>

          <button
            className={`home-nav-button ${activePage === "playlists" ? "active" : ""}`} 
            type="button"
            onClick={onGoToPlaylists}
          >
            Minhas Playlists
          </button>

          <button
            className={`home-nav-button ${activePage === "recommendations" ? "active" : ""}`} 
            type="button"
            onClick={onGoToRecommendations}
          >
            Recomendados
          </button>

          {onGoToAddMovie && (
            <button
              className={`home-nav-button ${activePage === "add-movie" ? "active" : ""}`} 
              type="button"
              onClick={onGoToAddMovie}
            >
              Adicionar Filme
            </button>
          )}
        </nav>

        <div className="profile-dropdown">
          <button className="profile-trigger" type="button">
            <span className="profile-avatar">U</span>
            <span className="profile-arrow"></span>
          </button>
          <div className="profile-menu">
            <button type="button" className="profile-menu-item" onClick={onGoToProfile}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Perfil
            </button>
            <button type="button" className="profile-menu-item" onClick={onGoToHistory}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>
              Histórico
            </button>
            {/* O divisor e o botão 'Sair' foram removidos daqui de forma limpa */}
          </div>
        </div>
      </div>
    </header>
  );
}