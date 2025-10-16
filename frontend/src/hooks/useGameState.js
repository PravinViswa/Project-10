import {useState,useEffect,useCallback,useMemo} from "react";
import * as api from "../utils/api";
import * as gameLogic from "../utils/gameLogic";

function useGameState(initialGameState){
  const [board,setBoard]=useState([]);
  const [score,setScore]=useState(0);
  const [bestScore,setBestScore]=useState(0);
  const [isGameOver,setIsGameOver]=useState(false);
  const [isGameWon,setIsGameWon]=useState(false);
  const [gridWidth,setGridWidth]=useState(4);
  const [gridHeight,setGridHeight]=useState(4);
  const [player,setPlayer]=useState(null);

  const updateGameState=useCallback((data)=>{
    setBoard(data.board);
    setScore(data.score);
    setBestScore(data.best_score);
    setIsGameOver(data.is_game_over||false);
    setIsGameWon(data.is_game_won||false);
    setGridWidth(data.grid_width||4);
    setGridHeight(data.grid_height||4);
  },[]);

  useEffect(()=>{
    if(!initialGameState){
        setPlayer(null);
        setBoard([]);
        return;
    }

    setPlayer({
        id:initialGameState.player_id||initialGameState.id,
        passcode:initialGameState.passcode
    });

    if(initialGameState.isGuest){
      const newWidth=4;
      const newHeight=4;
      setGridWidth(newWidth);
      setGridHeight(newHeight);
      const newBoard=gameLogic.createInitialBoard(newWidth,newHeight);
      setBoard(newBoard);
      setScore(0);
      setBestScore(0);
      setIsGameOver(false);
      setIsGameWon(false);
    } else {
      updateGameState(initialGameState);
    }
  }, [initialGameState,updateGameState]);

  const changeGridDimensions=useCallback((newWidth,newHeight)=>{
    if(!player) return;

    if(player.id.startsWith("guest_")){
        const newBoard=gameLogic.createInitialBoard(newWidth,newHeight);
        setBoard(newBoard);
        setScore(0);
        setGridWidth(newWidth);
        setGridHeight(newHeight);
    }else{
        api.restartGame(player.id,player.passcode,newWidth,newHeight)
            .then(updateGameState)
            .catch(err=>console.error("Error changing grid size:",err));
    }
  },[player,updateGameState]);

  const move=useCallback(async(direction)=>{
    if(!player) return;

    if(player.id.startsWith("guest_")){
        setBoard(currentBoard=>{
            if(gameLogic.checkGameStatus(currentBoard).isLost) return currentBoard;
            const{board:newBoard,score:scoreEarned,changed}=gameLogic.move(currentBoard,direction);
            if(!changed) return currentBoard;

            const finalBoard=gameLogic.addRandomTile(newBoard);
            const {isWon,isLost}=gameLogic.checkGameStatus(finalBoard);

            setScore(s=>s+scoreEarned);
            setBestScore(bs=>Math.max(bs,score+scoreEarned));
            setIsGameWon(isWon);
            setIsGameOver(isLost);
            return finalBoard;
        });
    }else{
        const moveFn={
            "left":api.moveLeft,"right":api.moveRight,
            "up":api.moveUp,"down":api.moveDown
        }[direction];

        try{
            const data=await moveFn(player.id,player.passcode);
            updateGameState(data);
        } catch(err){
            console.error(`Error moving ${direction}:`,err);
        }
    }
  },[player,score,updateGameState]);

  const restart=useCallback(()=>{
    if(!player) return;

    const defaultWidth=4;
    const defaultHeight=4;

    if(player.id.startsWith("guest_")){
        setGridWidth(defaultWidth);
        setGridHeight(defaultHeight);
        const newBoard=gameLogic.createInitialBoard(defaultWidth,defaultHeight);
        setBoard(newBoard);
        setScore(0);
    }else{
        api.restartGame(player.id,player.passcode,defaultWidth,defaultHeight)
            .then(updateGameState)
            .catch(err=>console.error("Error restarting game:",err));
    }
  },[player,updateGameState]);

  useEffect(()=>{
    if(!player) return;
    const handleKey=(e)=>{
        const keyMap={"ArrowLeft":"left","a":"left","ArrowRight":"right","d":"right","ArrowUp":"up","w":"up","ArrowDown":"down","s":"down"};
        if (keyMap[e.key]){
            e.preventDefault();
            move(keyMap[e.key]);
        }
    };
    window.addEventListener("keydown",handleKey);
    return()=>window.removeEventListener("keydown",handleKey);
  },[player,move]);

  const handlers=useMemo(()=>({
      left:()=>move("left"),
      right:()=>move("right"),
      up:()=>move("up"),
      down:()=>move("down"),
      restart
  }),[move,restart]);

  return {board,score,bestScore,isGameOver,isGameWon,handlers,gridWidth,gridHeight,changeGridDimensions};
}

export default useGameState;