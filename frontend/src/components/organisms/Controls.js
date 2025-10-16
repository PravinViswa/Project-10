import React from 'react';

function Controls({handlers}){
  if(!handlers){
    return null;
  }

  return(
    <div className="controls-grid">
      <button onClick={handlers.up} className="control-btn pos-up"></button>
      <button onClick={handlers.left} className="control-btn pos-left"></button>
      <button onClick={handlers.right} className="control-btn pos-right"></button>
      <button onClick={handlers.down} className="control-btn pos-down"></button>
    </div>
  );
}

export default Controls;