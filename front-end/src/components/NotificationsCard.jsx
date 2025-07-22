import "./NotificationsCard.css";

function NotificationsCard({ type, meetingTitle, details }) {
  const handleAccept = () => {
    alert(`You accepted the invitation for: ${meetingTitle}`);
  };

  const handleReject = () => {
    alert(`You rejected the invitation for: ${meetingTitle}`);
  };

  const renderContent = () => {
    switch (type) {
      case "invite":
        return (
          <>
            <h4 className="notif-title">Meeting Invitation</h4>
            <p><strong>Title:</strong> {meetingTitle}</p>
            <p>
              <strong>Room:</strong> {details.room} <br />
              <strong>Invited By:</strong> {details.inviter} <br />
              <strong>Time:</strong> {details.time} <br />
              <strong>Duration:</strong> {details.duration}
            </p>
            <div className="notif-actions">
              <button className="btn accept" onClick={handleAccept}>
                Accept
              </button>
              <button className="btn reject" onClick={handleReject}>
                Reject
              </button>
            </div>
          </>
        );
      case "reminder":
  return (
    <>
      <h4 className="notif-title">Meeting Reminder</h4>
      <p className="reminder-text">Reminder: This meeting is tomorrow!</p>
      <p><strong>Title:</strong> {meetingTitle}</p>
      <p>
        <strong>Room:</strong> {details.room} <br />
        <strong>Time:</strong> {details.time} <br />
        <strong>Duration:</strong> {details.duration}
      </p>
    </>
  );
      case "canceled":
        return (
          <>
            <h4 className="notif-title canceled">Meeting Canceled</h4>
            <p><strong>Title:</strong> {meetingTitle}</p>
            <p><strong>Reason:</strong> {details.reason}</p>
          </>
        );
      case "updated":
        return (
          <>
            <h4 className="notif-title updated">Meeting Updated</h4>
            <p><strong>Title:</strong> {meetingTitle}</p>
            <p>{details.updateInfo}</p>
          </>
        );
      default:
        return <p>Unknown Notification Type</p>;
    }
  };

  return <div className={`notification-card ${type}`}>{renderContent()}</div>;
}

export default NotificationsCard;
