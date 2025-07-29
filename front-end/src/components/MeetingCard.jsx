import React from "react";
import "./MeetingCard.css";

function MeetingCard({ title, description, startTime, endTime }) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMinutes = Math.floor((end - start) / 60000);
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  const duration =
    hours && minutes
      ? `${hours} hr ${minutes} min`
      : hours
      ? `${hours} hr`
      : `${minutes} min`;

  const formattedTime = start.toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="meeting-card">
      <div className="meeting-header">
        <h3>{title}</h3>
      </div>
      <div className="meeting-body">
        <p className="meeting-description">{description}</p>
        <div className="meeting-details">
          <span className="time">🕒 {formattedTime}</span>
          <span className="duration">⏳ {duration}</span>
        </div>
      </div>
    </div>
  );
}

export default MeetingCard;
