import "./Mainframe.css";
import React from "react";
import MainScene from "./scenes/MainScene";
import Header from "./components/Header";
import { Container } from "@chakra-ui/layout";

function App() {
  return (
    <>
      <Header />
      <Container p={2}>
        <MainScene />
      </Container>
    </>
  );
}

export default App;
