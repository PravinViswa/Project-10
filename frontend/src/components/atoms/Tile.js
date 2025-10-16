const React = require("react");

function getDynamicTileStyle(value){
  const hue=value===0?0:25;
  const saturation=value===0?0:60;
  const lightness=value===0?90:(100-Math.log2(value)*6);

  return {
    backgroundColor:value===0? '#cdc1b4':`hsl(${hue},${saturation}%,${lightness}%)`,
    color:value>4? '#f9f6f2':'#776e65',
    fontSize:'clamp(12px,5vmin,40px)',
    boxShadow:'inset 0 0 0 1px rgba(0,0,0,0.1)',
  };
}

function Tile({value}){
  return React.createElement("div",{
    className:"tile",
    style:getDynamicTileStyle(value)
  },value!==0?value:"\u00A0");
}

module.exports=Tile;