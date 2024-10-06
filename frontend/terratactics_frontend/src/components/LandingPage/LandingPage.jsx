import React, { useState, useEffect } from "react";
import "./LandingPage.css";
import ReactPlayer from "react-player";
import axios from "axios";
import HeroVideo from "../../assets/video/herosectionVideo.mp4";
import { BASE_URL, Endpoints } from "../../api/api";

export function LandingPage({ onStart }) {
  const [name, setName] = useState("");
  const [videoEnded, setVideoEnded] = useState(false);
  const [error, setError] = useState("");

  const handleStart = async () => {
    if (name.trim()) {
      try {
        const response = await axios.post(BASE_URL + Endpoints.register, {
          username: name,
        });
        if (response.status === 201) {
          onStart(name);
          localStorage.setItem("username", name); // Store username in localStorage
        } else {
          setError("Failed to save username. Please try again.");
        }
      } catch (error) {
        if (error.response) {
          setError(
            error.response.data.detail || "An error occurred. Please try again."
          );
        } else {
          setError("An error occurred. Please try again.");
        }
      }
    } else {
      setError("Please enter a valid name.");
    }
  };

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      onStart(savedUsername); // If username is stored, automatically start quiz
    }
  }, [onStart]);

  return (
    <div className="landing-page">
      {!videoEnded ? (
        <ReactPlayer
          className="full-video"
          url={HeroVideo}
          playing={true}
          muted={true}
          controls={false}
          width="100%"
          height="100vh"
          onEnded={() => setVideoEnded(true)}
        />
      ) : (
        <div className="input-section">
          <h1>Welcome to the Quiz!</h1>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={handleStart}>Start Quiz</button>
          {error && <p className="error-message">{error}</p>}
        </div>
      )}
    </div>
  );
}
