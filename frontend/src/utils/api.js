let API_BASE='http://localhost:8080';

if(process.env.REACT_APP_API_BASE?.trim()){
  const envBase=process.env.REACT_APP_API_BASE.trim();
  if (envBase.includes('backend')&&window.location.hostname!=='backend'){
    API_BASE='http://host.docker.internal:8080';
  }else{
    API_BASE=envBase;
  }
}
export async function createPlayer(playerId,passcode){
  const res=await fetch(`${API_BASE}/player/create`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({player_id:playerId,passcode,grid_width:4,grid_height:4}),
    credentials:"include"
  });
  if(!res.ok){
    const errorBody=await res.text();
    throw new Error(errorBody||`Failed to create player:${res.statusText}`);
  }
  return res.json();
}

export async function startGame(playerId,passcode){
  const res=await fetch(`${API_BASE}/game/start`,{
    method:"POST",
    headers:{"Content-Type":"application/json" },
    body:JSON.stringify({player_id:playerId,passcode}),
    credentials:"include"
  });
  if(!res.ok){
     const errorBody=await res.text();
    throw new Error(errorBody||`Failed to log in:${res.statusText}`);
  }
  return res.json();
}

export async function restartGame(playerId,passcode,gridWidth,gridHeight) {
  const res=await fetch(`${API_BASE}/game/restart`, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({player_id:playerId,passcode,grid_width:gridWidth,grid_height:gridHeight}),
    credentials:"include"
  });
  if(!res.ok) throw new Error(`Failed to restart game: ${res.statusText}`);
  return res.json();
}

async function sendMove(direction, playerId, passcode){
  const res=await fetch(`${API_BASE}/game/move-${direction}`,{ 
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({player_id: playerId,passcode}),
    credentials:"include"
  });
  if (!res.ok) throw new Error(`Failed to move ${direction}:${res.statusText}`);
  return res.json();
}

export async function moveLeft(playerId, passcode) {return sendMove('left',playerId,passcode);}
export async function moveRight(playerId, passcode) {return sendMove('right',playerId,passcode);}
export async function moveUp(playerId, passcode) {return sendMove('up',playerId,passcode);}
export async function moveDown(playerId, passcode) {return sendMove('down',playerId,passcode);}