import React, { useRef, useEffect } from "react";
import "./LevelUpModal.css";

export default function LevelUpModal({ levelData, onClose, onVideoEnd }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener("ended", onVideoEnd);
      return () => {
        videoRef.current.removeEventListener("ended", onVideoEnd);
      };
    }
  }, [onVideoEnd]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <img src={levelData.imageUrl} alt={`Level ${levelData.level}`} />
        <video
          ref={videoRef}
          src={levelData.videoUrl}
          autoPlay
          muted
          controls
        />
      </div>
    </div>
  );
}
