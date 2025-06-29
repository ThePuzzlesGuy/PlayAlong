// Replaces the Vite + React starter template in StackBlitz
// Put this inside your `src/App.tsx`

import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDP3rc1JpVERhi5ZPud7AdMs0qROYD34I8',
  authDomain: 'thepuzzlesguy-games.firebaseapp.com',
  projectId: 'thepuzzlesguy-games',
  storageBucket: 'thepuzzlesguy-games.firebasestorage.app',
  messagingSenderId: '1057005514657',
  appId: '1:1057005514657:web:3c4236f75775ccfd6665e0'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function App() {
  const [games, setGames] = useState([
    { name: 'Wordle', image: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Wordle_logo.svg', link: 'https://www.nytimes.com/games/wordle/index.html', likes: 0 },
    { name: 'Songless', image: 'https://songless.vercel.app/favicon.ico', link: 'https://songless.vercel.app/', likes: 0 },
    { name: 'Contexto', image: 'https://contexto.me/favicon.ico', link: 'https://contexto.me/', likes: 0 }
  ]);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    onAuthStateChanged(auth, setUser);
  }, []);

  const signUp = () => {
    createUserWithEmailAndPassword(auth, email, password).catch(alert);
  };

  const logIn = () => {
    signInWithEmailAndPassword(auth, email, password).catch(alert);
  };

  const logOut = () => {
    signOut(auth);
  };

  const openRandomGame = () => {
    const game = games[Math.floor(Math.random() * games.length)];
    window.open(game.link, '_blank');
  };

  const likeGame = async (index: number) => {
    if (!user) return alert('Please log in to like a game.');

    const gameName = games[index].name;
    const userRef = doc(db, 'likes', user.uid);
    const userLikesDoc = await getDoc(userRef);
    const userLikes = userLikesDoc.exists() ? userLikesDoc.data() : { liked: [] };

    if (userLikes.liked.includes(gameName)) return alert('You already liked this game.');

    const updated = [...games];
    updated[index].likes++;
    setGames(updated);

    await setDoc(userRef, { liked: [...userLikes.liked, gameName] });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#111827', color: 'white', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>@ThePuzzlesGuy Game Library</h1>

      {user ? (
        <div style={{ marginBottom: '1rem' }}>
          <p>Welcome, {user.email}</p>
          <button onClick={logOut} style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', background: '#DC2626', color: 'white', border: 'none', borderRadius: '0.5rem' }}>Log Out</button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '0.5rem' }} />
          <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '0.5rem' }} />
          <button onClick={signUp} style={{ padding: '0.5rem', background: '#22C55E', color: 'white' }}>Sign Up</button>
          <button onClick={logIn} style={{ padding: '0.5rem', background: '#3B82F6', color: 'white' }}>Login</button>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <button onClick={openRandomGame} style={{ padding: '0.5rem 1rem', background: '#2563EB', border: 'none', borderRadius: '0.5rem', color: 'white' }}>Play Random Game</button>
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
