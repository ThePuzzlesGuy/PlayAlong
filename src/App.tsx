// Replaces the Vite + React starter template in StackBlitz
// Put this inside your `src/App.tsx`

import { useState } from 'react';

const sampleGames = [
  { name: 'Wordle', image: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Wordle_logo.svg', link: 'https://www.nytimes.com/games/wordle/index.html', likes: 0 },
  { name: 'Songless', image: 'https://songless.vercel.app/favicon.ico', link: 'https://songless.vercel.app/', likes: 0 },
  { name: 'Contexto', image: 'https://contexto.me/favicon.ico', link: 'https://contexto.me/', likes: 0 },
];

export default function App() {
  const [games, setGames] = useState(sampleGames);

  const openRandomGame = () => {
    const game = games[Math.floor(Math.random() * games.length)];
    window.open(game.link, '_blank');
  };

  const likeGame = (index: number) => {
    const updated = [...games];
    updated[index].likes++;
    setGames(updated);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#111827', color: 'white', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>@ThePuzzlesGuy Game Library</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <button onClick={openRandomGame} style={{ padding: '0.5rem 1rem', background: '#2563EB', border: 'none', borderRadius: '0.5rem', color: 'white' }}>Play Random Game</button>
        <button style={{ padding: '0.5rem 1rem', background: '#374151', border: 'none', borderRadius: '0.5rem', color: 'white' }}>Sign Up / Login</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {games.map((game, index) => (
          <div key={game.name} style={{ background: '#1F2937', borderRadius: '0.5rem', overflow: 'hidden' }}>
            <img src={game.image} alt={game.name} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
            <div style={{ padding: '1rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>{game.name}</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <button onClick={() => window.open(game.link, '_blank')} style={{ padding: '0.25rem 0.75rem', background: '#10B981', border: 'none', borderRadius: '0.375rem', color: 'white' }}>Play</button>
                <button onClick={() => likeGame(index)} style={{ padding: '0.25rem 0.75rem', background: '#EF4444', border: 'none', borderRadius: '0.375rem', color: 'white' }}>❤️ {game.likes}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
