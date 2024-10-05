// src/components/Quiz.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Quiz.css"; // Import CSS for styling

export default function Quiz({ name }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [coinCount, setCoinCount] = useState(0);
  const [nasaImage, setNasaImage] = useState("");
  const [description, setDescription] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    // Fetch questions from your backend API
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          "http://192.168.133.208:8000/api/questions/list/"
        );
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswer = async (selectedAnswer) => {
    const currentQuestion = questions[currentQuestionIndex];

    if (!currentQuestion) {
      console.error("Current question is undefined.");
      return;
    }

    try {
      const response = await axios.post(
        `http://192.168.133.208:8000/api/questions/list/quizzes/${currentQuestion.id}/answer/`,
        {
          answer: selectedAnswer,
        }
      );

      if (response.data.correct) {
        setDescription(response.data.description);
        setNasaImage(response.data.image_url); // Ensure this key exists in your response
        setCoinCount((prevCount) => prevCount + 1);
        setIsCorrect(true);
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
    setUserAnswer(""); // Clear input
  };

  // Check if questions have been loaded and if the index is valid
  const isQuestionsLoaded = questions.length > 0;
  if (!isQuestionsLoaded || currentQuestionIndex >= questions.length) {
    return <h2>Quiz Finished! Your total coins: {coinCount}</h2>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <h2>{name}'s Quiz</h2>
      <h3>{currentQuestion.question}</h3>

      {/* Render choices as buttons */}
      <div className="choices-container">
        {currentQuestion.choices.map((choice, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(choice)}
            className="answer-button"
          >
            {choice}
          </button>
        ))}
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
