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
    <div className='container'>
      <h1 className='logo'>front</h1>

      {chatOutput && (
        <div className='chatOutput'>
          {chatOutput}
        </div>
      )}

      <form className='userForm' onSubmit={handleSubmit}>
        <input
          className='userInput'
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button className='userSubmit' type="submit">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="whitesmoke" viewBox="0 0 256 256"><path d="M240,127.89a16,16,0,0,1-8.18,14L63.9,237.9A16.15,16.15,0,0,1,56,240a16,16,0,0,1-15-21.33l27-79.95A4,4,0,0,1,71.72,136H144a8,8,0,0,0,8-8.53,8.19,8.19,0,0,0-8.26-7.47h-72a4,4,0,0,1-3.79-2.72l-27-79.94A16,16,0,0,1,63.84,18.07l168,95.89A16,16,0,0,1,240,127.89Z"></path></svg>
        </button>
      </form>

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
