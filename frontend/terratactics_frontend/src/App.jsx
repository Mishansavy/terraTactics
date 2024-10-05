// src/App.js
import React, { useState } from "react";
import { LandingPage } from "./components/LandingPage";
import Quiz from "./components/Quiz";

const App = () => {
  const [name, setName] = useState("");
  const [isQuizStarted, setIsQuizStarted] = useState(false);

  const startQuiz = (userName) => {
    setName(userName);
    setIsQuizStarted(true);
  };

  return (
    <>
      {!isQuizStarted ? (
        <LandingPage onStart={startQuiz} />
      ) : (
        <Quiz name={name} />
      )}
    </>
  );
};

export default App;
