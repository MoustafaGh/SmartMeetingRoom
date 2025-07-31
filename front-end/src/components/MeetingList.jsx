import { useEffect, useState } from "react";
import MeetingCard from "./MeetingCard";
import api from "../api";
import "./MeetingList.css";

function MeetingList({ userScoped = true }) {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMeetings = async () => {
    try {
      const res = await api.get("/ScheduledMeeting");
      const now = new Date();
      let filtered = res.data.filter(m => new Date(m.endTime) >= now);

      if (userScoped) {
        const userId = parseInt(localStorage.getItem("userId"));
        filtered = filtered.filter(m => m.userId === userId);
      }

      setMeetings(filtered);
    } catch (err) {
      console.error("Failed to fetch meetings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  if (loading) return <p>Loading meetings...</p>;
  if (!meetings || meetings.length === 0) return <p>No active meetings scheduled.</p>;

  return (
    <div className="meeting-list-grid">
      {meetings.map(meeting => (
        <MeetingCard
          key={meeting.id}
          id={meeting.id}
          title={meeting.title}
          description={meeting.description}
          startTime={meeting.startTime}
          endTime={meeting.endTime}
        />
      ))}
    </div>
  );
}

export default MeetingList;
