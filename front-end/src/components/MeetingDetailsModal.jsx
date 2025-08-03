import { useEffect, useState, useRef } from "react";
import api from "../api";
import "./MeetingDetailsModal.css";

function MeetingDetailsModal({ meeting, onClose }) {
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [momFiles, setMomFiles] = useState([]);
  const [createdByName, setCreatedByName] = useState("");
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [attendeeRes, userRes, momRes] = await Promise.all([
          api.get("/MeetingAttendee"),
          api.get("/User"),
          api.get("/MoM"),
        ]);

        const filteredAttendees = attendeeRes.data.filter(
          (a) => a.scheduledMeetingId === meeting.id
        );

        const userIdToName = {};
        userRes.data.forEach((u) => {
          const fullName = [u.firstName, u.lastName].filter(Boolean).join(" ").trim();
          userIdToName[u.id] = fullName || u.username || `User#${u.id}`;
        });

        const attendeesWithNames = filteredAttendees.map((att) => ({
          id: att.id,
          username: userIdToName[att.userId] || `User#${att.userId}`,
        }));

        setInvitedUsers(attendeesWithNames);

        // Set creator name
        const creatorName = userIdToName[meeting.userId] || `User#${meeting.userId}`;
        setCreatedByName(creatorName);

        const relatedMoMs = momRes.data.filter(
          (m) => m.scheduledMeetingId === meeting.id
        );
        setMomFiles(relatedMoMs);
      } catch (err) {
        console.error("❌ Failed to fetch meeting details:", err);
      }
    };

    if (meeting) fetchDetails();
  }, [meeting]);

  const handleAddClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("File", file);
      formData.append("ScheduledMeetingId", meeting.id);
      formData.append("UserId", localStorage.getItem("userId"));

      await api.post("/MoM", formData);
      e.target.value = "";

      const momRes = await api.get("/MoM");
      const relatedMoMs = momRes.data.filter(
        (m) => m.scheduledMeetingId === meeting.id
      );
      setMomFiles(relatedMoMs);
    } catch (err) {
      console.error("❌ Failed to upload file:", err);
    }
  };

  if (!meeting) return null;

  const start = new Date(meeting.startTime).toLocaleString();
  const end = new Date(meeting.endTime).toLocaleString();

  const getPreviewLink = (filePath) => {
    const fileUrl = `https://localhost:7052/UploadedFiles/${filePath}`;
    if (filePath.endsWith(".pdf")) return fileUrl;
    if (filePath.endsWith(".doc") || filePath.endsWith(".docx")) {
      return `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;
    }
    return fileUrl;
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    switch (ext) {
      case "pdf": return "📕";
      case "doc":
      case "docx": return "📘";
      case "txt": return "🗒️";
      default: return "📁";
    }
  };

  return (
    <div className="meeting-modal-overlay">
      <div className="meeting-modal-content">
        <button className="close-btn" onClick={onClose}>✕</button>

        <div className="meeting-info-left">
          <h2 className="meeting-title">{meeting.title}</h2>
          <p className="time-info">
            <strong style={{ color: "green" }}>Start:</strong> {start}
          </p>
          <p className="time-info">
            <strong style={{ color: "red" }}>End:</strong> {end}
          </p>
          <p className="description">
            <strong>Description:</strong> {meeting.description}
          </p>

          <hr />

          <div className="creator-section">
            <h3>Created By</h3>
            <p>{createdByName}</p>
          </div>

          <div className="audience-section">
            <h3>Invited Users</h3>
            <ul>
              {invitedUsers.map((user) => (
                <li key={user.id}>{user.username}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="meeting-info-right">
          <h3>Submit MoM</h3>
          <button className="mom-button" onClick={handleAddClick}>
            + Add Summary / Note
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
            accept=".pdf,.doc,.docx"
          />

          {momFiles.length > 0 && (
            <ul className="mom-file-list">
              {momFiles.map((m) => (
                <li key={m.id}>
                  <a
                    href={getPreviewLink(m.filePath)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {getFileIcon(m.filePath)} {m.filePath.split("_").slice(1).join("_")}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default MeetingDetailsModal;
