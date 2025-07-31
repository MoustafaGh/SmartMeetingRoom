import HomePage from './HomePage';
import Calendar from './Calendar';
import Notifications from './Notifications';
import EMS from './EMS';
import ArchivedClasses from './ArchivedClasses';
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
      ) : activePage === 'ArchivedClasses' ? (
        <ArchivedClasses />
      ) : (
        <div style={{ padding: '20px' }}>This page doesn't exist yet.</div>
      )}
    </main>
  );
}

export default Main;
