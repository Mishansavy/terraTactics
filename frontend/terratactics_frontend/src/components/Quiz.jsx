// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./Quiz.css";
// import Endpoints, { BASE_URL } from "../api/api";
// import LevelUpModal from "./LevelUpModal/LevelUpModal";
// import { LevelData } from "../LevelsData/LevelsData";

// const levels = [
//   { title: "Beginner", note: "Star Field Navigation", threshold: 0 },
//   { title: "Intermediate", note: "You're doing great!", threshold: 3 },
//   { title: "Advanced", note: "You're a quiz master!", threshold: 5 },
//   { title: "Expert", note: "You reached the final level!", threshold: 7 },
// ];

// export default function Quiz({ name, userId }) {
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [coinCount, setCoinCount] = useState(0);
//   const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
//   const [nasaImage, setNasaImage] = useState("");
//   const [description, setDescription] = useState("");
//   const [isCorrect, setIsCorrect] = useState(null);
//   const [showLevelUpModal, setShowLevelUpModal] = useState(false);

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const initialResponse = await axios.get(`${BASE_URL}${Endpoints.list}`);
//         const quizzesUrl = initialResponse.data.quizzes;
//         if (quizzesUrl) {
//           const quizResponse = await axios.get(quizzesUrl);
//           if (quizResponse.data && quizResponse.data.length > 0) {
//             setQuestions(quizResponse.data);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching questions:", error);
//       }
//     };

//     const savedProgress = JSON.parse(localStorage.getItem("quizProgress"));
//     if (savedProgress) {
//       setCurrentLevelIndex(savedProgress.currentLevelIndex);
//       setCoinCount(savedProgress.coinCount);
//       setCurrentQuestionIndex(savedProgress.currentQuestionIndex);
//     }

//     fetchQuestions();
//   }, []);

//   useEffect(() => {
//     localStorage.setItem(
//       "quizProgress",
//       JSON.stringify({
//         currentLevelIndex,
//         coinCount,
//         currentQuestionIndex,
//       })
//     );
//   }, [currentLevelIndex, coinCount, currentQuestionIndex]);

//   const handleAnswer = async (selectedAnswer) => {
//     const currentQuestion = questions[currentQuestionIndex];
//     if (!currentQuestion) return;

//     try {
//       const response = await axios.post(
//         `${BASE_URL}${Endpoints.quiz}${currentQuestion.id}/answer/`,
//         { answer: selectedAnswer }
//       );

//       const isAnswerCorrect = response.data.correct;
//       const coinChange = isAnswerCorrect ? 5 : -5;

//       setDescription(response.data.description);
//       setNasaImage(response.data.image_url);
//       setIsCorrect(isAnswerCorrect);

//       // Update local coin count
//       const updatedCoinCount = coinCount + coinChange;
//       setCoinCount(updatedCoinCount);

//       // Send updated data (correct/wrong answer) to the backend
//       await axios.post(
//         `${BASE_URL}${Endpoints.user}${userId}/answer_question/`,
//         {
//           is_correct: isAnswerCorrect ? 1 : 0,
//         }
//       );

//       if (updatedCoinCount >= levels[currentLevelIndex + 1]?.threshold) {
//         setCurrentLevelIndex(currentLevelIndex + 1);
//         setShowLevelUpModal(true);
//       }
//     } catch (error) {
//       console.error("Error submitting answer:", error);
//     }
//   };

//   const handleNextQuestion = () => {
//     setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
//     setIsCorrect(null);
//     setDescription("");
//     setNasaImage("");
//   };

//   const handleLevelUpModalClose = () => {
//     setShowLevelUpModal(false);
//     handleNextQuestion();
//   };

//   if (currentQuestionIndex >= questions.length) {
//     return (
//       <div>
//         <h2>Quiz Finished! Your total coins: {coinCount}</h2>
//         <h3>{levels[currentLevelIndex].title} Level Completed!</h3>
//         <p>{levels[currentLevelIndex].note}</p>
//       </div>
//     );
//   }

//   const currentQuestion = questions[currentQuestionIndex];

//   return (
//     <div className="quiz-container">
//       <h2 className="quiz-heading">
//         <span>{name}'s</span> - Current Level: {levels[currentLevelIndex].title}
//       </h2>
//       <p className="quizParagraph">{levels[currentLevelIndex].note}</p>

//       <h3>{currentQuestion?.question}</h3>
//       <div className="choice-wrapper">
//         <div className="choices-container">
//           {currentQuestion?.choices.map((choice, index) => (
//             <button
//               key={index}
//               onClick={() => handleAnswer(choice)}
//               className="answer-button"
//             >
//               {choice}
//             </button>
//           ))}
//         </div>
//       </div>

