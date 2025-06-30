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

type Game = {
  name: string;
  image: string;
  link: string;
  description: string;
};

export default function App() {
  const [games] = useState<Game[]>([
    {
      name: 'Wordle',
      image: 'https://i.imgur.com/nRy1OdJ.png',
      link: 'https://www.nytimes.com/games/wordle/index.html',
      description: 'Guess the five-letter word in six tries. Challenge your brain daily with this viral word puzzle that keeps track of your streak.'
    },
    {
      name: 'Songless',
      image: 'https://i.imgur.com/NgGmhh2.jpeg',
      link: 'https://songless.vercel.app/',
      description: 'Identify a song in a split second. Test your musical memory in this high-speed guessing game that rewards your ears.'
    },
    {
      name: 'Contexto',
      image: 'https://i.imgur.com/MFg6JjH.jpeg',
      link: 'https://contexto.me/',
      description: 'Guess the secret word based on context. Type words and see how close you are semantically — powered by AI.'
    }
  {
    name: 'DaisyChain',
    image: 'https://via.placeholder.com/250x140?text=DaisyChain',
    link: 'https://www.daisychain.gg/',
    description: 'Connect words or numbers in a chain puzzle—easy to learn, hard to master, and fun every day.'
  },
  {
    name: 'Frenzle',
    image: 'https://via.placeholder.com/250x140?text=Frenzle',
    link: 'https://frenzle.com/',
    description: 'A fast word scramble that gets your brain going. How many words can you find before time runs out?'
  },
  {
    name: 'Spelling Bee (Free)',
    image: 'https://via.placeholder.com/250x140?text=Spelling+Bee',
    link: 'https://spellbee.org/',
    description: 'Find as many words as you can from seven letters. Every word must include the center letter and be four letters or longer.'
  },
  {
    name: 'Cladder',
    image: 'https://via.placeholder.com/250x140?text=Cladder',
    link: 'https://playcladder.com/',
    description: 'Build ladders of words by changing one letter at a time. It’s simple but really addictive.'
  },
  {
    name: 'Maketen',
    image: 'https://via.placeholder.com/250x140?text=Maketen',
    link: 'https://maketen.vercel.app/',
    description: 'Draw connections between words to find hidden relationships. A neat twist on word puzzles.'
  },
  {
    name: 'Circuits',
    image: 'https://via.placeholder.com/250x140?text=Circuits',
    link: 'https://circuitsgame.com/',
    description: 'Solve circuit puzzles by routing power with the right pieces. Clean design and smooth gameplay.'
  },
  {
    name: 'Searchle',
    image: 'https://via.placeholder.com/250x140?text=Searchle',
    link: 'https://searchle.net/',
    description: 'Guess the daily search term in six tries. You get feedback on how common your guesses are.'
  },
  {
    name: 'Colorfle',
    image: 'https://via.placeholder.com/250x140?text=Colorfle',
    link: 'https://colorfle.com/',
    description: 'Pick the right color code by testing your color sense. Simple pick and learn mechanics.'
  }
]);

  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [modalGame, setModalGame] = useState<Game | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
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

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#171a21',
        padding: '2rem',
        color: '#ffffff',
        fontFamily: 'Segoe UI, sans-serif',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: 900, width: '100%', boxSizing: 'border-box' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '2rem', textAlign: 'center' }}>
          @ThePuzzlesGuy Game Library
        </h1>

        {user ? (
          <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
            <p>Welcome, {user.email}</p>
            <button
              onClick={logOut}
              style={{
                marginTop: '0.5rem',
                padding: '0.5rem 1rem',
                background: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
              }}
            >
              Log Out
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              marginBottom: '2rem',
              maxWidth: '400px',
              marginInline: 'auto',
            }}
          >
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #444' }}
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #444' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <button
                onClick={signUp}
                style={{ padding: '0.5rem 1rem', background: '#22c55e', color: 'white', border: 'none', borderRadius: '0.5rem' }}
              >
                Sign Up
              </button>
              <button
                onClick={logIn}
                style={{ padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem' }}
              >
                Login
              </button>
            </div>
            {error && <div style={{ color: '#f87171', marginTop: '0.5rem' }}>{error}</div>}
          </div>
        )}

        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <button
            onClick={openRandomGame}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
            }}
          >
            Play Random Game
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1.5rem',
            justifyItems: 'center',
          }}
        >
          {games.map((game) => (
            <div
              key={game.name}
              style={{
                width: '100%',
                maxWidth: '250px',
                background: '#1b2838',
                borderRadius: '0.5rem',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <img src={game.image} alt={game.name} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
              <div style={{ padding: '0.75rem', color: '#c7d5e0', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>{game.name}</h2>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: '#acb2b8',
                    marginBottom: '0.5rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {game.description}
                </p>
                <button
                  onClick={() => setModalGame(game)}
                  style={{
                    background: 'transparent',
                    color: '#66c0f4',
                    border: 'none',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    marginBottom: '0.5rem',
                    textAlign: 'left',
                    padding: 0,
                  }}
                >
                  Read More
                </button>
                <button
                  onClick={() => window.open(game.link, '_blank')}
                  style={{
                    padding: '0.4rem 0.8rem',
                    background: '#66c0f4',
                    color: '#0e1c25',
                    border: 'none',
                    borderRadius: '0.25rem',
                    fontWeight: '600',
                    width: '100%',
                  }}
                >
                  Play
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalGame && (
        <div
          onClick={() => setModalGame(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#1b2838',
              color: '#c7d5e0',
              padding: '2rem',
              borderRadius: '0.5rem',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}
          >
            <h2 style={{ marginBottom: '1rem' }}>{modalGame.name}</h2>
            <img src={modalGame.image} alt={modalGame.name} style={{ width: '100%', borderRadius: '0.25rem', marginBottom: '1rem' }} />
            <p style={{ marginBottom: '1rem' }}>{modalGame.description}</p>
            <button
              onClick={() => window.open(modalGame.link, '_blank')}
              style={{
                padding: '0.5rem 1rem',
                background: '#66c0f4',
                color: '#0e1c25',
                border: 'none',
                borderRadius: '0.25rem',
                fontWeight: '600',
                marginRight: '1rem',
              }}
            >
              Play Game
            </button>
            <button
              onClick={() => setModalGame(null)}
              style={{
                padding: '0.5rem 1rem',
                background: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                fontWeight: '600',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
