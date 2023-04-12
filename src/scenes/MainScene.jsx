import React, { useEffect, useRef, useState, useReducer } from "react";
import Matter from "matter-js";
import { HStack, VStack } from "@chakra-ui/layout";
import Score from "../components/Score";
import { Button } from "@chakra-ui/react";
import gifBackground from "./../assets/background.gif";

const MainScene = () => {
  const boxRef = useRef(null);
  const canvasRef = useRef(null);
  const [engine, setEngine] = useState(null);
  const [ballBody, setBallBody] = useState(null);
  const [isOnGround, setIsOnGround] = useState(false);
  const [score, setScore] = useState(0);
  const [isStarted, toggleIsStarted] = useReducer((state) => !state, false);
  const [speed, setSpeed] = useState(0.005);

  const handleJumpClick = () => {
    if (ballBody && isOnGround) {
      // only jump if the ball is on the ground
      Matter.Body.applyForce(ballBody, ballBody.position, { x: 0, y: -0.01 });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      handleJumpClick();
    }
  };

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
        width: 1280,
        height: 600,
        background: "rgba(0, 0, 0, 0.5)",
        wireframes: false,
      },
    });

    const floor = Bodies.rectangle(640, 590, 1280, 20, {
      isStatic: true,
      render: {
        fillStyle: "transparent",
      },
    });

    const ceiling = Bodies.rectangle(640, 10, 1280, 20, {
      isStatic: true,
      render: {
        fillStyle: "transparent",
      },
    });

    const ball = Bodies.circle(640, 580, 10, {
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

    const rightWall = Bodies.rectangle(1270, 150, 20, 320, {
      isStatic: true,
      render: {
        fillStyle: "transparent",
      },
    });

    const rectangle = Bodies.rectangle(1250, 580, 40, 20, {
      friction: 0,
      restitution: 0,
      render: {
        fillStyle: "blue",
      },
      label: "rectangle",
    });

    let velocityX = -5 * 0.5;
    const maxPosX = 1250 - rectangle.width / 2; // maximum x position for the rectangle
    const maxVelocityX = 15; // maximum velocity of the rectangle in x direction
    const minVelocityX = -15; // minimum velocity of the rectangle in x direction
    let direction = -1; // direction of the rectangle (1 = right, -1 = left)

    const updateRectanglePositionVite = () => {
      setSpeed(speed + 0.001);
      // update the position of the rectangle in each iteration
      Matter.Body.setVelocity(rectangle, { x: velocityX, y: 0 });

      // update the direction of the rectangle when it reaches the left or right edge
      if (rectangle.position.x <= 50) {
        direction = 1; // go right
      } else if (rectangle.position.x >= 1250) {
        direction = -1; // go left
      }

      // limit the velocity of the rectangle
      if (Math.abs(velocityX) > Math.abs(maxVelocityX)) {
        velocityX = maxVelocityX;
      } else if (Math.abs(velocityX) < Math.abs(minVelocityX)) {
        velocityX = minVelocityX;
      }

      // update the velocity of the rectangle based on the direction and speed
      velocityX = direction * (Math.abs(velocityX) + speed - 10);
    };

    setBallBody(ball);
    if (isStarted) {
      Events.on(newEngine, "beforeUpdate", updateRectanglePositionVite);
    }

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

    Events.on(newEngine, "collisionStart", (event) => {
      // Vérifier si la collision est entre la balle et le rectangle
      let pairs = event.pairs;
      for (let i = 0; i < pairs.length; i++) {
        let pair = pairs[i];
        if (
          (pair.bodyA.label === "ball" && pair.bodyB.label === "rectangle") ||
          (pair.bodyA.label === "rectangle" && pair.bodyB.label === "ball")
        ) {
          // Arrêter la simulation
          console.log("ici ça pete");
          newEngine.timing.timeScale = 0;
          // Afficher le score
          setScore(score + 1);
        }
      }
    });

    World.add(newEngine.world, [
      floor,
      ceiling,
      ball,
      leftWall,
      rightWall,
      rectangle,
    ]);

    Engine.run(newEngine);
    Render.run(render);
  }, [isStarted]);

  console.log({ isStarted });
  return (
    <VStack spacing={3} h={"auto"}>
      <Score score={score} />
      <HStack>
        <Button onKeyUp={handleKeyDown} onClick={handleJumpClick}>
          Jump
        </Button>
        <Button onKeyUp={handleKeyDown} onClick={toggleIsStarted}>
          Start
        </Button>
      </HStack>
      <div
        className="Mainframe"
        style={{
          backgroundImage: `url(${gifBackground})`,
          objectFit: "strech",
        }}
      >
        <div
          ref={boxRef}
          style={{
            width: 1280,
            height: 600,
          }}
        >
          <canvas ref={canvasRef} />
        </div>
      </div>
    </VStack>
  );
};

export default MainScene;
