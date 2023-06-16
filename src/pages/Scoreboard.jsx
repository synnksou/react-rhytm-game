import React from "react";
import bgImg from "./../assets/logo_leaderboard.png";
import Header from "../components/Header";
import "./../scoreboard.css";

import { HStack, Heading, VStack } from "@chakra-ui/layout";
import request from "../api/base";
import { useQuery } from "react-query";
import { Spinner } from "@chakra-ui/spinner";
import { Image } from "@chakra-ui/image";
import { first, orderBy } from "lodash";

const Scoreboard = () => {
  const { data, isLoading } = useQuery("scores", () => request("users"));
  const scores = orderBy(data, ["score"], ["desc"]);

  const firstScore = first(scores);
  scores.shift() ?? [];

  return (
    <>
      <Header />
      <div className="scoreboard-container">
        <img src={bgImg} className="bg-img" alt="bg-img" />

        {isLoading ? (
          <>
            <Spinner />{" "}
          </>
        ) : (
          <HStack spacing={3} align="center"className="scoreboard-contents">
            <VStack spacing={2} gap={2}>
              <Image
                boxSize="100px"
                objectFit="cover"
                src="crown1.png"
                alt="first place"
              />

              <Heading color="#FFE600">1.{firstScore.username}</Heading>
              <Heading color="#FFE600">{firstScore.score}</Heading>
            </VStack>
            <table>
              <thead>
                <tr key="0">
                  <th>Rank</th>
                  <th>Username</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {(scores || []).map((s, index) => (
                  <tr key={index + 2}>
                    <td>{index + 2}</td>
                    <td>{s.username}</td>
                    <td>{s.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </HStack>
        )}
      </div>
    </>
  );
};
export default Scoreboard;
