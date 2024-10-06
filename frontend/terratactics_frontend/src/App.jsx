// src/App.js
import React, { useEffect, useState } from "react";
import { LandingPage } from "./components/LandingPage/LandingPage";
import Quiz from "./components/Quiz/Quiz";
import axios from "axios";
import bg from "./assets/sky.jpg";

const App = () => {
  const [name, setName] = useState("");
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    const fetchNasaImage = async () => {
      try {
        const response = await axios.get(
          "https://api.nasa.gov/planetary/apod?api_key=oieouBpKog1WD4etk9GYmyeZVHnLEdOYOB6WU0AY"
        );
        setBackgroundImage(response.data.url);
      } catch (error) {
        console.error("Error fetching NASA image: ", error);
        setBackgroundImage(bg);
      }
    };
    fetchNasaImage();
  }, []);

  const startQuiz = (userName) => {
    setName(userName);
    setIsQuizStarted(true);
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {!isQuizStarted ? (
        <LandingPage onStart={startQuiz} />
      ) : (
        <Quiz name={name} />
      )}
    </div>
  );
};

export default App;
