import MeetingList from "./MeetingList";
import CreateMeetingModal from "./CreateMeetingModal";
import { useState } from "react";
import "./HomePage.css";

function HomePage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="home-page">
      <div className="Create-Meeting">
        <button className="create-meeting-btn" onClick={() => setShowModal(true)}>
          + Create Meeting
        </button>
      </div>

      <MeetingList userScoped={true} />

      {showModal && (
        <CreateMeetingModal
          onClose={() => setShowModal(false)}
          onCreate={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default HomePage;
