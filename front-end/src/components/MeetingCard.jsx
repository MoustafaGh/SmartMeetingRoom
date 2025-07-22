import React from "react";
import "./MeetingCard.css";

function MeetingCard({ title, description, time, duration }) {
  return (
    <div className="meeting-card">
      <div className="meeting-header">
        <h3>{title}</h3>
      </div>
      <div className="meeting-body">
        <p className="meeting-description">{description}</p>
        <div className="meeting-details">
          <span className="time">🕒 {time}</span>
          <span className="duration">⏳ {duration}</span>
        </div>
      </div>
    </div>
  );
}

export default MeetingCard;
