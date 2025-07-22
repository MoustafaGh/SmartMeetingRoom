import React, { useState, useEffect } from 'react';
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


function Calendar(){
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart(new Date()));

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
        {days.map((day, index) => (
          <div key={index} className="day-column">
            <div className="day-header">
              {day.toLocaleDateString('en-US', { weekday: 'short' })}<br />
              <span className="date">{day.getDate()}</span>
            </div>
            <p className="no-meetings">No meetings</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
