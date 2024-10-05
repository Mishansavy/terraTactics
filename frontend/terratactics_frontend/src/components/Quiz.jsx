// quiz.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Quiz.css";
import Endpoints, { BASE_URL } from "../api/api";

const levels = [
  { title: "Beginner", note: "Star Field Navigation", threshold: 0 },
  { title: "Intermediate", note: "You're doing great!", threshold: 3 },
  { title: "Advanced", note: "You're a quiz master!", threshold: 5 },
  { title: "Expert", note: "You reached the final level!", threshold: 7 },
];

export default function Quiz({ name }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [coinCount, setCoinCount] = useState(0);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [nasaImage, setNasaImage] = useState("");
  const [description, setDescription] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const initialResponse = await axios.get(`${BASE_URL}${Endpoints.list}`);
        const quizzesUrl = initialResponse.data.quizzes;
        if (quizzesUrl) {
          const quizResponse = await axios.get(quizzesUrl);
          if (quizResponse.data && quizResponse.data.length > 0) {
            setQuestions(quizResponse.data);
          }
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    const savedProgress = JSON.parse(localStorage.getItem("quizProgress"));
    if (savedProgress) {
      setCurrentLevelIndex(savedProgress.currentLevelIndex);
      setCoinCount(savedProgress.coinCount);
      setCurrentQuestionIndex(savedProgress.currentQuestionIndex);
    }

    fetchQuestions();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "quizProgress",
      JSON.stringify({
        currentLevelIndex,
        coinCount,
        currentQuestionIndex,
      })
    );
  }, [currentLevelIndex, coinCount, currentQuestionIndex]);

  const handleAnswer = async (selectedAnswer) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    try {
      const response = await axios.post(
        `${BASE_URL}${Endpoints.quiz}${currentQuestion.id}/answer/`,
        { answer: selectedAnswer }
      );

      if (response.data.correct) {
        setDescription(response.data.description);
        setNasaImage(response.data.image_url);
        const newCoinCount = coinCount + 1;
        setCoinCount(newCoinCount);
        setIsCorrect(true);

        if (newCoinCount === levels[currentLevelIndex + 1]?.threshold) {
          setCurrentLevelIndex(currentLevelIndex + 1);
          alert(
            `Congratulations! You've reached ${
              levels[currentLevelIndex + 1].title
            } level!`
          );
        }
      } else {
        setIsCorrect(false);
      }
    } catch (error) {
      console.error("Error checking answer:", error);
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setIsCorrect(null);
    setDescription("");
    setNasaImage("");
  };

  if (currentQuestionIndex >= questions.length) {
    return (
      <div>
        <h2>Quiz Finished! Your total coins: {coinCount}</h2>
        <h3>{levels[currentLevelIndex].title} Level Completed!</h3>
        <p>{levels[currentLevelIndex].note}</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <h2 className="quiz-heading">
        <span>{name}</span>'s - Current Level: {levels[currentLevelIndex].title}
      </h2>
      <p>{levels[currentLevelIndex].note}</p>

      <h3>{currentQuestion?.question}</h3>
      <div className="choice-wrapper">
        <div className="choices-container">
          {currentQuestion?.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(choice)}
              className="answer-button"
            >
              {choice}
            </button>
          ))}
        </div>
      </div>

      {isCorrect !== null && (
        <div>
          {isCorrect ? (
            <div>
              <h4>Correct!</h4>
              {nasaImage && <img src={nasaImage} alt="NASA" />}
              <p>{description}</p>
            </div>
          ) : (
            <h4>Incorrect! Try again.</h4>
          )}
          <button onClick={handleNextQuestion}>Next Question</button>
        </div>
      )}

      <div style={{ position: "absolute", top: 10, right: 10 }}>
        <h4>Coins: {coinCount}</h4>
      </div>
    </div>
  );
}
