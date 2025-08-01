import { useState } from 'react'
import axios from 'axios';
import './App.css'

function App() {
  const [userInput, setUserInput] = useState('');
  const [chatOutput, setChatOutput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError('');
    setChatOutput('');

    try {
      const response = await axios.post('http://localhost:8000/api/chat/', {
        user_input: userInput,
      });

      setChatOutput(response.data.chat_output);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
    }
  };

  return (
    <>
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button type="submit">
          Send
        </button>
      </form>

      {chatOutput && (
        <div>
          <strong>Response:</strong> {chatOutput}
        </div>
      )}

      {error && (
        <div>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
    </>
  )
}

export default App
