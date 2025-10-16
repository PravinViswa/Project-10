import React,{useState} from 'react';
import './App.css';

import LoginPage from './pages/LoginPage';
import CreatePlayerPage from './pages/CreatePlayerPage';
import GamePage from './pages/GamePage';
import useGameState from './hooks/useGameState';
import Header from './components/molecules/Header'; 
import Footer from './components/molecules/Footer';

function App(){
  const [player,setPlayer]=useState(null);
  const [view,setView]=useState('login');

  const{
    board,score,bestScore,isGameOver,isGameWon,handlers,
    gridWidth,gridHeight,changeGridDimensions
  }=useGameState(player);

  const handleLogout=()=>{
    setPlayer(null);
    setView('login');
  };

  const renderAppContent=()=>{
    if (player){
      const playerId=player.player_id||player.id;
      return(
        <div className="app-container">
          <Header
            score={score}
            bestScore={bestScore}
            playerId={playerId}
            gridWidth={gridWidth}
            gridHeight={gridHeight}
            onGridDimensionsChange={changeGridDimensions}
          />
          <main className="main-content">
            <GamePage
              board={board}
              isGameOver={isGameOver}
              isGameWon={isGameWon}
              handlers={handlers}
            />
          </main>
          <Footer
            onHomeClick={handleLogout}
            handlers={handlers}
          />
        </div>
      );
    }

    switch (view){
      case 'register':
        return <CreatePlayerPage setView={setView} />;
      case 'login':
      default:
        return <LoginPage setPlayer={setPlayer} setView={setView} />;
    }
  };

  return (
    <div className="App">
      {renderAppContent()}
    </div>
  );
}

export default App;