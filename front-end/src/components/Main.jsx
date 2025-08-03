import HomePage from './HomePage';
import Calendar from './Calendar';
import Notifications from './Notifications';
import EMS from './EMS';
import ArchivedClasses from './ArchivedMeeting';
import './Main.css';

function Main({ activePage,}) {
  return (
    <main className="main">
      {activePage === 'Home' ? (
        <HomePage />
      ) : activePage === 'Calendar' ? (
        <Calendar />
      ) : activePage === 'Notifications' ? (
        <Notifications />
      ) : activePage === 'EMS' ? (
        <EMS />
      ) : activePage === 'ArchivedMeeting' ? (
        <ArchivedClasses />
      ) : (
        <div style={{ padding: '20px' }}>This page doesn't exist yet.</div>
      )}
    </main>
  );
}

export default Main;
