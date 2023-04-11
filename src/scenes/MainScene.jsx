import React, { useEffect, useRef, useState } from "react";
import Matter from "matter-js";


const STATIC_DENSITY = 15;
const PARTICLE_SIZE = 6;
const PARTICLE_BOUNCYNESS = 0.9;

const MainScene = () => {
  const boxRef = useRef(null);
  const canvasRef = useRef(null);
  const [engine, setEngine] = useState(null);
  const [ballBody, setBallBody] = useState(null);
  const [isOnGround, setIsOnGround] = useState(false);

  useEffect(() => {
    let Engine = Matter.Engine;
    let Render = Matter.Render;
    let World = Matter.World;
    let Bodies = Matter.Bodies;
    let Events = Matter.Events;

    let newEngine = Engine.create({});
    setEngine(newEngine);

    let render = Render.create({
      element: boxRef.current,
      engine: newEngine,
      canvas: canvasRef.current,
      options: {
        width: 700,
        height: 300,
        background: "rgba(0, 0, 0, 0.5)",
        wireframes: false,
      },
    });

    const floor = Bodies.rectangle(150, 300, 1100, 20, {
      isStatic: true,
      render: {
        fillStyle: "transparent",
      },
    });

    const ceiling = Bodies.rectangle(150, 10, 1100, 20, {
      isStatic: true,
      render: {
        fillStyle: "transparent",
      },
    });

    const ball = Bodies.circle(350, 280, 10, {
      restitution: 0,
      render: {
        fillStyle: "yellow",
      },
      label: "ball", // added label for collision detection
    });

    const leftWall = Bodies.rectangle(10, 150, 20, 320, {
      isStatic: true,
      render: {
        fillStyle: "transparent",
      },
    });

    const rightWall = Bodies.rectangle(690, 150, 20, 320, {
      isStatic: true,
      render: {
        fillStyle: "transparent",
      },
    });
    setBallBody(ball);

    Events.on(newEngine, "collisionStart", (event) => {
      event.pairs.forEach((collision) => {
        setIsOnGround(true);
        const labels = ["ball", "floor"];
        if (
          labels.includes(collision.bodyA.label) &&
          labels.includes(collision.bodyB.label)
        ) {
          console.log("collisionStart");
          setIsOnGround(true);
        }
      });
    });

    Events.on(newEngine, "collisionEnd", (event) => {
      setIsOnGround(false);
      event.pairs.forEach((collision) => {
        const labels = ["ball", "floor"];
        console.log({ collision });
        if (
          labels.includes(collision.bodyA.label) &&
          labels.includes(collision.bodyB.label)
        ) {
          setIsOnGround(false);
        }
      });
    });

    World.add(newEngine.world, [floor, ceiling, ball, leftWall, rightWall]);

    Engine.run(newEngine);
    Render.run(render);

    // const handleKeyDown = (event) => {
    //   if (event.code === "Space" && ballBody && isOnGround) {
    //     Matter.Body.applyForce(ballBody, ballBody.position, { x: 0, y: -0.01 });
    //   }
    // };
  
    // const handleKeyUp = (event) => {
    //   // handle key up if needed
    // };
  
    // window.addEventListener("keydown", handleKeyDown);
    // window.addEventListener("keyup", handleKeyUp);
  
    // return () => {
    //   window.removeEventListener("keydown", handleKeyDown);
    //   window.removeEventListener("keyup", handleKeyUp);
    // };
  }, []);

  const handleJumpClick = () => {
    if (ballBody && isOnGround) { // only jump if the ball is on the ground
      Matter.Body.applyForce(ballBody, ballBody.position, { x: 0, y: -0.01 });
    }
  };

  return (
    <div
      ref={boxRef}
      style={{
        width: 700,
        height: 400,
      }}
    >
      <button onClick={handleJumpClick}>Jump</button>
      <canvas ref={canvasRef} />
      
    </div>
  );
};

export default MainScene;
