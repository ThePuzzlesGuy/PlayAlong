import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User
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
  storageBucket: 'thepuzzlesguy-games.appspot.com',
  messagingSenderId: '1057005514657',
  appId: '1:1057005514657:web:3c4236f75775ccfd6665e0'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function App() {
  const [games, setGames] = useState([
    {
      name: 'Wordle',
      image: 'https://i.imgur.com/nRy1OdJ.png',
      link: 'https://www.nytimes.com/games/wordle/index.html',
      likes: 0,
      video: 'https://youtube.com/embed/7U1YAtQ4K6w?si=xq7UymswhHJ_kVCK',
      description: 'Guess the five-letter word in six tries. A daily word puzzle from The New York Times.'
    },
    {
      name: 'Songless',
      image: 'https://i.imgur.com/NgGmhh2.jpeg',
      link: 'https://songless.vercel.app/',
      likes: 0,
      video: 'https://youtube.com/embed/DXOoQCBEMRE?si=DaWsVNtPl5F02KOp',
      description: 'Identify a song in just a split second.'
    },
    {
      name: 'Contexto',
      image: 'https://i.imgur.com/MFg6JjH.jpeg',
      link: 'https://contexto.me/',
      likes: 0,
      video: 'https://youtube.com/embed/cvCke8mkk50?si=-wmkq657oemK7p1v',
      description: 'Guess the secret word. With each guess, you will be rated on how contextually relevant your word was to the secret word.'
    }
  ]);
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [likedGames, setLikedGames] = useState<string[]>([]);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        const userRef = doc(db, 'likes', user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setLikedGames(docSnap.data().liked || []);
        }
      } else {
        setLikedGames([]);
      }

      const updated = await Promise.all(
        games.map(async (game) => {
          const ref = doc(db, 'games', game.name);
          const snap = await getDoc(ref);
          return {
            ...game,
            likes: snap.exists() ? snap.data().likes || 0 : 0
          };
        })
      );
      setGames(updated);
    });
  }, []);

  const signUp = () => {
    setError('');
    createUserWithEmailAndPassword(auth, email, password).catch((err) => setError(err.message));
  };

  const logIn = () => {
    setError('');
    signInWithEmailAndPassword(auth, email, password).catch((err) => setError(err.message));
  };

  const logOut = () => {
    setError('');
    signOut(auth);
  };

  const openRandomGame = () => {
    const game = games[Math.floor(Math.random() * games.length)];
    window.open(game.link, '_blank');
  };

  const likeGame = async (index: number) => {
    if (!user) {
      setError('Please log in to like a game.');
      return;
    }

    const game = games[index];
    const gameName = game.name;

    const userRef = doc(db, 'likes', user.uid);
    const userLikesDoc = await getDoc(userRef);
    const userLikes = userLikesDoc.exists() ? userLikesDoc.data() : { liked: [] };

    if (userLikes.liked.includes(gameName)) {
      setError('You already liked this game.');
      return;
    }

    const newLiked = [...userLikes.liked, gameName];
    await setDoc(userRef, { liked: newLiked });

    const gameRef = doc(db, 'games', gameName);
    const gameDoc = await getDoc(gameRef);
    const currentLikes = gameDoc.exists() ? gameDoc.data().likes || 0 : 0;
    const updatedLikes = currentLikes + 1;
    await setDoc(gameRef, { likes: updatedLikes });

    const updatedGames = [...games];
    updatedGames[index].likes = updatedLikes;
    setGames(updatedGames);
    setLikedGames(newLiked);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#111827', color: 'white', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>@ThePuzzlesGuy Game Library</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <label><input type="checkbox" checked={videoEnabled} onChange={() => { setVideoEnabled(!videoEnabled); if (!videoEnabled) setSoundEnabled(false); }} /> Show Videos</label>
        <label><input type="checkbox" checked={soundEnabled} disabled={!videoEnabled} onChange={() => setSoundEnabled(!soundEnabled)} /> Sound</label>
      </div>

      {user ? (
        <div style={{ marginBottom: '1rem' }}>
          <p>Welcome, {user.email}</p>
          <button onClick={logOut} style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', background: '#DC2626', color: 'white', border: 'none', borderRadius: '0.5rem' }}>Log Out</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', maxWidth: '400px' }}>
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '0.5rem' }} />
          <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '0.5rem' }} />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={signUp} style={{ padding: '0.5rem', background: '#22C55E', color: 'white' }}>Sign Up</button>
            <button onClick={logIn} style={{ padding: '0.5rem', background: '#3B82F6', color: 'white' }}>Login</button>
          </div>
          {error && <div style={{ color: '#F87171', marginTop: '0.5rem' }}>{error}</div>}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <button onClick={openRandomGame} style={{ padding: '0.5rem 1rem', background: '#2563EB', border: 'none', borderRadius: '0.5rem', color: 'white' }}>Play Random Game</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem', width: '100%', maxWidth: '1200px' }}>
        {games.map((game, index) => (
          <div key={game.name} style={{ background: '#1F2937', borderRadius: '0.5rem', overflow: 'hidden', position: 'relative', height: '160px', cursor: 'pointer' }}>
            <img src={game.image} alt={game.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: videoEnabled ? 'none' : 'block' }} />
            {videoEnabled && (
              <iframe
                src={`${game.video}${soundEnabled ? '&mute=0' : '&mute=1'}`}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                allow="autoplay"
                title={game.name}
              ></iframe>
            )}
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', background: 'rgba(0,0,0,0.6)', padding: '0.5rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: '600' }}>{game.name}</h2>
              <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{game.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                <button onClick={() => window.open(game.link, '_blank')} style={{ padding: '0.25rem 0.75rem', background: '#10B981', border: 'none', borderRadius: '0.375rem', color: 'white' }}>Play</button>
                <button
                  onClick={() => likeGame(index)}
                  style={{ padding: '0.25rem 0.75rem', background: likedGames.includes(game.name) ? '#FBBF24' : '#EF4444', border: 'none', borderRadius: '0.375rem', color: 'white' }}
                >
                  ❤️ {game.likes}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
