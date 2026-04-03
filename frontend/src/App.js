import React, { useState, useEffect } from 'react';
import axios from 'axios';

/*
IMPORTANT
Frontend runs on: http://localhost:3000
Aegis WAF runs on: http://localhost:8000
Backend runs on: http://localhost:5001

All API calls must go to WAF (8000)
*/

const API = "http://localhost:8000";

const styles = {
  container: { maxWidth: '500px', margin: '40px auto', fontFamily: 'system-ui, sans-serif', color: '#333' },
  card: { border: '1px solid #ddd', borderRadius: '8px', padding: '25px', backgroundColor: '#fdfdfd', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
  input: { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '16px' },
  textarea: { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', marginBottom: '10px', fontSize: '16px', resize: 'vertical' },
  primaryBtn: { width: '100%', padding: '12px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  secondaryBtn: { background: 'none', border: 'none', color: '#007BFF', cursor: 'pointer', textDecoration: 'underline', marginTop: '10px', width: '100%', fontSize: '14px' },
  logoutBtn: { padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '15px', marginBottom: '20px' },
  postBox: { border: '1px solid #eaeaea', borderRadius: '8px', padding: '15px', marginBottom: '15px', backgroundColor: '#fff' }
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <div style={styles.container}>
      {!currentUser ? (
        <AuthScreen setCurrentUser={setCurrentUser} />
      ) : (
        <PostBoard currentUser={currentUser} setCurrentUser={setCurrentUser} />
      )}
    </div>
  );
}

function AuthScreen({ setCurrentUser }) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const action = isRegistering ? 'register' : 'login';

      const response = await axios.post(`${API}/auth`, {
        username,
        password,
        action
      });

      if (response.data.success) {

        if (isRegistering) {

          alert('Account created');
          setIsRegistering(false);
          setPassword('');

        } else {

          setCurrentUser(username);

        }

      }

    } catch (err) {

      alert("Cannot connect to WAF or backend");

    }

  };

  return (

    <div style={styles.card}>

      <h2>{isRegistering ? "Register" : "Login"}</h2>

      <form onSubmit={handleSubmit}>

        <input
          style={styles.input}
          placeholder="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button style={styles.primaryBtn}>
          {isRegistering ? "Create Account" : "Login"}
        </button>

      </form>

      <button
        style={styles.secondaryBtn}
        onClick={() => setIsRegistering(!isRegistering)}
      >

        {isRegistering
          ? "Already have account? Login"
          : "Create account"}

      </button>

    </div>

  );

}

function PostBoard({ currentUser, setCurrentUser }) {

  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');

  const loadPosts = async () => {

    try {

      const res = await axios.get(`${API}/posts`);
      setPosts(res.data);

    } catch {

      console.log("cannot load posts");

    }

  };

  useEffect(() => {

    loadPosts();

  }, []);

  const handlePost = async (e) => {

    e.preventDefault();

    if (!text.trim()) return;

    await axios.post(`${API}/posts`, {
      author: currentUser,
      text
    });

    setText('');

    loadPosts();

  };

  return (

    <div style={styles.card}>

      <div style={styles.header}>

        <h3>Hello {currentUser}</h3>

        <button
          style={styles.logoutBtn}
          onClick={() => setCurrentUser(null)}
        >
          logout
        </button>

      </div>

      <form onSubmit={handlePost}>

        <textarea
          style={styles.textarea}
          placeholder="write something..."
          value={text}
          onChange={e => setText(e.target.value)}
        />

        <button style={styles.primaryBtn}>
          post
        </button>

      </form>

      <hr />

      {posts.map((p, i) => (

        <div key={i} style={styles.postBox}>

          <b>@{p.author}</b>

          <p>{p.text}</p>

        </div>

      ))}

    </div>

  );

}
