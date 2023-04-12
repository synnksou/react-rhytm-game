import React, { useState, useEffect } from "react";
import bgImg from "./../assets/logo_leaderboard.png";
import Header from "../components/Header";
import "./../scoreboard.css";

const baseurl = "http://localhost:3000/";
const Scoreboard = () => {
  const [score, setScore] = useState([]);
  useEffect(() => {
    fetchScores();
  }, []);
  const fetchScores = () => {
    fetch(baseurl + "score")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setScore(data.sort((a, b) => b.score - a.score));
      })
      .catch((err) => {
        console.log("Fetch error:", err);
      });
  };
  return (
    <>
      <Header />
      <div className="scoreboard-container">
      <img src={bgImg} className="bg-img" alt="bg-img" />
        <table>
          <thead>
            <tr key="0">
              <th>Rank</th>
              <th>Username</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {score.map((s, index) => (
              <tr key={index+1}>
                <td>{index + 1}</td>
                <td>{s.user}</td>
                <td>{s.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
export default Scoreboard;
