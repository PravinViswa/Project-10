import React,{useState,useEffect} from 'react';

function GridSizeSelector({gridWidth,gridHeight,onGridDimensionsChange}){
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
    onGridDimensionsChange(newWidth, newHeight);
  };

  return(
    <div className="grid-size-selector-container">
      <input 
        type="number" 
        value={width} 
        onChange={(e)=>setWidth(e.target.value)} 
        min="2" 
        max="10" 
        className="grid-input"
      />
      <span className="grid-separator">x</span>
      <input 
        type="number" 
        value={height} 
        onChange={(e)=>setHeight(e.target.value)} 
        min="2" 
        max="10" 
        className="grid-input"
      />
      <button onClick={handleUpdate} className="update-grid-button">Update</button>
    </div>
  );
}

export default GridSizeSelector;