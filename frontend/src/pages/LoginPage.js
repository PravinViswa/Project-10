import React,{useState} from 'react';
import * as api from '../utils/api';

function LoginPage({setPlayer,setView}){
  const [id, setId]=useState('');
  const [passcode,setPasscode]=useState('');
  const [isLoading,setIsLoading]=useState(false);
  const [error,setError]=useState('');

  const playAsGuest=()=>{
    const guestId=`guest_${new Date().getTime()}`;
    setPlayer({id:guestId,passcode:'0000',isGuest:true});
  };
  
  const handleLogin=async()=>{
    if (!id.trim()||!passcode.trim()){
      setError("Please enter a Player ID and Passcode.");
      return;
    }
    setError('');
    setIsLoading(true);

    try{
      const gameState=await api.startGame(id,passcode);
      setPlayer(gameState);
    }catch(err){
      setError(err.message);
    }finally{
      setIsLoading(false);
    }
  };

  return(
    <div className="auth-container">
      <h1 className="auth-title">2048</h1>
      <p className="auth-subtitle">Game</p>
      <div className="auth-form">
        <input
          type="text"
          value={id}
          onChange={(e)=>setId(e.target.value)}
          placeholder="Player ID"
          className="auth-input"
          disabled={isLoading}
        />
        <input
          type="password"
          value={passcode}
          onChange={(e)=>setPasscode(e.target.value)}
          placeholder="4-Digit Passcode"
          className="auth-input"
          maxLength="4"
          disabled={isLoading}
        />
        {error&&<p className="error-message">{error}</p>}
        <button onClick={handleLogin} className="auth-button" disabled={isLoading}>
          {isLoading?'Logging in...':'Play'}
        </button>
        <button onClick={()=>setView('register')} className="auth-link-button" disabled={isLoading}>
          Create New Player
        </button>
        <button onClick={playAsGuest} className="auth-link-button" disabled={isLoading}>
          Play as Guest
        </button>
      </div>
    </div>
  );
}

export default LoginPage;