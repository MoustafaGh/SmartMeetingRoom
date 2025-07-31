import MeetingList from "./MeetingList";
import "./Meeting.css";

function Meeting() {
  return (
    <div className="meetings-page">
      {/* <h2 style={{ marginBottom: '20px' }}>All Scheduled Meetings</h2> */}
      <MeetingList userScoped={false} />
    </div>
  );
}

export default Meeting;
