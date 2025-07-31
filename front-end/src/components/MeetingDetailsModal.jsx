import { useEffect, useState } from "react";
import api from "../api";
import "./MeetingDetailsModal.css";

function MeetingDetailsModal({ meeting, onClose }) {
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [mom, setMom] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [attendeeRes, usersRes, momRes] = await Promise.all([
          api.get("/MeetingAttendee"),
          api.get("/User"),
          api.get("/MoM")
        ]);

        const filtered = attendeeRes.data.filter(
          (a) => a.scheduledMeetingId === meeting.id
        );
        setInvitedUsers(filtered);

        const userMapObj = {};
        for (let user of usersRes.data) {
          userMapObj[user.id] = `${user.firstName} ${user.lastName}`;
        }
        setUserMap(userMapObj);

        const momForMeeting = momRes.data.find(
          (m) => m.scheduledMeetingId === meeting.id
        );
        setMom(momForMeeting);
      } catch (err) {
        console.error("Failed to fetch meeting details:", err);
      }
    };

    if (meeting) fetchDetails();
  }, [meeting]);

  if (!meeting) return null;

  const start = new Date(meeting.startTime).toLocaleString();
  const end = new Date(meeting.endTime).toLocaleString();

  return (
    <div className="meeting-modal-overlay">
      <div className="meeting-modal-grid">
        <div className="meeting-info-left">
          <h2 className="meeting-title">{meeting.title}</h2>
          <p className="time start"><strong>Start:</strong> {start}</p>
          <p className="time end"><strong>End:</strong> {end}</p>
          <p className="description">{meeting.description}</p>
          <hr />
          <div className="audience">
            <h3>Invited Users</h3>
            <ul>
              {invitedUsers.map((user) => (
                <li key={user.id}>{userMap[user.userId] || `User #${user.userId}`}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="meeting-info-right">
          <h3>Audience Tools</h3>
          <button className="add-btn">+ Add Summary / Note</button>
          <button className="add-btn">+ Upload MoM PDF</button>
        </div>

        <button className="close-btn" onClick={onClose}>✕</button>
      </div>
    </div>
  );
}

export default MeetingDetailsModal;
