import React,{ useState} from 'react';
import * as api from '../utils/api';

function CreatePlayerPage({setView}){
  const [id,setId]=useState('');
  const [passcode,setPasscode]=useState('');
  const [error,setError]=useState('');

  const handleCreate=async()=>{
    setError('');
    if(id.includes(' ')){
      setError('Player ID cannot contain spaces.');
      return;
    }
    if(!/^\d{4}$/.test(passcode)){
      setError('Passcode must be a 4-digit number.');
      return;
    }

    try{
      await api.createPlayer(id, passcode);
      alert('Player created successfully! Please log in.');
      setView('login');
    } catch (err){
      setError(err.message);
    }
  };

  return(
    <div className="auth-container">
      <h1 className="auth-title">2048</h1>
      <div className="auth-form">
        <h2>Create New Player</h2>
        <input
          type="text"
          value={id}
          onChange={(e)=>setId(e.target.value)}
          placeholder="New Player ID"
          className="auth-input"
        />
        <input
          type="password"
          value={passcode}
          onChange={(e)=>setPasscode(e.target.value)}
          placeholder="Create 4-Digit Passcode"
          className="auth-input"
          maxLength="4"
        />
        {error && <p className="error-message">{error}</p>}
        <button onClick={handleCreate} className="auth-button">
          Create Player
        </button>
        <button onClick={()=>setView('login')} className="auth-link-button">
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default CreatePlayerPage;