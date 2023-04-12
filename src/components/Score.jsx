import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { HStack, Text } from "@chakra-ui/layout";

const Score = ({ score }) => {
  const [pastScore, setPastScore] = useState(0);

  useEffect(() => {
    if (score > pastScore) {
      setPastScore(score - pastScore);
    }
  }, [score]);

  return (
    <HStack>
      <Text color="white" fontSize="3xl">
        Votre Score {score}{" "}
      </Text>{" "}
      {score > pastScore && (
        <Text fontSize="3xl" color="green.400">
          + {pastScore}{" "}
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
