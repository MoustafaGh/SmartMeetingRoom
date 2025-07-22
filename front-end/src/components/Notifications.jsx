import React from "react";
import NotificationsCard from "./NotificationsCard";
import "./Notifications.css";

function Notifications() {
  const notifications = [
    {
      id: 1,
      type: "invite",
      meetingTitle: "Project Kickoff",
      details: {
        room: "Room 301",
        inviter: "Alice",
        time: "July 20, 2025 at 10:00 AM",
        duration: "2 hours",
      },
    },
    {
      id: 2,
      type: "reminder",
      meetingTitle: "Project Kickoff",
      details: {
        room: "Room 301",
        time: "July 20, 2025 at 10:00 AM",
        duration: "2 hours",
      },
    },
    {
      id: 3,
      type: "canceled",
      meetingTitle: "Sprint Planning",
      details: {
        reason: "Scheduling conflict",
      },
    },
    {
      id: 4,
      type: "updated",
      meetingTitle: "Team Sync",
      details: {
        updateInfo: "Meeting room has been updated from Room 101 to Room 205",
      },
    },
  ];

  return (
    <div className="notifications-container">
      {/* <h2>Notifications</h2> */}
      {notifications.map((notif) => (
        <NotificationsCard
          key={notif.id}
          type={notif.type}
          meetingTitle={notif.meetingTitle}
          details={notif.details}
        />
      ))}
    </div>
  );
}

export default Notifications;
