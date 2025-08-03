import React, { useState, useEffect } from 'react';
import api from '../api';
import MeetingDetailsModal from './MeetingDetailsModal';
import './Calendar.css';

const getWeekStart = (date) => {
  const day = date.getDay();
  const diff = date.getDate() - day;
  return new Date(date.setDate(diff));
};

const formatDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

function Calendar() {
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart(new Date()));
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await api.get("/ScheduledMeeting");
        setMeetings(res.data);
      } catch (err) {
        console.error("Failed to fetch meetings:", err);
      }
    };
    fetchMeetings();
  }, []);

  const nextWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(next);
  };

  const prevWeek = () => {
    const prev = new Date(currentWeekStart);
    prev.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(prev);
  };

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const getMeetingsForDay = (date) => {
    const targetDate = formatDate(date);
    return meetings.filter((m) => {
      const meetingDate = formatDate(new Date(m.startTime));
      return meetingDate === targetDate;
    });
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={prevWeek}>&laquo;</button>
        <h2>
          {days[0].toLocaleDateString()} - {days[6].toLocaleDateString()}
        </h2>
        <button onClick={nextWeek}>&raquo;</button>
      </div>

      <div className="week">
        {days.map((day, index) => {
          const dailyMeetings = getMeetingsForDay(day);
          return (
            <div key={index} className="day-column">
              <div className="day-header">
                {day.toLocaleDateString('en-US', { weekday: 'short' })}<br />
                <span className="date">{day.getDate()}</span>
              </div>
              {dailyMeetings.length === 0 ? (
                <p className="no-meetings">No meetings</p>
              ) : (
                <ul className="meeting-list">
                  {dailyMeetings.map((meeting) => (
                    <li
                      key={meeting.id}
                      className="meeting-item"
                      onClick={() => setSelectedMeeting(meeting)}
                    >
                      <strong>
                        {new Date(meeting.startTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </strong>
                      <br />
                      {meeting.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {selectedMeeting && (
        <MeetingDetailsModal
          meeting={selectedMeeting}
          onClose={() => setSelectedMeeting(null)}
        />
      )}
    </div>
  );
}

export default Calendar;
