function createInitialBoard(width,height){
  let newBoard=Array(height).fill(0).map(()=>Array(width).fill(0));
  newBoard=addRandomTile(newBoard);
  newBoard=addRandomTile(newBoard);
  return newBoard;
}

function transpose(board){
    if(!board||!board[0]) return [];
    return board[0].map((_,colIndex)=>board.map(row=>row[colIndex]));
}

function slideAndCombine(row){
  let newRow=row.filter(val=>val!==0);
  let score=0;
  for(let i=0;i<newRow.length-1;i++) {
    if(newRow[i]===newRow[i+1]){
      newRow[i]*=2;
      score+=newRow[i];
      newRow.splice(i+1,1);
    }
  }
  while(newRow.length<row.length){
    newRow.push(0);
  }
  return{row:newRow,score};
}

function move(board,direction){
  let newBoard=board.map(row=>[...row]);
  let score=0;
  let changed=false;

  const isVertical=direction==="up"||direction==="down";
  if(isVertical) newBoard=transpose(newBoard);
  if(direction==="right"||direction==="down") newBoard=newBoard.map(row=>row.reverse());

  for(let i=0;i<newBoard.length; i++){
    const originalRow=[...newBoard[i]];
    const {row:newRow,score:rowScore}=slideAndCombine(newBoard[i]);
    if(JSON.stringify(originalRow)!==JSON.stringify(newRow)) changed = true;
    newBoard[i] = newRow;
    score += rowScore;
  }

  if(direction==="right"||direction==="down") newBoard=newBoard.map(row=>row.reverse());
  if(isVertical) newBoard=transpose(newBoard);

  return {board:newBoard,score,changed};
}

function checkGameStatus(board){
    if(!board||board.length===0) return{isWon:false,isLost:true};
    const height=board.length;
    const width=board[0].length;
    let isWon=false;
    let canMove=false;
    let hasEmpty=false;

    for(let r=0;r<height;r++){
        for(let c=0;c<width;c++){
            if(board[r][c]===2048) isWon=true;
            if(board[r][c]===0) hasEmpty=true;
            if(c<width-1&&board[r][c]===board[r][c+1]) canMove=true;
            if(r<height-1&&board[r][c]===board[r+1][c]) canMove=true;
        }
    }
    const isLost=!hasEmpty&&!canMove;
    return {isWon,isLost};
}

function addRandomTile(board){
    const newBoard=board.map(row=>[...row]);
    const emptyTiles=[];
    for (let i=0;i<newBoard.length;i++) {
        for (let j=0;j<newBoard[i].length;j++){
            if (newBoard[i][j]===0){
                emptyTiles.push({x:i,y:j});
            }
        }
    }
    if (emptyTiles.length>0){
        const {x,y}=emptyTiles[Math.floor(Math.random()*emptyTiles.length)];
        newBoard[x][y]=Math.random()<0.9?2:4;
    }
    return newBoard;
}

module.exports={createInitialBoard,move,checkGameStatus,addRandomTile};