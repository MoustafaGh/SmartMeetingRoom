import React, { useEffect, useState } from "react";
import api from "../api";
import MeetingCard from "./MeetingCard";
import MeetingDetailsModal from "./MeetingDetailsModal";
import "./ArchivedMeeting.css";

function ArchivedMeeting() {
  const [archivedMeetings, setArchivedMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

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
    <div className="archived-meetings-page">
      {loading ? (
        <p>Loading...</p>
      ) : archivedMeetings.length === 0 ? (
        <p>No archived meetings available.</p>
      ) : (
        <div className="archived-meetings-grid">
          {archivedMeetings.map((meeting) => (
            <MeetingCard
              key={meeting.id}
              id={meeting.id}
              title={meeting.title}
              description={meeting.description}
              startTime={meeting.startTime}
              endTime={meeting.endTime}
              onClick={() => setSelectedMeeting(meeting)}
            />
          ))}
        </div>
      )}

      
      {selectedMeeting && (
        <MeetingDetailsModal
          meeting={selectedMeeting}
          onClose={() => setSelectedMeeting(null)}
        />
      )}
    </div>
  );
}

export default ArchivedMeeting;
