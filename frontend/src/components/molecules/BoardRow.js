const React=require("react");
const Tile=require("../atoms/Tile");

function BoardRow({row}){
  const children=row.map((val,i)=>React.createElement(Tile,{key:i,value:val}));
  return React.createElement("div",{className:"board-row"},children);
}

module.exports=BoardRow;