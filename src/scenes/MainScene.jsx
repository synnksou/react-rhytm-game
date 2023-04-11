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
        width: 300,
        height: 300,
        background: "rgba(255, 0, 0, 0.5)",
        wireframes: false,
      },
    });

    const floor = Bodies.rectangle(150, 300, 300, 20, {
      isStatic: true,
      render: {
        fillStyle: "blue",
      },
    });

    const ball = Bodies.circle(50, 150, 10, {
      restitution: 0, // force que tu vas te faire renvoyer
      render: {
        fillStyle: "yellow",
      },
    });

    const leftWall = Bodies.rectangle(0, 150, 20, 300, { isStatic: true });
    const rightWall = Bodies.rectangle(300, 150, 20, 300, { isStatic: true });
    setBallBody(ball);

    Events.on(newEngine, "collisionStart", (event) => {
      event.pairs.forEach((collision) => {
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

    World.add(newEngine.world, [floor, ball, leftWall, rightWall]);

    Engine.run(newEngine);
    Render.run(render);
  }, []);

  const handleJumpClick = () => {
    if (ballBody) {
      Matter.Body.applyForce(ballBody, ballBody.position, { x: 0, y: -0.01 });
    }
  };

  return (
    <div
      ref={boxRef}
      style={{
        border: "1px solid white",
        width: 300,
        height: 300,
      }}
    >
      <canvas ref={canvasRef} />
      <button onClick={handleJumpClick}>Jump</button>
    </div>
  );
};

export default MainScene;
