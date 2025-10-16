import React from "react";
import Controls from "../organisms/Controls";

function Footer({onHomeClick,handlers}){
  return(
    <footer className="footer-container">
      <div className="footer-left">
        <button onClick={onHomeClick} className="footer-button">Home</button>
        <button onClick={handlers.restart} className="footer-button">Reset Game</button>
      </div>
      <div className="footer-center">
        <Controls handlers={handlers} />
      </div>
      <div className="footer-right">
        <p>Developed by Pravin Viswa</p>
      </div>
    </footer>
  );
}

export default Footer;