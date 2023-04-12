import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { HStack, Text } from "@chakra-ui/layout";
import { AUDIO_PATH_PLAYER_ARRAY } from "../utils";

const Score = ({ score, prevScore }) => {
  const diffScore = score - prevScore;

  return (
    <HStack>
      <Text color="white" fontSize="3xl">
        Votre Score {score}{" "}
      </Text>{" "}
      {score > prevScore && prevScore != 0 && (
        <Text fontSize="3xl" color="green.400">
          + {diffScore}{" "}
        </Text>
      )}
    </HStack>
  );
};

Score.propTypes = {
  // bla: PropTypes.string,
  score: PropTypes.number,
  pastScore: PropTypes.number,
};

export default Score;
