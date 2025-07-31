import React, { useEffect, useState } from "react";
import api from "../api";
import MeetingCard from "./MeetingCard";
import "./ArchivedClasses.css";

function ArchivedClasses() {
  const [archivedMeetings, setArchivedMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArchivedMeetings = async () => {
    try {
      const res = await api.get("/ScheduledMeeting");
      const now = new Date();
      const pastMeetings = res.data.filter(
        (meeting) => new Date(meeting.endTime) < now
      );
      setArchivedMeetings(pastMeetings);
    } catch (err) {
      console.error("Failed to load archived meetings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchivedMeetings();
  }, []);

  return (
    <div className="archived-classes-page">
      {loading ? (
        <p>Loading...</p>
      ) : archivedMeetings.length === 0 ? (
        <p>No archived meetings available.</p>
      ) : (
        <div className="archived-meetings-grid">
          {archivedMeetings.map((meeting) => (
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
    </div>
  );
}

export default ArchivedClasses;
