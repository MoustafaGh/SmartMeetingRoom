import React, { useEffect, useState } from "react";
import NotificationsCard from "./NotificationsCard";
import MeetingDetailsModal from "./MeetingDetailsModal";
import api from "../api";
import "./Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [meetingsMap, setMeetingsMap] = useState({});
  const [userMap, setUserMap] = useState({});
  const [roomMap, setRoomMap] = useState({});
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = parseInt(localStorage.getItem("userId"));
        if (!userId) {
          console.error("No userId found in localStorage.");
          return;
        }

        const [notifRes, meetingRes, userRes, roomRes] = await Promise.all([
          api.get(`/Notification/user/${userId}`),
          api.get("/ScheduledMeeting"),
          api.get("/User"),
          api.get("/Room"),
        ]);

        const meetingMap = {};
        meetingRes.data.forEach((m) => {
          meetingMap[m.id] = m;
        });

        const userMapTemp = {};
        userRes.data.forEach((u) => {
          userMapTemp[u.id] = `${u.firstName} ${u.lastName}`.trim();
        });

        const roomMapTemp = {};
        roomRes.data.forEach((r) => {
          roomMapTemp[r.id] = r.name;
        });

        setMeetingsMap(meetingMap);
        setUserMap(userMapTemp);
        setRoomMap(roomMapTemp);
        setNotifications(notifRes.data);
      } catch (err) {
        console.error("❌ Failed to load data", err);
      }
    };

    fetchData();
  }, []);

  const getNotificationDetails = (notif) => {
    const meeting = meetingsMap[notif.scheduledMeetingId];
    if (!meeting) return {};

    const inviterName = userMap[meeting.userId] || "Unknown";
    const roomName = roomMap[meeting.roomId] || "Unknown Room";

    const lowerMsg = notif.message?.toLowerCase() || "";
    if (lowerMsg.includes("invited")) {
      return {
        inviter: inviterName,
        room: roomName,
        time: new Date(meeting.startTime).toLocaleString(),
        duration:
          Math.round((new Date(meeting.endTime) - new Date(meeting.startTime)) / 60000) + " minutes",
      };
    } else if (lowerMsg.includes("updated")) {
      return { updateInfo: notif.message };
    } else if (lowerMsg.includes("canceled")) {
      return { reason: notif.message };
    } else {
      return {
        room: roomName,
        time: new Date(meeting.startTime).toLocaleString(),
        duration:
          Math.round((new Date(meeting.endTime) - new Date(meeting.startTime)) / 60000) + " minutes",
      };
    }
  };

  const getNotificationType = (message) => {
    const msg = message?.toLowerCase() || "";
    if (msg.includes("invite")) return "invite";
    if (msg.includes("update")) return "updated";
    if (msg.includes("cancel")) return "canceled";
    return "reminder";
  };

  const handleClick = async (notif) => {
    const meeting = meetingsMap[notif.scheduledMeetingId];
    if (!meeting) return;

    if (!notif.isRead) {
      try {
        await api.put(`/Notification/${notif.id}`, { isRead: true });
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
        );
      } catch (err) {
        console.error("❌ Failed to update notification status:", err);
      }
    }

    setSelectedMeeting(meeting);
  };

  return (
    <div className="notifications-container">
      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        notifications.map((notif) => {
          const meeting = meetingsMap[notif.scheduledMeetingId];
          if (!meeting) return null;

          return (
            <div key={notif.id} onClick={() => handleClick(notif)} style={{ cursor: "pointer" }}>
              <NotificationsCard
                type={getNotificationType(notif.message)}
                meetingTitle={meeting.title}
                details={getNotificationDetails(notif)}
              />
            </div>
          );
        })
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

export default Notifications;
