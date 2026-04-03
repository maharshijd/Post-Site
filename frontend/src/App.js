import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- MINIMAL STYLING ---
const styles = {
  container: { maxWidth: '500px', margin: '40px auto', fontFamily: 'system-ui, sans-serif', color: '#333' },
  card: { border: '1px solid #ddd', borderRadius: '8px', padding: '25px', backgroundColor: '#fdfdfd', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
  input: { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '16px' },
  textarea: { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', marginBottom: '10px', fontSize: '16px', resize: 'vertical' },
  primaryBtn: { width: '100%', padding: '12px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  secondaryBtn: { background: 'none', border: 'none', color: '#007BFF', cursor: 'pointer', textDecoration: 'underline', marginTop: '10px', width: '100%', fontSize: '14px' },
  logoutBtn: { padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '15px', marginBottom: '20px' },
  postBox: { border: '1px solid #eaeaea', borderRadius: '8px', padding: '15px', marginBottom: '15px', backgroundColor: '#fff' },
  authorName: { margin: '0 0 5px 0', fontSize: '14px', color: '#555' },
  postText: { margin: '0', fontSize: '16px', lineHeight: '1.4' }
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

// --- COMPONENT 1: LOGIN / REGISTER ---
function AuthScreen({ setCurrentUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const action = isRegistering ? 'register' : 'login';
      const response = await axios.post('http://localhost:5001/auth', { username, password, action });
      
      if (response.data.success) {
        if (isRegistering) {
          alert('Account created! You can now log in.');
          setIsRegistering(false); 
          setPassword(''); // clear password field for login
        } else {
          setCurrentUser(username); 
        }
      }
    } catch (error) {
      alert('Error: Invalid credentials or connection issue.');
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={{ textAlign: 'center', marginTop: 0 }}>{isRegistering ? 'Create an Account' : 'Welcome Back'}</h2>
      <form onSubmit={handleSubmit}>
        <input 
          style={styles.input}
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        <input 
          style={styles.input}
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit" style={styles.primaryBtn}>
          {isRegistering ? 'Sign Up' : 'Log In'}
        </button>
      </form>
      <button style={styles.secondaryBtn} onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
      </button>
    </div>
  );
}

// --- COMPONENT 2: TEXT POSTING BOARD ---
function PostBoard({ currentUser, setCurrentUser }) {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');

  const loadPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5001/posts');
      setPosts(response.data);
    } catch (error) {
      console.error("Could not load posts");
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await axios.post('http://localhost:5001/posts', { author: currentUser, text });
    setText(''); 
    loadPosts(); 
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={{ margin: 0 }}>Hello, {currentUser}!</h3>
        <button style={styles.logoutBtn} onClick={() => setCurrentUser(null)}>Logout</button>
      </div>
      
      <form onSubmit={handlePost} style={{ marginBottom: '30px' }}>
        <textarea 
          style={styles.textarea}
          placeholder="What's on your mind?" 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          rows="3" 
        />
        <button type="submit" style={styles.primaryBtn}>Post Message</button>
      </form>

      <h4 style={{ color: '#666', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Recent Posts</h4>
      
      {posts.length === 0 ? (
        <p style={{ color: '#999', textAlign: 'center' }}>No posts yet. Be the first to say something!</p>
      ) : (
        posts.map((post, index) => (
          <div key={index} style={styles.postBox}>
            <h5 style={styles.authorName}>@{post.author}</h5>
            <p style={styles.postText}>{post.text}</p>
          </div>
        ))
      )}
    </div>
  );
}
