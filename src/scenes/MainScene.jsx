import React, { useEffect, useRef, useState, useReducer } from "react";
import Matter from "matter-js";
import { HStack, Text, VStack } from "@chakra-ui/layout";
import Score from "../components/Score";
import { Button, useDisclosure } from "@chakra-ui/react";
import gifBackground from "./../assets/background.gif";
import { AUDIO_PATH_PLAYER_ARRAY, playAudio, stopAudio } from "../utils";
import { Howl } from "howler";
import ModalUser from "../components/Modal";
import { useMutation } from "react-query";
import { postScore } from "../api/score";
import { client } from "../api/base";
const VOLUME = 0.1;

const MainScene = () => {
  const boxRef = useRef(null);
  const canvasRef = useRef(null);
  const [engine, setEngine] = useState(null);
  const [ballBody, setBallBody] = useState(null);
  const [isOnGround, setIsOnGround] = useState(false);
  const [score, setScore] = useState(0);
  const [prevScore, setPrevScore] = useState(0);
  const [isStarted, toggleIsStarted] = useReducer((state) => !state, false);
  const [speed, setSpeed] = useState(0.005);
  const [spriteImage, setSpriteImage] = useState();
  const [count, setCount] = useState(5);
  const { isOpen, onOpen, onClose } = useDisclosure();

  let skaterTexture = new Image();
  skaterTexture.src = "skater_normal.gif";

  let skaterJumpTexture = new Image();
  skaterJumpTexture.src = "skater_jump.gif";

  let scoreGame = 0;

  const songGame = new Howl({
    src: [AUDIO_PATH_PLAYER_ARRAY.start],
    volume: VOLUME,
    onplayerror: function (e) {
      console.log("play error", e);
    },
  });

  const jumpSound = new Howl({
    src: [AUDIO_PATH_PLAYER_ARRAY.jump],
    volume: VOLUME,
  });

  const gameOverSound = new Howl({
    src: [AUDIO_PATH_PLAYER_ARRAY.dead],
    volume: VOLUME,
  });

  const countSound = new Howl({
    src: [AUDIO_PATH_PLAYER_ARRAY.countDown],
    volume: VOLUME,
  });

  const readySound = new Howl({
    src: [AUDIO_PATH_PLAYER_ARRAY.ready],
    volume: VOLUME,
  });

  const goSound = new Howl({
    src: [AUDIO_PATH_PLAYER_ARRAY.go],
    volume: VOLUME,
  });

  const handleClickCounter = () => {
    if (count === 5 && !isStarted) {
      let timer = setInterval(() => {
        setCount((prevCount) => {
          let newCount = prevCount - 1;
          console.log({ newCount });
          if (newCount >= 2) {
            countSound.play();
          }
          console.log(newCount);
          if (newCount === 1) {
            readySound.play();
          }
          if (newCount === 0) {
            goSound.play();
          }
          return newCount;
        });
      }, 1000);

      setTimeout(() => {
        clearInterval(timer);
        setCount(0);
        toggleIsStarted();
      }, 5000);
    } else {
      toggleIsStarted();
    }
  };

  const handleJumpClick = () => {
    console.log(isOnGround);
    if (ballBody) {
      if (isOnGround) {
        ballBody.render.sprite.texture = skaterJumpTexture.src;
        Matter.Body.applyForce(ballBody, ballBody.position, { x: 0, y: -0.1 });

        jumpSound.play();
      } else {
        ballBody.render.sprite.texture = skaterTexture.src;
      }
    }
  };

  const { mutateAsync: mutateScore } = useMutation(
    (score) => client.post("/insertUser", score),
    {
      onSuccess: () => {
        console.log("success");
      },
      onError: () => {
        console.log("error");
      },
    }
  );

  const submitScore = async () => {
    await mutateScore({
      username: JSON.parse(localStorage.getItem("name")) || "Anonymous",
      score: scoreGame,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Shift") {
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
    setScore(0);
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
      label: "floor",
    });

    const ceiling = Bodies.rectangle(640, 10, 1280, 20, {
      isStatic: true,
      render: {
        fillStyle: "transparent",
      },
      label: "ceiling",
    });

    let ball = Bodies.rectangle(640, 580, 40, 80, {
      restitution: 0.1,
      render: {
        fillStyle: "yellow",
        sprite: {
          texture: skaterTexture.src,
          xScale: 3.5,
          yScale: 3.5,
        },
      },
      label: "ball", // added label for collision detection
    });

    setSpriteImage(ball.render.sprite.texture);

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

    const rectangle = Bodies.rectangle(1200, 580, 40, 100, {
      friction: 0,
      render: {
        fillStyle: "blue",
        sprite: {
          texture: "car.png",
          xScale: 2,
          yScale: 2,
        },
      },
      label: "rectangle",
    });

    const scoreSensor = Bodies.rectangle(640, 450, 200, 5, {
      isStatic: true,
      isSensor: true,
      render: {
        visible: false,
      },
      label: "scoreSensor",
    });

    let velocityX = -5 * 0.5;
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
        rectangle.render.sprite.texture = "car_right.png";
      } else if (rectangle.position.x >= 1250) {
        direction = -1; // go left
        rectangle.render.sprite.texture = "car.png";
      }

      // limit the velocity of the rectangle
      if (Math.abs(velocityX) > Math.abs(maxVelocityX)) {
        velocityX = maxVelocityX;
      } else if (Math.abs(velocityX) < Math.abs(minVelocityX)) {
        velocityX = minVelocityX;
      }

      // update the velocity of the rectangle based on the direction and speed
      velocityX = direction * (Math.abs(velocityX) + speed - 5);
    };

    setBallBody(ball);

    if (isStarted) {
      Events.on(newEngine, "beforeUpdate", updateRectanglePositionVite);
      songGame.play();
    }

    Events.on(newEngine, "collisionStart", (event) => {
      event.pairs.forEach((collision) => {
        setIsOnGround(true);
        const labels = ["ball", "floor", "ceiling"];
        if (
          labels.includes(collision.bodyA.label) &&
          labels.includes(collision.bodyB.label)
        ) {
          setIsOnGround(true);
        }
      });
    });

    Events.on(newEngine, "collisionEnd", (event) => {
      setIsOnGround(false);
      event.pairs.forEach((collision) => {
        const labels = ["ball", "floor"];

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
          newEngine.timing.timeScale = 0;
          setPrevScore(scoreGame);
          songGame.stop();

          gameOverSound.play();
          submitScore();
          setCount(5);
        }
      }
    });

    Events.on(newEngine, "collisionStart", (event) => {
      event.pairs.forEach((collision) => {
        const labels = ["ball", "scoreSensor"];
        if (
          labels.includes(collision.bodyA.label) &&
          labels.includes(collision.bodyB.label)
        ) {
          // Incrémenter le score
          scoreGame++;
          setScore(scoreGame);
        }
      });
    });

    World.add(newEngine.world, [
      floor,
      ceiling,
      ball,
      leftWall,
      rightWall,
      rectangle,
      scoreSensor,
    ]);

    function update() {
      Engine.update(newEngine);
      window.requestAnimationFrame(update);
    }

    update();
    Render.run(render);
  }, [isStarted]);

  return (
    <VStack spacing={3} h={"auto"}>
      <ModalUser onOpen={onOpen} onClose={onClose} isOpen={isOpen} />
      <Score score={score} prevScore={prevScore} />
      <Text color={count > 1 ? "white" : "green"}>
        Compte a rebours : {count}
      </Text>
      <HStack>
        <Button onClick={onOpen}>Pesudo</Button>
        <Button onKeyUp={handleKeyDown} onClick={handleJumpClick}>
          Jump
        </Button>
        <Button onKeyUp={handleKeyDown} onClick={handleClickCounter}>
          {isStarted ? "Stop" : "Start"}
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
      <script>document.addEventListener("keydown", handleKeyDown);</script>
    </VStack>
  );
};

export default MainScene;
