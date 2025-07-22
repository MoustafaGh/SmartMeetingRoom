import MeetingCard from "./MeetingCard";
import './HomePage.css'

function HomePage(){
    const meetings = [
    {
      title: "Frontend Design Review",
      description: "Discuss the new UI design for the dashboard.",
      time: "10:00 AM",
      duration: "1h"
    },
    {
      title: "Backend API Planning",
      description: "Plan endpoints for user and room management.",
      time: "2:00 PM",
      duration: "45m"
    }
  ];
    return(
        <div className='HomePage'>
                {meetings.map((meeting, index) => (
            <MeetingCard
          key={index}
          title={meeting.title}
          description={meeting.description}
          time={meeting.time}
          duration={meeting.duration}
        />
      ))}
        </div>
    )
}
export default HomePage;