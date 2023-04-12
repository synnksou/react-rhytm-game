import "./Mainframe.css";
import React from "react";
import MainScene from "./scenes/MainScene";
import Header from "./components/Header";
import { Container, VStack } from "@chakra-ui/layout";
import Rules from "./components/Rules";

function App() {
  return (
    <>
      <Header />
      <VStack p={2} gap={3}>
        <MainScene />
        <Rules />
      </VStack>
    </>
  );
}

export default App;
