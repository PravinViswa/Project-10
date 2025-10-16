const React=require("react");
const BoardRow=require("../molecules/BoardRow");

function GameBoard({board}){
  const boardStyle={
    '--grid-width':board[0]?.length||4,
    '--grid-height':board.length||4,
  };

  const rows=board.map((row,i)=>React.createElement(BoardRow,{key:i,row}));
  return React.createElement("div",{className:"game-board",style:boardStyle},rows);
}

module.exports=GameBoard;