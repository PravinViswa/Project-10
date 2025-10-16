import React from 'react';
import GameBoard from '../components/organisms/GameBoard';

function GamePage({board,isGameOver,isGameWon,handlers}){
  return (
    <>
      <GameBoard board={board} />
      {(isGameOver||isGameWon)&&(
        <div className="game-status-overlay">
          <h2>{isGameWon?'You Win!':'Game Over!'}</h2>
          <button onClick={handlers.restart}>
            {isGameWon?'Play Again':'Try Again'}
          </button>
        </div>
      )}
    </>
  );
}

export default GamePage;