import React, { useEffect, useState } from "react";
import api from "../api";
import MeetingCard from "./MeetingCard";
import CreateMeetingModal from "./CreateMeetingModal";
import "./Meeting.css";

function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchMeetings = async () => {
    try {
      const res = await api.get("/ScheduledMeeting");
      const now = new Date();
      const activeMeetings = res.data.filter(m => new Date(m.endTime) >= now);
      setMeetings(activeMeetings);
    } catch {
      console.error("Failed to load meetings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  return (
    <div className="meetings-page">
      <div className="meetings-header">
        <button className="create-meeting-btn" onClick={() => setShowModal(true)}>
          + Create Meeting
        </button>
      </div>

      {loading ? (
        <p>Loading meetings...</p>
      ) : meetings.length === 0 ? (
        <p>No active meetings scheduled.</p>
      ) : (
        <div className="meetings-grid">
          {meetings.map(meeting => (
            <MeetingCard
              key={meeting.id}
              title={meeting.title}
              description={meeting.description}
              startTime={meeting.startTime}
              endTime={meeting.endTime}
            />
          ))}
        </div>
      )}

      {showModal && (
        <CreateMeetingModal
          onClose={() => setShowModal(false)}
          onCreate={() => {
            setShowModal(false);
            fetchMeetings();
          }}
        />
      )}
    </div>
  );
}

export default Meetings;
