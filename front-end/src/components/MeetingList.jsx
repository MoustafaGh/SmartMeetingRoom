import MeetingCard from "./MeetingCard";
import MeetingDetailsModal from "./MeetingDetailsModal";
import api from "../api";
import { useEffect, useState } from "react";
import "./MeetingList.css";

function MeetingList({ userScoped = true }) {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const fetchMeetings = async () => {
  try {
    const [meetingRes, attendeeRes] = await Promise.all([
      api.get("/ScheduledMeeting"),
      api.get("/MeetingAttendee"),
    ]);

    const allMeetings = meetingRes.data;
    const attendees = attendeeRes.data;
    const userId = parseInt(localStorage.getItem("userId"));
    const now = new Date();

    let filtered = allMeetings.filter(m => new Date(m.endTime) >= now);

    if (userScoped) {
      const createdByUser = filtered.filter(m => m.userId === userId);
      const invitedMeetingIds = attendees
        .filter(a => a.userId === userId)
        .map(a => a.scheduledMeetingId);

      const invitedTo = filtered.filter(m => invitedMeetingIds.includes(m.id));

      filtered = [...new Map([...createdByUser, ...invitedTo].map(m => [m.id, m])).values()];
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
  if (!meetings.length) return <p>No active meetings scheduled.</p>;

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
          onClick={() => setSelectedMeeting(meeting)}
        />
      ))}

      <MeetingDetailsModal
        meeting={selectedMeeting}
        onClose={() => setSelectedMeeting(null)}
      />
    </div>
  );
}

export default MeetingList;
