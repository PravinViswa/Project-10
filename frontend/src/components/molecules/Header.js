import React,{useState,useEffect} from 'react';

function Header({score,bestScore,playerId,gridWidth,gridHeight,onGridDimensionsChange}){
  const [width,setWidth]=useState(gridWidth);
  const [height,setHeight]=useState(gridHeight);

  useEffect(()=>{
    setWidth(gridWidth);
    setHeight(gridHeight);
  }, [gridWidth,gridHeight]);

  const handleUpdate=()=>{
    const newWidth=parseInt(width,10);
    const newHeight=parseInt(height,10);
    if (isNaN(newWidth)||isNaN(newHeight)||newWidth<2||newHeight<2){
      alert("Grid dimensions must be at least 2x2.");
      return;
    }
    onGridDimensionsChange(newWidth,newHeight);
  };

  const displayId=playerId.startsWith('guest_')?'Guest':playerId;

  return(
    <header className="header-container">
      <div className="header-left">
        <div className="player-info">Player:<strong>{displayId}</strong></div>
        <div className="scores-display">
          <span>SCORED:{score}</span>
          <span>BEST:{bestScore}</span>
        </div>
      </div>
      <div className="header-center">
        <h1>2048</h1>
        <p>Game</p>
      </div>
      <div className="header-right">
        <div className="grid-size-selector-inline">
          <input type="number" value={width} onChange={(e)=>setWidth(e.target.value)} min="2" max="99" className="grid-input-inline" />
          <span className="grid-separator-inline">x</span>
          <input type="number" value={height} onChange={(e)=>setHeight(e.target.value)} min="2" max="99" className="grid-input-inline" />
          <button onClick={handleUpdate} className="update-grid-button-inline">Update</button>
        </div>
      </div>
    </header>
  );
}

export default Header;