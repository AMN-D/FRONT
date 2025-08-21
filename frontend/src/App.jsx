import { useState } from 'react'
import axios from 'axios';
import './App.css'

function App() {
  const [userInput, setUserInput] = useState('');
  const [chatOutput, setChatOutput] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError('');
    setChatOutput('');

    try {
      const response = await axios.post('http://localhost:8000/api/chat/', {
        user_input: userInput,
      });

      setChatOutput(response.data.chat_output);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 fw-bold display-5">front</h1>

      {submitted && (
        <div className="alert alert-secondary p-3 rounded">
          {chatOutput ? chatOutput : <em>Loading...</em>}
        </div>
      )}

      <form className="d-flex gap-2 mt-3" onSubmit={handleSubmit}>
        <input
          className="form-control"
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button className="btn btn-primary d-flex align-items-center justify-content-center" type="submit">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 256 256">
            <path d="M240,127.89a16,16,0,0,1-8.18,14L63.9,237.9A16.15,16.15,0,0,1,56,240a16,16,0,0,1-15-21.33l27-79.95A4,4,0,0,1,71.72,136H144a8,8,0,0,0,8-8.53,8.19,8.19,0,0,0-8.26-7.47h-72a4,4,0,0,1-3.79-2.72l-27-79.94A16,16,0,0,1,63.84,18.07l168,95.89A16,16,0,0,1,240,127.89Z"></path>
          </svg>
        </button>
      </form>

      {error && (
        <div className="alert alert-danger mt-3">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}

export default App
