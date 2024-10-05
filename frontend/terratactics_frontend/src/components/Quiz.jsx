import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Quiz.css"; // Import CSS for styling
import Endpoints, { BASE_URL } from "../api/api";

export default function Quiz({ name }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [coinCount, setCoinCount] = useState(0);
  const [nasaImage, setNasaImage] = useState("");
  const [description, setDescription] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // First call to get the quizzes URL
        const initialResponse = await axios.get(`${BASE_URL}${Endpoints.list}`);

        console.log("Initial Response Data:", initialResponse.data); // Log the entire response

        const quizzesUrl = initialResponse.data.quizzes; // Get the URL for quizzes
        console.log("Quizzes URL:", quizzesUrl); // Log the quizzes URL

        if (quizzesUrl) {
          // Fetch the actual quiz questions
          const quizResponse = await axios.get(quizzesUrl);
          console.log("Quiz Data:", quizResponse.data); // Log the quiz data

          if (quizResponse.data && quizResponse.data.length > 0) {
            console.log("Questions fetched successfully:", quizResponse.data);
            setQuestions(quizResponse.data); // Set the actual questions in state
          } else {
            console.error("No questions returned from the API");
          }
        } else {
          console.error("No quizzes URL returned from the API");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        if (error.response) {
          console.error("Response error data:", error.response.data); // Log response errors if any
        }
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
        `${BASE_URL}${Endpoints.quiz}${currentQuestion.id}/answer/`,
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
  };

  // Check if questions have been loaded and if the index is valid
  const isQuestionsLoaded = questions.length > 0;
  if (!isQuestionsLoaded) {
    return <h2>Loading questions...</h2>; // Display loading message while questions are being fetched
  }

  if (currentQuestionIndex >= questions.length) {
    return <h2>Quiz Finished! Your total coins: {coinCount}</h2>; // End of quiz message
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
              {nasaImage && <img src={nasaImage} alt="NASA" />}{" "}
              {/* Display NASA image */}
              <p>{description}</p> {/* Display description */}
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
