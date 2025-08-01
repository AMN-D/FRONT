import { useState } from 'react'
import axios from 'axios';
import './App.css'

function App() {
  const [userInput, setUserInput] = useState('');
  const [chatOutput, setChatOutput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    setError('');
    setChatOutput('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/chat/', {
        user_input: userInput,
      });

      setChatOutput(response.data.chat_output);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
    }
  };

  return (
    <>
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
      <h2>Chat with AI</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask something..."
          style={{ width: '100%', padding: '0.5rem' }}
        />
        <button type="submit" style={{ marginTop: '0.5rem' }}>
          Send
        </button>
      </form>

      {chatOutput && (
        <div style={{ marginTop: '1rem', background: '#eee', padding: '1rem' }}>
          <strong>Response:</strong> {chatOutput}
        </div>
      )}

      {error && (
        <div style={{ color: 'red', marginTop: '1rem' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
    </>
  )
}

export default App
