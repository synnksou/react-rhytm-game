import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./Mainframe.css";
import Matter from "matter-js";
import React, { useEffect, useRef } from "react";
import MainScene from "./scenes/MainScene";
import gifBackground from './assets/background.gif';

function App() {

  return (
    <div className="Mainframe" style={{ backgroundImage: `url(${gifBackground})` }}>
      <MainScene />
    </div>
  );
}

export default App;
