const React=require("react");

function Button({onClick,label}){
  return React.createElement("button",{onClick},label);
}

module.exports=Button;
