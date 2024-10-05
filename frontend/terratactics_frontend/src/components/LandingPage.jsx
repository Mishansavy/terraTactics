import React, { useState } from "react";
import "./LandingPage.css";
import ReactPlayer from "react-player";
import axios from "axios"; // Import axios to make HTTP requests
import HeroVideo from "../assets/video/herosectionVideo.mp4"; // Ensure this path is correct

export function LandingPage({ onStart }) {
  const [name, setName] = useState("");
  const [videoEnded, setVideoEnded] = useState(false); // To track if video ended
  const [error, setError] = useState(""); // State to hold any error messages

  const handleStart = async () => {
    if (name.trim()) {
      try {
        // Send username to the backend
        const response = await axios.post(
          "http://192.168.133.208:8000/api/users/",
          {
            Username: name, // Send the username as per the field name
          }
        );

        // Optional: Check the response status or data
        if (response.status === 201) {
          // Call the onStart function with the user's name if the request is successful
          onStart(name);
        } else {
          setError("Failed to save username. Please try again.");
        }
      } catch (error) {
        console.error("Error sending username to backend:", error);
        setError("An error occurred. Please try again.");
      }
    } else {
      setError("Please enter a valid name."); // Set error if the name is empty
    }
  };

  return (
    <div className="landing-page">
      {!videoEnded ? (
        <ReactPlayer
          className="full-video" // Custom class for styling
          url={HeroVideo}
          playing={true} // Automatically start playing
          muted={true} // Mute the video for auto-play
          controls={false} // Hide video controls
          width="100%" // Make video full width
          height="100vh" // Make video full height
          onEnded={() => setVideoEnded(true)} // Set videoEnded to true when video finishes
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
          {error && <p className="error-message">{error}</p>}{" "}
          {/* Display error message */}
        </div>
      )}
    </div>
  );
}
