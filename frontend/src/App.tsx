import { useState } from "react";
import "./App.css";

import { WelcomePage } from "./pages/Welcome/WelcomePage";
import { LoginPage } from "./pages/Login/LoginPage";
import { HomePage } from "./pages/Home/HomePage";
import { MinhasPlaylistsPage } from "./pages/MinhasPlaylists/MinhasPlaylistsPage";
import { HistoryPage } from "./pages/History/HistoryPage";
import { MovieDetailsPage } from "./pages/MovieDetails/MovieDetailsPage";

import type { LoggedUser, Movie } from "./types";

type CurrentPage =
  | "welcome"
  | "login"
  | "home"
  | "playlists"
  | "history"
  | "movie-details";

const STORAGE_KEY = "cinema_logged_user";

function getStoredUser(): LoggedUser | null {
  const storedUser = localStorage.getItem(STORAGE_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as LoggedUser;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function App() {
  const [currentUser, setCurrentUser] = useState<LoggedUser | null>(
    getStoredUser,
  );

  const [currentPage, setCurrentPage] = useState<CurrentPage>(() =>
    getStoredUser() ? "home" : "welcome",
  );

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  function handleLogin(user: LoggedUser) {
    setCurrentUser(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setCurrentPage("home");
  }

  function handleGoToSignup() {
    alert("Tela de cadastro será integrada pela feature de Cadastro de Usuário.");
  }

  if (!currentUser) {
    if (currentPage === "login") {
      return (
        <LoginPage
          onLogin={handleLogin}
          onGoToSignup={handleGoToSignup}
        />
      );
    }

    return (
      <WelcomePage
        onGoToLogin={() => setCurrentPage("login")}
        onGoToSignup={handleGoToSignup}
      />
    );
  }

  if (currentPage === "playlists") {
    return (
      <MinhasPlaylistsPage
        userId={currentUser.id}
        onGoToHome={() => setCurrentPage("home")}
      />
    );
  }

  if (currentPage === "history") {
    return (
      <HistoryPage
        userId={currentUser.id}
        onGoToHome={() => setCurrentPage("home")}
        onGoToPlaylists={() => setCurrentPage("playlists")}
        onGoToHistory={() => setCurrentPage("history")}
      />
    );
  }

  if (currentPage === "movie-details" && selectedMovie) {
    return (
      <MovieDetailsPage
        movie={selectedMovie}
        userId={currentUser.id}
        onGoToHome={() => setCurrentPage("home")}
      />
    );
  }

  return (
    <HomePage
      userId={currentUser.id}
      onGoToPlaylists={() => setCurrentPage("playlists")}
      onGoToHome={() => setCurrentPage("home")}
      onGoToHistory={() => setCurrentPage("history")}
      onSelectMovie={(movie) => {
        setSelectedMovie(movie);
        setCurrentPage("movie-details");
      }}
    />
  );
}

export default App;