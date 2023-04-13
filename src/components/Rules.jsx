import { Heading, Text, VStack } from "@chakra-ui/layout";
import React from "react";

const Rules = () => {
  return (
    <VStack spacing={2}>
      <Heading color="white">Règles</Heading>
      <Text color="white" fontSize="2l">
        Le but est simple, il suffit de cliquer sur le bouton "Start" pour
        lancer, ensuite "Jump" pour jouer.
      </Text>
      <Text color="white" fontSize="2l">
        Il faut éviter la voiture pour ne pas tomber, le nombre de points
        augmente en fonction du temps passé en l'air.
      </Text>
      <Text color="white" fontSize="2l">
       La voiture change régulièrement de vitesse, ne vous laissez pas surprendre!
      </Text>
      <Text color="white" fontSize="2l">
        Bonne chance !
      </Text>
    </VStack>
  );
};

export default Rules;