//       {isCorrect !== null && (
//         <div className="correctWrapper">
//           {isCorrect ? (
//             <div className="correctContainer">
//               <h4 className="CorrectText">Your Answer is Correct!</h4>

//               <div className="ImageDesc">
//                 {nasaImage && <img src={nasaImage} alt="NASA" />}
//                 <p>{description}</p>
//               </div>
//             </div>
//           ) : (
//             <h4>Incorrect! Try again.</h4>
//           )}
//           <button className="nextButton" onClick={handleNextQuestion}>
//             Next Question
//           </button>
//         </div>
//       )}

//       <div
//         style={{ position: "absolute", top: 10, right: 10 }}
//         className="count"
//       >
//         <h4>Coins: {coinCount}</h4>
//       </div>

//       {showLevelUpModal && (
//         <LevelUpModal
//           levelData={LevelData[currentLevelIndex - 1]}
//           onClose={handleLevelUpModalClose}
//           onVideoEnd={handleLevelUpModalClose}
//         />
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Quiz.css";
import Endpoints, { BASE_URL } from "../api/api";
import { LevelData } from "../LevelsData/LevelsData";
import ReactPlayer from "react-player";

const levels = [
  { title: "Beginner", note: "Star Field Navigation", threshold: 3 }, // 3 correct answers to level up
  { title: "Intermediate", note: "You're doing great!", threshold: 6 }, // 6 correct answers to level up
  { title: "Advanced", note: "You're a quiz master!", threshold: 9 }, // 9 correct answers to level up
  { title: "Expert", note: "You reached the final level!", threshold: 12 }, // Final level
];

export default function Quiz({ name, userId }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [coinCount, setCoinCount] = useState(0);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [nasaImage, setNasaImage] = useState("");
  const [description, setDescription] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [isLevelingUp, setIsLevelingUp] = useState(false); // To control video display

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

      const isAnswerCorrect = response.data.correct;
      const coinChange = isAnswerCorrect ? 5 : -5;

      setDescription(response.data.description);
      setNasaImage(response.data.image_url);
      setIsCorrect(isAnswerCorrect);

      // Update local coin count
      const updatedCoinCount = coinCount + coinChange;
      setCoinCount(updatedCoinCount);

      // Send updated data (correct/wrong answer) to the backend
      await axios.post(
        `${BASE_URL}${Endpoints.user}${userId}/answer_question/`,
        {
          is_correct: isAnswerCorrect ? 1 : 0,
        }
      );

      // Check if leveling up after correct answer
      if (
        isAnswerCorrect &&
        updatedCoinCount >= levels[currentLevelIndex].threshold
      ) {
        setIsLevelingUp(true); // Start leveling up process (show video)
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setIsCorrect(null);
    setDescription("");
    setNasaImage("");
  };

  const handleVideoEnd = () => {
    setIsLevelingUp(false); // Hide video after it ends
    setCurrentLevelIndex((prevIndex) => prevIndex + 1); // Move to next level
    handleNextQuestion(); // Continue to the next question
  };

  if (currentQuestionIndex >= questions.length) {
    return (
      <div className="main">
        <h2>Quiz Finished! Your total coins: {coinCount}</h2>
        <h3>{levels[currentLevelIndex].title} Level Completed!</h3>
        <p>{levels[currentLevelIndex].note}</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      {isLevelingUp ? (
        // Show video when leveling up
        <ReactPlayer
          className="level-up-video"
          url={LevelData[currentLevelIndex].videoUrl} // Video for current level
          playing={true}
          controls={true}
          onEnded={handleVideoEnd} // Trigger when video ends
          width="100%"
          height="100%"
        />
      ) : (
        <>
          <h2 className="quiz-heading">
            <span>{name}'s</span> - Current Level:{" "}
            {levels[currentLevelIndex].title}
          </h2>
          <p className="quizParagraph">{levels[currentLevelIndex].note}</p>

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
            <div className="correctWrapper">
              {isCorrect ? (
                <div className="correctContainer">
                  <h4 className="CorrectText">Your Answer is Correct!</h4>

                  <div className="ImageDesc">
                    {nasaImage && <img src={nasaImage} alt="NASA" />}
                    <p>{description}</p>
                  </div>
                </div>
              ) : (
                <h4>Incorrect! Try again.</h4>
              )}
              <button className="nextButton" onClick={handleNextQuestion}>
                Next Question
              </button>
            </div>
          )}

          <div
            style={{ position: "absolute", top: 10, right: 10 }}
            className="count"
          >
            <h4>Coins: {coinCount}</h4>
          </div>
        </>
      )}
    </div>
  );
}
